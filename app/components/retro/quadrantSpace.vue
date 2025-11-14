<template>
  <div class="quadrant-space">
    <div class="quadrant-grid">
      <div
        v-for="(quadrant, index) in quadrants"
        :key="quadrant.id"
        class="quadrant"
        :class="`quadrant-${index + 1}`"
      >
        <div class="quadrant-header">
          <h3 class="quadrant-title">{{ quadrant.label }}</h3>
          <p class="quadrant-description">{{ quadrant.description }}</p>
        </div>
        <div class="quadrant-content" :key="refreshForces">
          <div
            v-for="note in getNotesForQuadrant(quadrant.id)"
            :key="note.id"
            :ref="(el) => setNoteRef(el as HTMLElement | null, note.id)"
            class="note"
            :data-note-id="note.id"
            :style="{
              backgroundColor: quadrant.color + '20',
              borderColor: quadrant.color,
            }"
          >
            <textarea
              v-model="note.content"
              class="note-content"
              placeholder="New note..."
              rows="3"
              @blur="handleNoteBlur(note.id)"
            />
            <p class="note-user">{{ note.userId }}</p>
          </div>
        </div>
        <button
          class="add-note-button"
          @click="addNote(quadrant.id)"
          :style="{ borderColor: quadrant.color, color: quadrant.color }"
        >
          + Add Note
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IBoard } from "~/models/Board";
import type { RetroColumn, RetroNote } from "~/models/retrospective";
import { getMockGeminiResponse } from "~/utils/mocks";

const userStore = useUserStore();
const retrospectiveStore = useRetrospectiveStore();

type Note = {
  id: string;
  columnId: string;
  content: string;
  user: string;
};

const { board, notes } = defineProps<{
  board: IBoard;
  notes: RetroNote[];
}>();

const localNotes = ref<RetroNote[]>([] as RetroNote[]);
const refreshForces = ref<number>(0);

const quadrants = computed(() => {
  const columns = board.columns;
  if (columns?.length >= 4) {
    return columns.slice(0, 4);
  }
  const mockResponse = getMockGeminiResponse();
  const mockColumns = mockResponse.data?.columns || [];

  const defaultQuadrants: RetroColumn[] = [
    ...mockColumns,
    ...(mockColumns?.length < 4
      ? [
          {
            id: "action-items",
            label: "Action Items",
            description: "Next steps and improvements",
            color: "#F59E0B",
          },
        ]
      : []),
  ];

  return defaultQuadrants.slice(0, 4);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const noteRefs = ref<Map<string, any>>(new Map());

const setNoteRef = (el: HTMLElement | null, noteId: string) => {
  if (el) {
    noteRefs.value.set(noteId, el);
  }
};

const getNotesForQuadrant = (columnId: string): RetroNote[] => {
  return localNotes.value.filter((note) => note.columnId === columnId);
};

const addNote = async (columnId: string): Promise<void> => {
  const newNote: Note = {
    id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    columnId,
    content: "",
    user: userStore.getName,
  };

  nextTick(() => {
    const noteElement = noteRefs.value.get(newNote.id);
    if (noteElement) {
      const contentElement = noteElement.querySelector(
        ".note-content"
      ) as HTMLTextAreaElement;
      if (contentElement) {
        contentElement.focus();
      }
    }
  });
};

const route = useRoute();

// Debounce mechanism to prevent duplicate calls
const blurTimeouts = ref<Map<string, NodeJS.Timeout>>(new Map());
const isProcessingBlur = ref<Set<string>>(new Set());

const handleNoteBlur = async (noteId: string): Promise<void> => {
  // Clear any existing timeout for this note
  const existingTimeout = blurTimeouts.value.get(noteId);
  if (existingTimeout) {
    clearTimeout(existingTimeout);
  }

  // If already processing, skip
  if (isProcessingBlur.value.has(noteId)) {
    return;
  }

  // Set a debounce timeout
  const timeout = setTimeout(async () => {
    isProcessingBlur.value.add(noteId);

    const note = notes.find((note: RetroNote) => note.id === noteId);
    if (!note) {
      isProcessingBlur.value.delete(noteId);
      blurTimeouts.value.delete(noteId);
      return;
    }

    const boardId = (route.query.id as string) || "";
    if (!boardId) {
      console.error("[handleNoteBlur] No board ID found in route");
      isProcessingBlur.value.delete(noteId);
      blurTimeouts.value.delete(noteId);
      return;
    }

    try {
      await retrospectiveStore.addNote({
        id: note.id,
        columnId: note.columnId,
        content: note.content?.trim() || "",
        userId: note.userId || "",
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[addNote]", error);
    } finally {
      isProcessingBlur.value.delete(noteId);
      blurTimeouts.value.delete(noteId);
    }
  }, 300); // 300ms debounce delay

  blurTimeouts.value.set(noteId, timeout);
};

onMounted(() => {
  localNotes.value = notes;
});

watch(
  () => notes.length,
  () => {
    const newNotes = filterNewNotes(notes, localNotes.value);
    if (newNotes.length > 0) {
      localNotes.value.push(...newNotes);
    }
    refreshForces.value++;
  }
);
</script>

<style scoped>
.quadrant-space {
  width: 100%;
  height: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.quadrant-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1rem;
  flex: 1;
  min-height: 0;
}

.quadrant {
  position: relative;
  display: flex;
  flex-direction: column;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  background: #fafafa;
  overflow: hidden;
  min-height: 0;
  height: 100%;
  max-height: 100%;
}

.quadrant-header {
  flex-shrink: 0;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e0e0e0;
}

.quadrant-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.25rem 0;
}

.quadrant-description {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}

.quadrant-content {
  position: relative;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  padding-bottom: 0.5rem;
}

.note {
  position: relative;
  min-height: 80px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  border-radius: 8px;
  border: 2px solid;
  transition: box-shadow 0.2s ease;
  background: white;
}

.note:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.note-content {
  width: 100%;
  min-height: 60px;
  padding: 0.5rem;
  border: none;
  background: transparent;
  resize: none;
  outline: none;
  font-family: inherit;
  font-size: inherit;
  line-height: 1.5;
  color: inherit;
  direction: ltr;
  text-align: left;
}

.note-content:focus {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  outline: 2px solid rgba(102, 126, 234, 0.3);
  outline-offset: -2px;
}

.note-content::placeholder {
  color: #999;
  opacity: 1;
}

.note-delete {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s ease;
}

.note-user {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
  text-align: right;
}

.note-delete:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.add-note-button {
  position: sticky;
  bottom: 0;
  flex-shrink: 0;
  width: 100%;
  padding: 0.75rem;
  border: 2px dashed;
  border-radius: 8px;
  background: #fafafa;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
  z-index: 10;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.add-note-button:hover {
  background: rgba(0, 0, 0, 0.02);
  border-style: solid;
}

/* Scrollbar styling */
.quadrant-content::-webkit-scrollbar {
  width: 8px;
}

.quadrant-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.quadrant-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.quadrant-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
