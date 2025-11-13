<template>
  <div class="container">
    <h1>Retrospective AI</h1>
    <div class="cards-container">
      <div class="card">
        <h2 class="subtitle">Accede a una retrospectiva</h2>

        <form @submit.prevent="handleSubmit" class="form">
          <input
            v-model="userName"
            type="text"
            placeholder="Tu nombre"
            required
            autofocus
            class="input-field"
          />
          <input
            v-model="userEmail"
            type="text"
            placeholder="Tu email"
            required
            autofocus
            class="input-field"
          />
          <input
            v-model="retrospectiveID"
            type="text"
            placeholder="Id de la retrospectiva"
            required
            class="input-field"
          />

          <button
            type="submit"
            class="submit-button"
            :disabled="buttonDisabled"
          >
            Entrar
          </button>
        </form>
      </div>
      <div class="card">
        <h2 class="subtitle">Crea una nueva retrospectiva</h2>
        <form @submit.prevent="handleCreateRetrospective" class="form">
          <input
            v-model="creatorName"
            type="text"
            placeholder="Tu nombre"
            required
            autofocus
            class="input-field"
          />
          <input
            v-model="creatorEmail"
            type="text"
            placeholder="Tu email"
            required
            autofocus
            class="input-field"
          />
          <button type="submit" class="submit-button">Crear</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const userName = ref("");
const userEmail = ref("");
const retrospectiveID = ref("");

const creatorName = ref("");
const creatorEmail = ref("");

const buttonDisabled = computed(() => {
  return (
    !userName.value.trim() ||
    !userEmail.value.trim() ||
    !retrospectiveID.value.trim()
  );
});

const handleSubmit = () => {
  if (
    userName.value.trim() &&
    userEmail.value.trim() &&
    retrospectiveID.value.trim()
  ) {
    navigateTo(
      `/retrospective?name=${userName.value.trim()}&email=${userEmail.value.trim()}&id=${retrospectiveID.value.trim()}`
    );
  }
};

const handleCreateRetrospective = () => {
  if (creatorName.value.trim() && creatorEmail.value.trim()) {
    navigateTo(
      `/create-retrospective?name=${creatorName.value.trim()}&email=${creatorEmail.value.trim()}`
    );
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #9aaae5 0%, #b390d9 100%);
  padding: 5rem;
}

.cards-container {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 2rem;
  padding: 1rem;
  flex-wrap: wrap;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

h1 {
  text-align: center;
  color: #fff;
  font-size: 2rem;
  margin-bottom: 5rem;
  font-weight: 700;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.2rem;
  font-weight: bold;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group {
  width: 100%;
}

.input-field {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-field::placeholder {
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
