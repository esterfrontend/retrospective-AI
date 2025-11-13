import { GoogleGenerativeAI } from "@google/generative-ai";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { retrospectiveData } = body;

  if (!retrospectiveData) {
    throw createError({
      statusCode: 400,
      message: "retrospectiveData is required",
    });
  }

  // Validate required fields
  if (
    !retrospectiveData.id ||
    !retrospectiveData.template ||
    !retrospectiveData.columns ||
    !Array.isArray(retrospectiveData.columns) ||
    !retrospectiveData.notes ||
    !Array.isArray(retrospectiveData.notes)
  ) {
    throw createError({
      statusCode: 400,
      message:
        "retrospectiveData must include id, template, columns array, and notes array",
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
  "summary": "A comprehensive summary of the retrospective session, highlighting main themes, patterns, and overall team sentiment",
  "keyInsights": [
    "Key insight 1",
    "Key insight 2",
    "Key insight 3"
  ],
  "actionPoints": [
    {
      "id": "ap1",
      "title": "Action point title",
      "description": "Detailed description of the action point",
      "priority": "high" or "medium" or "low",
      "assignedTo": "optional user or team name",
      "dueDate": "optional ISO date string"
    }
  ],
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ]
}

Your role is to:
- Analyze all the notes from the retrospective session
- Identify patterns, themes, and common concerns across different columns
- Create a clear, actionable summary that captures the essence of the discussion
- Extract key insights that highlight important observations
- Generate specific, measurable action points with priorities
- Provide recommendations for team improvement

Guidelines:
- The summary should be 2-4 paragraphs, comprehensive but concise
- Key insights should be 3-7 bullet points highlighting the most important observations
- Action points should be specific, actionable, and prioritized (high/medium/low)
- Recommendations should be practical and implementable
- Focus on actionable items that the team can actually execute
- Consider the context of the retrospective template/columns when analyzing notes
- Group similar notes together to identify patterns
- Prioritize action points based on impact and feasibility`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction,
    });

    // Format the retrospective data for the prompt
    const columnsInfo = retrospectiveData.columns
      .map((col: { id: string; label: string }) => `- ${col.label} (${col.id})`)
      .join("\n");

    const notesByColumn: Record<string, any[]> = {};
    retrospectiveData.notes.forEach((note: any) => {
      if (!notesByColumn[note.columnId]) {
        notesByColumn[note.columnId] = [];
      }
      notesByColumn[note.columnId].push(note);
    });

    const notesInfo = Object.entries(notesByColumn)
      .map(([columnId, notes]) => {
        const column = retrospectiveData.columns.find(
          (col: { id: string }) => col.id === columnId
        );
        return `\n${column?.label || columnId}:\n${notes
          .map(
            (note: any) =>
              `  - ${note.content} (by user ${note.userId}, ${new Date(
                note.createdAt
              ).toLocaleDateString()})`
          )
          .join("\n")}`;
      })
      .join("\n");

    const prompt = `Analyze the following retrospective session data and generate a comprehensive summary with key insights, action points, and recommendations.

Retrospective ID: ${retrospectiveData.id}
Template: ${retrospectiveData.template}

Columns:
${columnsInfo}

Notes:
${notesInfo}

Please analyze all the notes, identify patterns and themes, and provide:
1. A comprehensive summary
2. Key insights (3-7 items)
3. Specific action points with priorities
4. Practical recommendations

Respond with the JSON structure as specified in your instructions.`;

    console.log("Generating summary for retrospective:", retrospectiveData.id);
    const result = await model.generateContent(prompt);
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

    // Validate required fields
    if (!parsedResponse.summary || typeof parsedResponse.summary !== "string") {
      throw createError({
        statusCode: 500,
        message: "Response must include a summary string",
      });
    }

    if (
      !parsedResponse.keyInsights ||
      !Array.isArray(parsedResponse.keyInsights) ||
      parsedResponse.keyInsights.length === 0
    ) {
      throw createError({
        statusCode: 500,
        message: "Response must include a non-empty keyInsights array",
      });
    }

    if (
      !parsedResponse.actionPoints ||
      !Array.isArray(parsedResponse.actionPoints)
    ) {
      throw createError({
        statusCode: 500,
        message: "Response must include an actionPoints array",
      });
    }

    if (
      !parsedResponse.recommendations ||
      !Array.isArray(parsedResponse.recommendations)
    ) {
      throw createError({
        statusCode: 500,
        message: "Response must include a recommendations array",
      });
    }

    // Validate action points structure
    parsedResponse.actionPoints.forEach((ap: any, index: number) => {
      if (!ap.id || !ap.title || !ap.description || !ap.priority) {
        throw createError({
          statusCode: 500,
          message: `Action point at index ${index} is missing required fields (id, title, description, priority)`,
        });
      }
      if (!["high", "medium", "low"].includes(ap.priority)) {
        throw createError({
          statusCode: 500,
          message: `Action point at index ${index} has invalid priority. Must be "high", "medium", or "low"`,
        });
      }
    });

    return {
      success: true,
      data: parsedResponse,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Gemini Summary API Error:", error);

    // If it's already a createError, re-throw it
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate summary";

    throw createError({
      statusCode: 500,
      message: `Gemini Summary API Error: ${errorMessage}`,
    });
  }
});
