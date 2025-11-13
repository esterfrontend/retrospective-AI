import { GoogleGenerativeAI } from "@google/generative-ai";

const RETRO_TYPES = ["columns", "quadrant", "free"] as const;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { prompt } = body;

  if (!prompt) {
    throw createError({
      statusCode: 400,
      message: "Prompt is required",
    });
  }

  const config = useRuntimeConfig();
  const apiKey = config.geminiApiKey;

  if (!apiKey) {
    console.error("GEMINI_API_KEY is not configured");
    throw createError({
      statusCode: 500,
      message:
        "Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file",
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const systemInstruction = `You are a professional retrospective facilitator with extensive experience in agile methodologies, team dynamics, and continuous improvement processes.

CRITICAL: You MUST respond ONLY with valid JSON in the following exact structure. Do not include any markdown, code blocks, or additional text outside the JSON:

{
  "retoType": "one_of_the_three_dynamics_below",
  "columns": [
    { "id": "column_id", "label": "Dynamic Label", "description": "Column description", "color": "hex_color_or_color_name" }
  ],
  "instructions": "Brief explanation of why this dynamic was chosen",
  "suggestions": "Actionable suggestions for the team",
  "metadata": {
    "layout": "horizontal" or "vertical",
    "color_scheme": "blue" or another color name
  }
}

The retoType MUST be one of these 3 constant dynamics (choose the most appropriate based on the team's needs and the prompt):

1. "columns" - Linear column layout for sequential or categorized feedback
   - Use for: Start/Stop/Continue, Mad/Sad/Glad, or any linear categorization
   - Columns: Create 2-5 columns with dynamic labels based on the prompt (e.g., "start", "stop", "continue" OR "mad", "sad", "glad" OR custom labels that fit the context)
   - Layout: Typically "horizontal" for columns
   
2. "quadrant" - 2x2 grid layout for multi-dimensional analysis
   - Use for: 4Ls (Liked, Learned, Lacked, Longed), or any 2x2 categorization
   - Columns: MUST have exactly 4 columns arranged in a 2x2 grid
   - Create dynamic labels based on the prompt (e.g., "liked", "learned", "lacked", "longed" OR custom quadrant labels)
   - Layout: "horizontal" or "vertical" depending on the context
   
3. "free" - Visual representation with thematic elements
   - Use for: Sailboat (wind, anchor, rocks, island), Speed Car, or other visual metaphors
   - Columns: Create 3-5 columns with dynamic labels that represent visual elements
   - Examples: For sailboat use "wind", "anchor", "rocks", "island". For other images, create appropriate thematic labels.
   - Layout: Typically "horizontal" for free/visual retrospectives

IMPORTANT: The column labels (id and label) are DYNAMIC and should be created based on the user's prompt and the chosen dynamic. Do not use fixed labels - be creative and contextually appropriate. The number of columns should match the dynamic:
- "columns": 2-5 columns
- "quadrant": exactly 4 columns
- "free": 3-5 columns

Each column MUST include a "color" field. Use hex color codes (e.g., "#3B82F6" for blue, "#10B981" for green) or standard color names. Choose distinct, visually appealing colors that complement each other and match the column's theme or emotion. For example:
- Positive columns (Start, Liked): use warm/positive colors like green (#10B981), blue (#3B82F6), or purple (#8B5CF6)
- Negative columns (Stop, Lacked): use cooler colors like red (#EF4444), orange (#F59E0B), or gray (#6B7280)
- Neutral columns (Continue, Learned): use balanced colors like yellow (#EAB308), teal (#14B8A6), or indigo (#6366F1)

Based on the user's prompt, select the most appropriate retoType and create dynamic, contextually relevant columns with meaningful labels, descriptions, and distinct colors. The instructions should explain why this dynamic was chosen. Provide actionable suggestions. Choose appropriate layout and color scheme.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction,
    });

    const enhancedPrompt = `${prompt}\n\nPlease respond with the JSON structure as specified in your instructions.`;

    console.log("Prompt:", enhancedPrompt);
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response - remove markdown code blocks if present
    text = text.trim();
    if (text.startsWith("```json")) {
      text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (text.startsWith("```")) {
      text = text.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    // Parse and validate JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", text);
      throw createError({
        statusCode: 500,
        message: "Failed to parse Gemini response as JSON",
      });
    }

    // Validate retoType
    if (!RETRO_TYPES.includes(parsedResponse.retoType as any)) {
      throw createError({
        statusCode: 500,
        message: `Invalid retoType. Must be one of: ${RETRO_TYPES.join(", ")}`,
      });
    }

    // Validate required fields
    if (
      !parsedResponse.columns ||
      !Array.isArray(parsedResponse.columns) ||
      parsedResponse.columns.length === 0
    ) {
      throw createError({
        statusCode: 500,
        message: "Response must include a non-empty columns array",
      });
    }

    // Validate quadrant must have exactly 4 columns
    if (
      parsedResponse.retoType === "quadrant" &&
      parsedResponse.columns.length !== 4
    ) {
      throw createError({
        statusCode: 500,
        message: "Quadrant retoType must have exactly 4 columns",
      });
    }

    // Validate column count ranges
    if (parsedResponse.retoType === "columns") {
      if (
        parsedResponse.columns.length < 2 ||
        parsedResponse.columns.length > 5
      ) {
        throw createError({
          statusCode: 500,
          message: "Columns retoType must have between 2 and 5 columns",
        });
      }
    }

    if (parsedResponse.retoType === "free") {
      if (
        parsedResponse.columns.length < 3 ||
        parsedResponse.columns.length > 5
      ) {
        throw createError({
          statusCode: 500,
          message: "Free retoType must have between 3 and 5 columns",
        });
      }
    }

    return {
      success: true,
      data: parsedResponse,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Gemini API Error:", error);

    // If it's already a createError, re-throw it
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate content";

    throw createError({
      statusCode: 500,
      message: `Gemini API Error: ${errorMessage}`,
    });
  }
});
