<template>
  <div class="retrospective-container">
    <div class="retrospective-card">
      <p class="welcome-message">Hola <strong>{{ userName }}</strong>, cuéntame cómo te gustaría que creara la retrospectiva.</p>
      
      <form @submit.prevent="handleSubmit" class="retrospective-form">
        <div class="input-group">
          <textarea
            v-model="retrospectiveDescription"
            type="text"
            placeholder="Escribe tu idea..."
            required
            autofocus
            class="textarea-field"
          />
        </div>
        
        <button type="submit" class="submit-button" :disabled="!retrospectiveDescription.trim()">
          Crear
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const userName = ref(route.query.name as string || 'Usuario')
const retrospectiveDescription = ref('')

const handleSubmit = () => {
  if (retrospectiveDescription.value.trim()) {
    // Aquí puedes procesar el texto ingresado
    console.log('Texto ingresado:', retrospectiveDescription.value.trim())
  }
}
</script>

<style scoped>
.retrospective-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #9aaae5 0%, #b390d9 100%);
  padding: 1rem;
}

.retrospective-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: 75%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

h1 {
  text-align: center;
  color: #333;
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.welcome-message {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.welcome-message strong {
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

.textarea-field {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e0e0e0;
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
</style>

