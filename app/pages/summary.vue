<template>
  <div class="summary-container">
    <div class="summary-content">
      <h1 class="summary-title">Retrospective Summary</h1>
      <p class="summary-subtitle">Your retrospective notes have been saved</p>

      <div v-if="!hasData" class="no-data-message">
        <p>
          No retrospective data available. Please complete a retrospective
          first.
        </p>
      </div>

      <TestGeminiSummary v-else :board="currentBoard" :notes="notes" />
    </div>
  </div>
</template>

<script setup lang="ts">
const retrospectiveStore = useRetrospectiveStore();

// Access saved notes from store
const notes = computed(() => retrospectiveStore.notes);
const currentBoard = computed(() => retrospectiveStore.current);

// Check if we have the required data
const hasData = computed(() => {
  return currentBoard.value !== null && notes.value.length > 0;
});

onMounted(() => {
  // Log for debugging
  console.log("Summary page - Notes:", notes.value);
  console.log("Summary page - Current board:", currentBoard.value);
});
</script>

<style scoped>
.summary-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #9aaae5 0%, #b390d9 100%);
  padding: 2rem 1rem;
}

.summary-content {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  width: 100%;
  max-width: 1200px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.summary-content > h1,
.summary-content > p {
  text-align: center;
}

.summary-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 1rem 0;
}

.summary-subtitle {
  font-size: 1.25rem;
  color: #666;
  margin: 0 0 2rem 0;
}

.no-data-message {
  text-align: center;
  padding: 2rem;
  color: #666;
  background: #f5f5f5;
  border-radius: 8px;
  margin-top: 2rem;
}

.no-data-message p {
  margin: 0;
}
</style>
