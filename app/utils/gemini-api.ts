import type { GeminiResponse, GeminiSummaryResponse } from "~/models/gemini";
import { getMockGeminiResponse } from "./mocks";

export const fetchGeminiSuggestion = async (
  prompt: string
): Promise<GeminiResponse> => {
  if (!prompt.trim()) {
    throw new Error("Prompt is required");
  }

  try {
    const response = await $fetch<GeminiResponse>("/api/gemini", {
      method: "POST",
      body: {
        prompt: prompt.trim(),
      },
    });
    console.log("Gemini Response:", response);
    return response;
  } catch (err: any) {
    const errorMessage = err?.data?.message || err?.message || "Unknown error";

    // Check if it's the overloaded error and return mock response
    if (
      errorMessage.toLowerCase().includes("overloaded") ||
      errorMessage.toLowerCase().includes("try again later")
    ) {
      console.log("Model overloaded, returning mock response");
      return getMockGeminiResponse();
    }

    throw new Error(errorMessage);
  }
};

export const fetchGeminiSummary = async (
  retrospectiveData: any
): Promise<GeminiSummaryResponse> => {
  if (!retrospectiveData) {
    throw new Error("Retrospective data is required");
  }

  const response = await $fetch<GeminiSummaryResponse>("/api/gemini-summary", {
    method: "POST",
    body: {
      retrospectiveData,
    },
  });
  console.log("Gemini Summary Response:", response);
  return response;
};
