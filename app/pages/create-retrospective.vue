<template>
  <div class="retrospective-container">
    <div class="retrospective-card">
      <h2 class="subtitle">Retrospective wisdom</h2>
      <p class="description">
        Hello <strong>{{ userName }}</strong
        >, share information about your team and sprint. This will be used to
        suggest the best retrospective dynamic tailored to your context.
      </p>

      <form @submit.prevent="handleSubmit" class="retrospective-form">
        <div class="input-group">
          <label for="team-description" class="label">
            Describe your team and sprint
          </label>
          <textarea
            id="team-description"
            v-model="retrospectiveDescription"
            placeholder="E.g., We are a team of 5 developers working on a fintech product. Our last sprint was 2 weeks long. We successfully delivered the payment integration feature, but struggled with some technical debt that slowed us down..."
            required
            autofocus
            class="textarea-field"
            rows="5"
          />
          <div class="example-section">
            <p class="example-hint">
              <strong>Tip:</strong> Include team size, sprint duration,
              achievements, and challenges
            </p>
          </div>
        </div>

        <button
          type="submit"
          class="submit-button"
          :disabled="isLoading || !retrospectiveDescription.trim()"
        >
          {{ isLoading ? "Loading..." : "Create retrospective" }}
        </button>
      </form>

      <div v-if="error" class="error-message">
        <strong>Error:</strong> {{ error }}
      </div>

      <div v-if="geminiResponse" class="response-container">
        <h4 class="response-title">Retrospective Suggestion:</h4>
        <div v-if="geminiResponse.data" class="structured-response">
          <div class="response-field">
            <strong>Retro Type:</strong>
            <span class="retro-type-badge">{{
              geminiResponse.data.retroType
            }}</span>
          </div>
          <div class="response-field">
            <strong>Instructions:</strong>
            <p>{{ geminiResponse.data.instructions }}</p>
          </div>
          <div class="response-field">
            <strong>Suggestions:</strong>
            <p>{{ geminiResponse.data.suggestions }}</p>
          </div>
          <div class="response-field">
            <strong>Columns:</strong>
            <div class="columns-list">
              <div
                v-for="column in geminiResponse.data.columns"
                :key="column.id"
                class="column-item"
                :style="{ borderLeftColor: column.color }"
              >
                <div class="column-header">
                  <div
                    class="column-color-indicator"
                    :style="{ backgroundColor: column.color }"
                  ></div>
                  <div>
                    <strong>{{ column.label }}</strong> ({{ column.id }})
                    <span
                      class="column-color-badge"
                      :style="{ color: column.color }"
                    >
                      {{ column.color }}
                    </span>
                  </div>
                </div>
                <p class="column-description">{{ column.description }}</p>
              </div>
            </div>
          </div>
          <div class="response-field">
            <strong>Metadata:</strong>
            <ul>
              <li>Layout: {{ geminiResponse.data.metadata.layout }}</li>
              <li>
                Color Scheme:
                {{ geminiResponse.data.metadata.color_scheme }}
              </li>
            </ul>
          </div>
        </div>
        <pre v-else class="response-content">{{
          JSON.stringify(geminiResponse, null, 2)
        }}</pre>
        <div class="response-actions">
          <button
            type="button"
            @click="handleRegenerate"
            class="action-button regenerate-button"
            :disabled="isLoading || !retrospectiveDescription.trim()"
          >
            {{ isLoading ? "Loading..." : "Regenerate" }}
          </button>
          <button
            type="button"
            @click="handleAccept"
            class="action-button accept-button"
            :disabled="isLoading"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGeminiApi } from "~/composables/useGeminiApi";
import { useMongodbApi } from "~/composables/useMongodbApi";
import { RETRO_TYPES } from "~/models/retrospective";

const route = useRoute();
const userName = ref((route.query.name as string) || "Usuario");
const userEmail = ref((route.query.email as string) || "Email");

const retrospectiveDescription = ref("");

const { geminiResponse, error, isLoading, fetchGeminiRetrospective } =
  useGeminiApi();

const { createBoard } = useMongodbApi();

const handleSubmit = async () => {
  if (retrospectiveDescription.value.trim()) {
    await fetchGeminiRetrospective(retrospectiveDescription.value);
  }
};

const handleRegenerate = async () => {
  if (retrospectiveDescription.value.trim()) {
    await fetchGeminiRetrospective(retrospectiveDescription.value);
  }
};

const handleAccept = async () => {
  console.log(geminiResponse.value!.data);
  try {
    const res = await createBoard({
      name: "dummy",
      ...geminiResponse.value!.data,
      user: {
        name: userName.value,
        email: userEmail.value,
      },
    });

    const type = geminiResponse.value?.data?.retoType || RETRO_TYPES.COLUMNS;
    console.log(res);

    if (res.success) {
      // TODO: Change to the actual board ID
      navigateTo(`/retrospective-types/${type}?id=${(res.board as any)._id}`);
      return;
    }

    console.warn("Error creating board:", res.message);
  } catch (err: any) {
    console.error("[handleSubmit]", err);
    alert("Error creating board. Please try again later.");
  }
};
</script>

<style scoped>
.retrospective-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #9aaae5 0%, #b390d9 100%);
  padding: 2rem 1rem;
}

.retrospective-card {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
}

.description {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.95rem;
  line-height: 1.5;
  padding: 0 1rem;
}

.description strong {
  color: #667eea;
  font-weight: 600;
}

.retrospective-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  width: 100%;
}

.label {
  display: block;
  color: #333;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.textarea-field {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  box-sizing: border-box;
  resize: vertical;
}

.textarea-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.textarea-field::placeholder {
  color: #999;
}

.example-section {
  margin-top: 0.75rem;
}

.example-hint {
  margin: 0;
  color: #666;
  font-size: 0.8rem;
  line-height: 1.4;
}

.example-hint strong {
  color: #667eea;
  font-weight: 600;
}

.submit-button {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  margin-top: 1.5rem;
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

.retro-type-badge {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-left: 0.5rem;
}

.columns-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
}

.column-item {
  background: #f8f9fa;
  border-left: 3px solid #667eea;
  padding: 0.75rem;
  border-radius: 4px;
}

.column-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.column-color-indicator {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.column-item strong {
  color: #333;
  font-size: 0.95rem;
}

.column-color-badge {
  margin-left: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  font-family: monospace;
}

.column-description {
  margin: 0.25rem 0 0 0;
  color: #666;
  font-size: 0.85rem;
}

.response-field ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1.5rem;
  color: #555;
}

.response-field li {
  margin-bottom: 0.25rem;
}

.response-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.action-button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.regenerate-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.regenerate-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.regenerate-button:active:not(:disabled) {
  transform: translateY(0);
}

.accept-button {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
}

.accept-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(72, 187, 120, 0.3);
}

.accept-button:active:not(:disabled) {
  transform: translateY(0);
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
