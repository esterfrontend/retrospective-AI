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
</style>
