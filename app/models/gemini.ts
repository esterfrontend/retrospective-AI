import type { RetroColumn, RetroMetadata, ActionPoint } from "./retrospective";

export type RetrospectiveSuggestionData = {
  retoType: string;
  columns: RetroColumn[];
  instructions: string;
  suggestions: string;
  metadata: RetroMetadata;
};

export type GeminiResponse = {
  success: boolean;
  data?: RetrospectiveSuggestionData;
  text?: string; // Keep for backward compatibility
  timestamp: string;
};

export type RetrospectiveSummaryData = {
  summary: string;
  keyInsights: string[];
  actionPoints: ActionPoint[];
  recommendations: string[];
};

export type GeminiSummaryResponse = {
  success: boolean;
  data?: RetrospectiveSummaryData;
  timestamp: string;
};

