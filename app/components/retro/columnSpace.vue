<template>
  <div class="retrospective-container">
    <div
      v-for="column in boardColumns"
      :key="column.id"
      :class="['retrospective-column', `column-${column.id}`]"
    >
      <h2 class="column-title" :style="{ color: column.color }">
        {{ column.label }}
      </h2>
      <p class="column-description">{{ column.description }}</p>
      <form
        @submit.prevent="handleCreatePost(column.id)"
        class="retrospective-form"
      >
        <textarea
          v-model="inputTexts[column.id]"
          type="text"
          placeholder="Escribe tus opiniones..."
          required
          autofocus
          class="textarea-field"
        />
        <button
          type="submit"
          class="submit-button"
          :disabled="!inputTexts[column.id]?.trim()"
          :style="{ 'background-color': column.color }"
        >
          Add
        </button>
      </form>

      <div class="retrospective-cards">
        <div
          v-for="post in getPostsByColumnId(column.id)"
          :key="post.id"
          class="card-wrapper"
        >
          <div
            :ref="(el) => setCardRef(el, column.id, 0)"
            class="card"
            :style="{
              'background-color': column.color,
              'min-height': cardHeights[`${column.id}-0`]
                ? `${cardHeights[`${column.id}-0`]}px`
                : 'auto',
            }"
          >
            <p class="card-text">{{ post.content }}</p>
            <p class="card-author">{{ userName }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, nextTick, ref, computed, watch } from "vue";
import type { IBoard } from "~/models/Board";
import type { RetroNote } from "~/models/retrospective";

const retrospectiveStore = useRetrospectiveStore();
const userStore = useUserStore();
const route = useRoute();

const { board, notes } = defineProps<{
  board: IBoard;
  notes: RetroNote[];
}>();

const userName = computed(() => userStore.getName);

const inputTexts = ref<Record<string, string>>({});
const cardRefs = ref<Record<string, HTMLElement>>({});
const cardHeights = ref<Record<string, number>>({});

watch(
  () => board,
  (newBoard) => nextTick(() => setCardMinHeight()),
  { immediate: true }
);

const boardColumns = computed(() => {
  if (!board?.columns) return [];
  return board.columns.map((col: any) => ({
    id: col.id,
    label: col.label,
    description: col.description || "",
    color: col.color || "#90c1ff",
  }));
});

const posts = computed(() => {
  if (!notes) return [];
  return notes.map((note: any) => ({
    id: note.id,
    content: note.content,
    userId: note.userId,
    columnId: note.columnId,
  }));
});

const postsByColumnId = computed(() => {
  const grouped: Record<string, typeof posts.value> = {};
  posts.value.forEach((post) => {
    if (!grouped[post.columnId]) {
      grouped[post.columnId] = [];
    }
    grouped[post.columnId]!.push(post);
  });
  return grouped;
});

const getPostsByColumnId = (columnId: string) => {
  return postsByColumnId.value[columnId] || [];
};

const handleCreatePost = async (columnId: string) => {
  const text = inputTexts.value[columnId];
  if (!text?.trim()) return;

  await retrospectiveStore.addNote({
    id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    columnId,
    content: text?.trim() || "",
    userId: userName.value || "",
    createdAt: new Date().toISOString(),
  });

  inputTexts.value[columnId] = "";
};

const setCardRef = (
  el: Element | ComponentPublicInstance | null,
  columnId: string,
  cardIndex: number
) => {
  if (el && el instanceof HTMLElement) {
    const key = `${columnId}-${cardIndex}`;
    cardRefs.value[key] = el;
    updateCardHeight(el, columnId, cardIndex);
  }
};

const updateCardHeight = (
  card: HTMLElement,
  columnId: string,
  cardIndex: number
) => {
  const width = card.offsetWidth;
  const key = `${columnId}-${cardIndex}`;
  cardHeights.value[key] = width;
};

const setCardMinHeight = () => {
  nextTick(() => {
    Object.keys(cardRefs.value).forEach((key) => {
      const card = cardRefs.value[key];
      if (card) {
        const parts = key.split("-");
        const columnId = parts[0];
        const cardIndex = parts[1];
        if (columnId && cardIndex) {
          updateCardHeight(card, columnId, parseInt(cardIndex));
        }
      }
    });
  });
};

onMounted(() => {
  setCardMinHeight();
  window.addEventListener("resize", setCardMinHeight);
});

onUnmounted(() => {
  window.removeEventListener("resize", setCardMinHeight);
});
</script>

<style scoped>
.retrospective-container {
  display: flex;
  background: white !important;
  justify-content: center;
  flex-direction: row !important;
  gap: 2%;
  padding: 2rem 1rem;
}

.retrospective-column {
  min-width: 300px;
  max-width: 450px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.retrospective-form {
  border-bottom: 1px solid #e0e0e0;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.column-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  filter: brightness(0.9) saturate(1.4);
}

.column-description {
  text-align: center;
  color: #333;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 400;
}

.textarea-field {
  width: 100%;
  padding: 0.7rem;
  border: 2px solid #e0e0e0;
  height: 60px;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.textarea-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.textarea-field::placeholder {
  color: #999;
}

.submit-button {
  width: 100%;
  padding: 0.875rem;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.retrospective-cards {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: 10px;
  column-gap: 16px;
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.card-wrapper {
  width: calc(50% - 8px);
}

.card {
  box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.1);
  font-family: var(--font-secondary);
  border-radius: 0.2rem;
  padding: 0.7rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-text {
  font-size: 1.4rem;
}

.card-author {
  text-align: right;
  font-size: 1rem;
  font-weight: 600;
  margin: 0.5rem 0;
}
</style>
