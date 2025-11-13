<template>
  <div class="retrospective-container">
  <pre>{{ board }}</pre>
    <div class="retrospective-card">
      <p class="welcome-message">Hola, <strong>{{ userName }}</strong></p>
      
      <form @submit.prevent="handleSubmit" class="retrospective-form">
        <div class="input-group">
          <textarea
            v-model="inputText"
            type="text"
            placeholder="Escribe tus opiniones..."
            required
            autofocus
            class="textarea-field"
          />
        </div>
        
        <button type="submit" class="submit-button" :disabled="!inputText.trim()">
          Enviar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const route = useRoute()
const { createPost } = useMongodbApi();


const userName = ref(route.query.name as string || 'Usuario')
const retrospectiveID = ref(route.query.id as string || '')

const inputText = ref('')
const board = ref<any>(null);

const handleSubmit = async () => {
  if (inputText.value.trim()) {


    try {
      const res = await createPost(
       retrospectiveID.value, 
        {
          content: inputText.value.trim(),
          userId: userName.value,
          columnId: 'start'
        } 
      )
      
      if (res.success) {
        navigateTo(`/retrospective?id=${retrospectiveID.value}`)
        return
      }

      console.warn('Error creating post:', res.message)
    } catch (err: any) {
      console.error('[handleSubmit]', err)
      alert('Error creating post. Please try again later.')
    }


    // try {


    //   const res = await $fetch('/api/posts/create', {
    //     method: 'POST',
    //     body: {
    //       boardId: retrospectiveID.value,
    //       note: {
    //         content: inputText.value.trim(),
    //         userId: userName.value,
    //         columnId: 'start'
    //       }
    //     }
    //   })

    //   inputText.value = ''
    // } catch (err) {
    //   console.error('❌ Error al crear la nota:', err)
    //   alert('Error al crear la nota')
    // }
  }
}

const loadBoard = async () => {
  if (!retrospectiveID.value) return

  try {
    const res: any = await $fetch(`/api/boards`, {
      method: 'GET',
      params: { id: retrospectiveID.value }
    });

    if (res.success) {
      board.value = res.board
    } else {
      navigateTo('/');
    }

  } catch (err: any) {
    console.error(err)
    alert('Error cargando el board')
  }
}

onMounted(loadBoard)
</script>

<style scoped>
.retrospective-container {
  min-height: 100vh;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: linear-gradient(135deg, #9aaae5 0%, #b390d9 100%);
  padding: 1rem;
}

.retrospective-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
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

