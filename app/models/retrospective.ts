export const RETRO_TYPES = {
  COLUMNS: "columns",
  QUADRANT: "quadrant",
  FREE: "free",
} as const;

export type RetroType = (typeof RETRO_TYPES)[keyof typeof RETRO_TYPES];

export type RetroColumn = {
  id: string;
  label: string;
  description: string;
  color: string;
};

export type RetroMetadata = {
  layout: "horizontal" | "vertical";
  color_scheme: string;
};

export type RetrospectiveResponse = {
  retoType: RetroType;
  columns: RetroColumn[];
  instructions: string;
  suggestions: string;
  metadata: RetroMetadata;
};

export type RetroNote = {
  id: string;
  columnId: string;
  userId: string;
  content: string;
  createdAt: string;
};

export type RetrospectiveData = {
  id: string;
  template: string;
  columns: Array<{ id: string; label: string }>;
  notes: RetroNote[];
};

export type ActionPoint = {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  assignedTo?: string;
  dueDate?: string;
};

export type RetrospectiveSummary = {
  summary: string;
  keyInsights: string[];
  actionPoints: ActionPoint[];
  recommendations: string[];
};

