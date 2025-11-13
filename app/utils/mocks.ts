import type { GeminiResponse, GeminiSummaryResponse } from "~/models/gemini";

export const getMockGeminiResponse = (): GeminiResponse => {
  return {
    success: true,
    data: {
      retroType: "columns",
      columns: [
        {
          id: "start",
          label: "Start Doing",
          description: "What new practices or initiatives should we begin?",
          color: "#10B981",
        },
        {
          id: "stop",
          label: "Stop Doing",
          description:
            "What practices or activities are no longer serving us and should be discontinued?",
          color: "#EF4444",
        },
        {
          id: "continue",
          label: "Continue Doing",
          description: "What are we doing well and should keep doing?",
          color: "#3B82F6",
        },
      ],
      instructions:
        "This classic 'Start, Stop, Continue' dynamic is chosen for its simplicity and effectiveness in facilitating a broad reflection on team processes and performance. It allows the team to identify areas for improvement, eliminate inefficiencies, and reinforce successful practices.",
      suggestions:
        "Prioritize the most impactful items from each column during the discussion. For 'Start' items, define clear ownership and a realistic timeline. For 'Stop' items, discuss the impact of discontinuing them. For 'Continue' items, identify what makes them successful and how to sustain them. Aim for 1-3 actionable items to commit to for the next sprint/period.",
      metadata: {
        layout: "horizontal",
        color_scheme: "blue",
      },
    },
    timestamp: "2025-11-13T16:41:16.660Z",
  };
};

export const getMockGeminiSummaryResponse = (): GeminiSummaryResponse => {
  return {
    success: true,
    data: {
      summary:
        "The retrospective session was marked by extremely minimal and generic input, primarily from a single participant, Dani. The notes 'sddsadsa' for 'Start Doing' and 'dsadsadsa' for 'Stop Doing' offered no specific context, details, or actionable insights regarding team processes, successes, or challenges. Consequently, it was impossible to identify any discernible patterns, common themes, or specific areas of improvement based solely on the provided data. The session, while initiated, did not yield substantive feedback necessary for a meaningful analysis or the generation of specific action points related to team operations. The 'Continue Doing' column received no input.",
      keyInsights: [
        "Only one participant (Dani) provided any input during the retrospective session.",
        "The feedback provided was extremely generic and lacked specific details, examples, or context.",
        "No discernible patterns, common themes, or specific areas for improvement could be identified from the submitted notes.",
        "The 'Continue Doing' column remained empty, indicating a lack of feedback on current positive practices.",
        "The minimal input suggests a potential challenge with engagement, clarity of purpose, or psychological safety within the retrospective process.",
      ],
      actionPoints: [
        {
          id: "ap1",
          title: "Improve feedback specificity in retrospectives",
          description:
            "The facilitator should introduce guidelines or a brief exercise at the start of the next retrospective to encourage participants to provide detailed, specific, and actionable feedback rather than generic placeholders. This will help in identifying concrete issues and areas for improvement.",
          priority: "high",
          assignedTo: "Facilitator",
          dueDate: null,
        },
        {
          id: "ap2",
          title: "Boost team engagement in retrospectives",
          description:
            "The team facilitator should review and implement strategies to increase overall participation and ensure all team members feel comfortable and empowered to contribute detailed feedback. This could include exploring different retrospective formats or pre-session prompts.",
          priority: "high",
          assignedTo: "Facilitator",
          dueDate: null,
        },
      ],
      recommendations: [
        "Consider providing specific examples of good feedback (e.g., 'Instead of 'bad code', try 'The high cyclomatic complexity in Module X caused delays during testing') to guide team members in framing their input for future sessions.",
        "Explore alternative retrospective techniques (e.g., 'Sailboat', 'Starfish', 'Mad Sad Glad') to stimulate different types of reflection and encourage broader, more specific participation.",
        "Conduct a brief anonymous survey or follow-up with individual contributors to understand any potential barriers to providing more detailed feedback during retrospective sessions (e.g., time constraints, comfort level, perceived value of the retro).",
        "Reinforce the purpose and value of retrospectives to the team, emphasizing how their specific input directly leads to actionable improvements and a better working environment.",
      ],
    },
    timestamp: "2025-11-13T17:47:54.291Z",
  };
};
