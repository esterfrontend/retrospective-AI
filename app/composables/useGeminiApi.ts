import type { GeminiResponse, GeminiSummaryResponse } from "~/models/gemini";
import {
  fetchGeminiSuggestion,
  fetchGeminiSummary as fetchGeminiSummaryApi,
} from "~/utils/gemini-api";

export const useGeminiApi = () => {
  const geminiResponse = ref<GeminiResponse | null>(null);
  const geminiSummaryResponse = ref<GeminiSummaryResponse | null>(null);
  const error = ref<string | null>(null);
  const isLoading = ref(false);

  const fetchGeminiRetrospective = async (prompt: string): Promise<void> => {
    if (!prompt.trim()) return;

    isLoading.value = true;
    error.value = null;
    geminiResponse.value = null;

    try {
      const response = await fetchGeminiSuggestion(prompt);
      geminiResponse.value = response;
    } catch (err: any) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      console.error("Error calling Gemini API:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchGeminiSummary = async (retrospectiveData: any): Promise<void> => {
    if (!retrospectiveData) return;

    isLoading.value = true;
    error.value = null;
    geminiSummaryResponse.value = null;

    try {
      const response = await fetchGeminiSummaryApi(retrospectiveData);
      geminiSummaryResponse.value = response;
    } catch (err: any) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      console.error("Error calling Gemini Summary API:", err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    geminiResponse: readonly(geminiResponse),
    geminiSummaryResponse: readonly(geminiSummaryResponse),
    error: readonly(error),
    isLoading: readonly(isLoading),
    fetchGeminiRetrospective,
    fetchGeminiSummary,
  };
};
