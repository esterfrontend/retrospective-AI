<template>
  <div class="retrospective-container">
    <div class="retrospective-board" v-if="currentRetrospective && columns">
      <retro-quadrant-space :columns="columns" />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { fetchBoard } = useRetrospective(route.query.id as string);
const retrospectiveStore = useRetrospectiveStore();

const currentRetrospective = computed(() => retrospectiveStore.current);

const columns = computed(() => {
  return currentRetrospective.value?.columns.map((column) => ({
    id: column.id,
    label: column.label,
    description: "",
    color: "#000000",
  }));
});

onMounted(async () => {
  if (!retrospectiveStore.hasCurrent) {
    await fetchBoard();
  }
});
</script>

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
