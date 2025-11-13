<script setup lang="ts">
import { RETRO_TYPES } from "~/models/retrospective";

const route = useRoute();
const retrospectiveStore = useRetrospectiveStore();

const currentBoard = computed(() => retrospectiveStore.current);

const RetroFree = resolveComponent("retro-free");
const RetroColumns = resolveComponent("retro-column-space");
const RetroQuadrant = resolveComponent("retro-quadrant-space");

const COMPONENTS = {
  [RETRO_TYPES.FREE]: RetroFree,
  [RETRO_TYPES.COLUMNS]: RetroColumns,
  [RETRO_TYPES.QUADRANT]: RetroQuadrant,
};

const boardType = computed(() => RETRO_TYPES.COLUMNS);

const component = computed(
  () => COMPONENTS[boardType.value as keyof typeof COMPONENTS]
);

onMounted(async () => {
  if (!retrospectiveStore.hasCurrent) {
    await retrospectiveStore.fetchBoard(route.query.id as string);
  }
});
</script>

<template>
  <div class="retrospective-container">
    <div class="retrospective-board" v-if="currentBoard">
      <component :is="component" :board="currentBoard" />
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
