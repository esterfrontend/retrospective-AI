<template>
  <div class="card">
    <h2 class="subtitle">AI-Powered Summary</h2>
    <div class="form">
      <div class="test-section">
        <p class="test-description"></p>
        <button
          type="button"
          @click="handleTestGeminiSummary"
          class="test-button"
          :disabled="isLoading"
        >
          {{ isLoading ? "Loading..." : "Generate Summary" }}
        </button>
      </div>

      <div v-if="error" class="error-message">
        <strong>Error:</strong> {{ error }}
      </div>

      <div v-if="geminiSummaryResponse" class="response-container">
        <h4 class="response-title">Summary Response:</h4>
        <div v-if="geminiSummaryResponse.data" class="structured-response">
          <div class="response-field">
            <strong>Summary:</strong>
            <p>{{ geminiSummaryResponse.data.summary }}</p>
          </div>
          <div class="response-field">
            <strong>Key Insights:</strong>
            <ul class="insights-list">
              <li
                v-for="(insight, index) in geminiSummaryResponse.data
                  .keyInsights"
                :key="index"
              >
                {{ insight }}
              </li>
            </ul>
          </div>
          <div class="response-field">
            <strong>Action Points:</strong>
            <div class="action-points-list">
              <div
                v-for="ap in geminiSummaryResponse.data.actionPoints"
                :key="ap.id"
                class="action-point-item"
              >
                <div class="action-point-header">
                  <strong>{{ ap.title }}</strong>
                  <span :class="`priority-badge priority-${ap.priority}`">
                    {{ ap.priority }}
                  </span>
                </div>
                <p class="action-point-description">{{ ap.description }}</p>
                <div
                  v-if="ap.assignedTo || ap.dueDate"
                  class="action-point-meta"
                >
                  <span v-if="ap.assignedTo"
                    >Assigned to: {{ ap.assignedTo }}</span
                  >
                  <span v-if="ap.dueDate"
                    >Due: {{ new Date(ap.dueDate).toLocaleDateString() }}</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="response-field">
            <strong>Recommendations:</strong>
            <ul class="recommendations-list">
              <li
                v-for="(rec, index) in geminiSummaryResponse.data
                  .recommendations"
                :key="index"
              >
                {{ rec }}
              </li>
            </ul>
          </div>
        </div>
        <pre v-else class="response-content">{{
          JSON.stringify(geminiSummaryResponse, null, 2)
        }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RetrospectiveData } from "~/models/retrospective";
import type { IBoard } from "~/models/Board";

type Props = {
  retrospectiveData?: RetrospectiveData | null;
  board?: IBoard | null | any;
  notes?: Array<{
    id: string;
    columnId: string;
    userId: string;
    content: string;
    createdAt: string;
  }> | null;
};

const props = withDefaults(defineProps<Props>(), {
  retrospectiveData: null,
  board: null,
  notes: null,
});

const { geminiSummaryResponse, error, isLoading, fetchGeminiSummary } =
  useGeminiApi();

const dummyRetrospectiveData = {
  id: "retro_123",
  template: "start_stop_continue",
  columns: [
    { id: "start", label: "Start" },
    { id: "stop", label: "Stop" },
    { id: "continue", label: "Continue" },
  ],
  notes: [
    {
      id: "note1",
      columnId: "start",
      userId: "u1",
      content: "Start doing shorter refinements",
      createdAt: "2025-01-19T10:00:00Z",
    },
    {
      id: "note2",
      columnId: "stop",
      userId: "u2",
      content: "Stop interrupting each other",
      createdAt: "2025-01-19T10:02:00Z",
    },
    {
      id: "note3",
      columnId: "continue",
      userId: "u1",
      content: "Continue with daily standups",
      createdAt: "2025-01-19T10:05:00Z",
    },
  ],
};

const retrospectiveDataToUse = computed(() => {
  if (props.retrospectiveData) {
    return props.retrospectiveData;
  }

  // If board and notes are provided, transform them
  if (props.board && props.notes) {
    const board = props.board as IBoard;
    // Handle mongoose _id or regular id
    const boardAny = board as any;
    const boardId = boardAny._id
      ? String(boardAny._id)
      : boardAny.id || `board-${Date.now()}`;

    return {
      id: boardId,
      template: board.retroType,
      columns: board.columns.map((col) => ({
        id: col.id,
        label: col.label,
      })),
      notes: props.notes.map((note) => ({
        id: note.id,
        columnId: note.columnId,
        userId: note.userId,
        content: note.content,
        createdAt:
          typeof note.createdAt === "string"
            ? note.createdAt
            : new Date(note.createdAt).toISOString(),
      })),
    };
  }

  // Fallback to dummy data
  return dummyRetrospectiveData;
});

const handleTestGeminiSummary = async () => {
  await fetchGeminiSummary(retrospectiveDataToUse.value);
};
</script>

<style scoped>
.card {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.2rem;
  font-weight: bold;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.test-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.test-section:last-of-type {
  border-bottom: none;
}

.test-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.test-button {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.test-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(72, 187, 120, 0.3);
}

.test-button:active:not(:disabled) {
  transform: translateY(0);
}

.test-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  color: #c33;
  font-size: 0.9rem;
}

.response-container {
  margin-top: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
}

.response-title {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.response-content {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0.75rem;
  font-size: 0.85rem;
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
  color: #333;
  font-family: "Courier New", monospace;
}

.structured-response {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 1rem;
}

.response-field {
  margin-bottom: 1.5rem;
}

.response-field:last-child {
  margin-bottom: 0;
}

.response-field strong {
  color: #667eea;
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.response-field p {
  margin: 0.5rem 0 0 0;
  color: #555;
  line-height: 1.5;
}

.insights-list,
.recommendations-list {
  margin: 0.5rem 0 0 0;
  padding-left: 1.5rem;
  color: #555;
}

.insights-list li,
.recommendations-list li {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.action-points-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
}

.action-point-item {
  background: #f8f9fa;
  border-left: 3px solid #667eea;
  padding: 1rem;
  border-radius: 4px;
}

.action-point-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.action-point-header strong {
  color: #333;
  font-size: 1rem;
}

.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.priority-high {
  background: #fee;
  color: #c33;
}

.priority-medium {
  background: #ffeaa7;
  color: #d63031;
}

.priority-low {
  background: #d5f4e6;
  color: #00b894;
}

.action-point-description {
  margin: 0.5rem 0;
  color: #555;
  line-height: 1.5;
}

.action-point-meta {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #888;
  display: flex;
  gap: 1rem;
}
</style>
