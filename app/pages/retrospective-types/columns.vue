<template>
  <div class="retrospective-container">  
      <div v-for="column in typeColumnsMock.columns" :key="column.id" :class="['retrospective-column', `column-${column.id}`]">
        <form @submit.prevent="handleSubmit" class="retrospective-form">
          <h2 class="column-title" :style="{ 'color': column.color }">{{ column.label }}</h2>
          <p class="column-description">{{ column.description }}</p>
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
          <button type="submit" class="submit-button" :disabled="!inputText?.trim()" :style="{ 'background-color': column.color }">
            Add
          </button>
        </form>

        <div class="retrospective-cards">
          <div class="card-wrapper">
            <div 
            :ref="(el) => setCardRef(el, column.id, 0)" 
            class="card" 
            :style="{ 
              'background-color': column.color,
              'min-height': cardHeights[`${column.id}-0`] ? `${cardHeights[`${column.id}-0`]}px` : 'auto'
            }"
            >
              <p class="card-text" >Use the new retrospective platform</p>
              <p class="card-author">{{ userName }}</p>
            </div>
          </div>

          <div class="card-wrapper">
            <div 
            :ref="(el) => setCardRef(el, column.id, 1)" 
            class="card" 
            :style="{ 
              'background-color': column.color,
              'min-height': cardHeights[`${column.id}-1`] ? `${cardHeights[`${column.id}-1`]}px` : 'auto'
            }"
              >
              <p class="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos</p>
              <p class="card-author">{{ userName }}</p>
            </div>
          </div>
          <div class="card-wrapper">
            <div 
            :ref="(el) => setCardRef(el, column.id, 0)" 
            class="card" 
            :style="{ 
              'background-color': column.color,
              'min-height': cardHeights[`${column.id}-0`] ? `${cardHeights[`${column.id}-0`]}px` : 'auto'
            }"
            >
              <p class="card-text" >Use the new retrospective platform</p>
              <p class="card-author">{{ userName }}</p>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMongodbApi } from '~/composables/useMongodbApi';
import { typeColumnsMock } from '~/mocks/typeColumns.mock'

const route = useRoute()
const { createPost } = useMongodbApi();

const userName = useUserStore().getName

const retrospectiveID = ref(route.query.id as string || '')

const board = ref<any>(null);
const inputText = ref('')
const cardRefs = ref<Record<string, HTMLElement>>({})
const cardHeights = ref<Record<string, number>>({})

const handleSubmit = async () => {
  if (inputText.value.trim()) {


    try {
      const res = await createPost(
       retrospectiveID.value, 
        {
          content: inputText.value.trim(),
          userId: userName,
          columnId: 'start'
        } 
      )
      
      if (res.success) {
        navigateTo(`/retrospective-types/columns?id=${retrospectiveID.value}`)
        return
      }

      console.warn('Error creating post:', res.message)
    } catch (err: any) {
      console.error('[handleSubmit]', err)
      alert('Error creating post. Please try again later.')
    }
  }
}

const setCardRef = (el: Element | ComponentPublicInstance | null, columnId: string, cardIndex: number) => {
  if (el && el instanceof HTMLElement) {
    const key = `${columnId}-${cardIndex}`
    cardRefs.value[key] = el
    updateCardHeight(el, columnId, cardIndex)
  }
}

const updateCardHeight = (card: HTMLElement, columnId: string, cardIndex: number) => {
  const width = card.offsetWidth
  const key = `${columnId}-${cardIndex}`
  cardHeights.value[key] = width
}

const setCardMinHeight = () => {
  nextTick(() => {
    Object.keys(cardRefs.value).forEach((key) => {
      const card = cardRefs.value[key]
      if (card) {
        const parts = key.split('-')
        const columnId = parts[0]
        const cardIndex = parts[1]
        if (columnId && cardIndex) {
          updateCardHeight(card, columnId, parseInt(cardIndex))
        }
      }
    })
  })
}

onMounted(() => {
  setCardMinHeight()
  window.addEventListener('resize', setCardMinHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', setCardMinHeight)
})

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
  align-items: strech;
  justify-content: center;
  display: flex;
  flex-direction: row;
  gap: 2%;
}

.retrospective-column {
  min-width: 300px;
  max-width: 450px;
}

.retrospective-form {
  border-bottom: 1px solid #e0e0e0;
  padding: 1.2rem;
}

.column-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  filter: brightness(0.9) saturate(1.4);
}

.column-description {
  text-align: center;
  color: #333;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 400;
}

.retrospective-form {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.textarea-field {
  width: 100%;
  padding: 0.7rem;
  border: 2px solid #e0e0e0;
  height: 60px;
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

.retrospective-cards {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: 10px;
  column-gap: 16px;
  padding: 1rem;
}

.card-wrapper {
  width: calc(50% - 8px);
} 

.card {
  box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.1);
  font-family: var(--font-secondary);
  border-radius: 0.2rem;
  padding: 0.7rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
} 

.card-text {
  font-size: 1.4rem;
}

.card-author {
  text-align: right;
  font-size: 1rem;
  font-weight: 600;
  margin: 0.5rem 0;
}
</style>

