<template>
  <div class="card">
    <h2 class="subtitle">Retrospective wisdom</h2>
    <p class="description">
      Share information about your team and sprint. This will be used to suggest
      the best retrospective dynamic tailored to your context.
    </p>
    <div class="form">
      <div class="test-section">
        <label for="team-description" class="label">
          Describe your team and sprint
        </label>
        <textarea
          id="team-description"
          v-model="geminiPrompt"
          placeholder="E.g., We are a team of 5 developers working on a fintech product. Our last sprint was 2 weeks long. We successfully delivered the payment integration feature, but struggled with some technical debt that slowed us down..."
          class="textarea-field"
          rows="5"
        />
        <div class="example-section">
          <p class="example-hint">
            <strong>Tip:</strong> Include team size, sprint duration,
            achievements, and challenges
          </p>
        </div>
        <button
          type="button"
          @click="handleTestGemini"
          class="test-button"
          :disabled="isLoading || !geminiPrompt.trim()"
        >
          {{ isLoading ? "Loading..." : "Test Gemini API" }}
        </button>
      </div>

      <div v-if="error" class="error-message">
        <strong>Error:</strong> {{ error }}
      </div>

      <div v-if="geminiResponse" class="response-container">
        <h4 class="response-title">Gemini Response:</h4>
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
            :disabled="isLoading || !geminiPrompt.trim()"
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
const geminiPrompt = ref("");

const { geminiResponse, error, isLoading, fetchGeminiRetrospective } =
  useGeminiApi();

const exampleText =
  "We are a team of 5 developers working on a fintech product. Our last sprint was 2 weeks long. We successfully delivered the payment integration feature and improved our CI/CD pipeline. However, we struggled with some technical debt that slowed us down, and we had some communication issues between frontend and backend teams.";

const handleTestGemini = async () => {
  if (geminiPrompt.value.trim()) {
    await fetchGeminiRetrospective(geminiPrompt.value);
  }
};

const handleRegenerate = async () => {
  if (geminiPrompt.value.trim()) {
    await fetchGeminiRetrospective(geminiPrompt.value);
  }
};

const router = useRouter();
const retrospectiveStore = useRetrospectiveStore();

const handleAccept = () => {};
</script>

<style scoped>
.card {
  margin: 0 auto;
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

.test-button {
  width: auto;
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

.label {
  display: block;
  color: #333;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.example-section {
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.example-button {
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  color: #667eea;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.example-button:hover:not(:disabled) {
  background: #e8e8e8;
  border-color: #667eea;
}

.example-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
