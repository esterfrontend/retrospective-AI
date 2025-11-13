import type { GeminiResponse } from "~/models/gemini";

export const getMockGeminiResponse = (): GeminiResponse => {
  return {
    success: true,
    data: {
      retoType: "columns",
      columns: [
        {
          id: "start",
          label: "Start",
          description: "Things we should start doing",
          color: "#10B981",
        },
        {
          id: "stop",
          label: "Stop",
          description: "Things we should stop doing",
          color: "#EF4444",
        },
        {
          id: "continue",
          label: "Continue",
          description: "Things we should continue doing",
          color: "#3B82F6",
        },
      ],
      instructions:
        "This is a mock response for demonstration purposes. The Start/Stop/Continue format is ideal for teams looking to identify actionable improvements. Use the Start column for new practices, Stop for things to eliminate, and Continue for what's working well.",
      suggestions:
        "Focus on specific, actionable items. Be honest and constructive. Prioritize items that will have the most impact on team productivity and satisfaction.",
      metadata: {
        layout: "horizontal",
        color_scheme: "blue",
      },
    },
    timestamp: new Date().toISOString(),
  };
};

