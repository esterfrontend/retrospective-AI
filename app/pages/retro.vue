<script setup lang="ts">
import { RETRO_TYPES, type RetroNote } from "~/models/retrospective";

const route = useRoute();
const router = useRouter();

const retrospectiveStore = useRetrospectiveStore();

const noteList = ref<RetroNote[]>([]);

const currentBoard = computed(() => retrospectiveStore.current);

const RetroFree = resolveComponent("retro-free");
const RetroColumns = resolveComponent("retro-column-space");
const RetroQuadrant = resolveComponent("retro-quadrant-space");

const COMPONENTS = {
  [RETRO_TYPES.FREE]: RetroFree,
  [RETRO_TYPES.COLUMNS]: RetroColumns,
  [RETRO_TYPES.QUADRANT]: RetroQuadrant,
};

console.log("currentBoard", currentBoard.value);

const component = computed(
  () => COMPONENTS[currentBoard.value?.retroType as keyof typeof COMPONENTS]
);

const notes = computed(() => retrospectiveStore.notes);

const setIntervalRefreshBoard = () => {
  setInterval(() => {
    retrospectiveStore.refreshBoard();
  }, 8000);
};

const handleLogNotes = (): void => {
  router.push("/summary");
};

onMounted(async () => {
  if (!retrospectiveStore.hasCurrent) {
    await retrospectiveStore.fetchBoard(route.query.id as string);
  }
  if (retrospectiveStore.notes.length > 0) {
    noteList.value = [...retrospectiveStore.notes];
  }
  setIntervalRefreshBoard();
});

watch(
  () => retrospectiveStore.notes.length,
  () => {
    noteList.value = retrospectiveStore.notes;
  },
  { deep: true }
);
</script>

<template>
  <div class="retrospective-container">
    <div class="retrospective-board" v-if="currentBoard">
      <component :is="component" :board="currentBoard" :notes="notes" />
      <div class="actions-footer">
      <button class="log-notes-button" @click="handleLogNotes">
        Finish retrospective
      </button>
    </div>
    </div>
  </div>
</template>

<style scoped>
.retrospective-container {
  height: 100vh;
  background: linear-gradient(135deg, #9aaae5 0%, #b390d9 100%);
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
}

.retrospective-board {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.actions-footer {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  padding-top: 1.5rem;
  border-top: 2px solid #e0e0e0;
}

.log-notes-button {
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.log-notes-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.log-notes-button:active {
  transform: translateY(0);
}
</style>
