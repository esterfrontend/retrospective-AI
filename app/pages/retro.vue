<script setup lang="ts">
import { RETRO_TYPES, type RetroNote } from "~/models/retrospective";

const chipColors = ['#FF6B6B','#4ECDC4','#FFD93D','#6A4C93','#1A535C','#FF9F1C','#FF5E7E','#3A86FF','#8338EC','#FB5607','#FF006E','#70D6FF','#9B5DE5','#00BBF9','#00F5D4','#C77DFF','#80ED99','#57CC99','#22577A','#F15BB5'];

const route = useRoute();
const router = useRouter();

const retrospectiveStore = useRetrospectiveStore();
const userStore = useUserStore();

const noteList = ref<RetroNote[]>([]);
const userColors = ref<Record<string, string>>({});
const copied = ref(false)

const currentBoard = computed(() => retrospectiveStore.current);

const RetroFree = resolveComponent("retro-free");
const RetroColumns = resolveComponent("retro-column-space");
const RetroQuadrant = resolveComponent("retro-quadrant-space");

const COMPONENTS = {
  [RETRO_TYPES.COLUMNS]: RetroColumns,
  [RETRO_TYPES.QUADRANT]: RetroQuadrant,
};

const component = computed(
  () => COMPONENTS[currentBoard.value?.retroType as keyof typeof COMPONENTS]
);

const notes = computed(() => retrospectiveStore.notes);

const userEmail = computed(() => userStore.getEmail);
const userName = computed(() => userStore.getName);
const adminEmail = computed(() => currentBoard.value?.admin);
const isAdmin = computed(() => adminEmail.value === userEmail.value);

const participants = computed(() => {
  const users = currentBoard.value?.users || [];

  return users.flatMap(user => {
    const color = getUserColor(user.email);
    const enhancedUser = { ...user, color };

    return enhancedUser;
  });
});

const getUserColor = (email: string) => {
  if (!userColors.value[email]) {
    const random = chipColors[Math.floor(Math.random() * chipColors.length)];
    userColors.value[email] = random;
  }
  return userColors.value[email];
}


const setIntervalRefreshBoard = () => {
  setInterval(() => {
    retrospectiveStore.refreshBoard();
  }, 8000);
};

const handleLogNotes = (): void => {
  router.push("/summary");
};

const copyRetrospectiveId = () => {
  const id = route.query.id as string;
  navigator.clipboard.writeText(id);
  copied.value = true;

  setTimeout(() => {
      copied.value = false
    }, 2000)
}

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
    <div class="retro-header">
      <button @click="copyRetrospectiveId" class="share-button">
        <span v-if="!copied">Share retrospective</span>
        <span v-if="copied">Copied!</span>
      </button>
      <p>Owner: {{ adminEmail }}</p>
      <div class="collaborators-list">
        <span style="margin-right:10px">Collaborators</span>

        <div
          class="chip-users"
          v-for="user in participants.slice(0, 6)"
          :key="user.email"
          :data-name="user.name"
          :style="{ backgroundColor: user.color }"
        >
          {{ user.name[0] }}
        </div>

        <div
          v-if="participants.length > 6"
          class="chip-users"
        >
          +{{ participants.length - 6 }}
        </div>
      </div>
    </div>
    <div class="retrospective-board" v-if="currentBoard">
      <component :is="component" :board="currentBoard" :notes="notes" />
      <div class="actions-footer">
<<<<<<< HEAD
      <button v-if="isAdmin" class="log-notes-button" @click="handleLogNotes">
        Finish retrospective
      </button>
    </div>
=======
        <button class="log-notes-button" @click="handleLogNotes">
          Finish retrospective
        </button>
      </div>
>>>>>>> main
    </div>
  </div>
</template>

<style scoped>
.retrospective-container {
  min-height: 95vh;
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

.actions-footer {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  padding-top: 1.5rem;
  border-top: 2px solid #e0e0e0;
}

.log-notes-button {
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.log-notes-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.log-notes-button:active {
  transform: translateY(0);
}

.share-button {
  width: 200px;
  padding: 0.5rem 1.1rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.retro-header {
  max-width: 1200px;
  margin: auto;
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 10px 40px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.share-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(99, 102, 241, 0.4);
  filter: brightness(1.08);
}

.collaborators-list {
  display: flex;
  align-items: center;
}

.chip-users {
  width: 36px;
  height: 36px;
  background: #4f46e5;
  color: white;
  font-weight: 600;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s ease;
  margin-right: -12px;
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.35);
}

.chip-users:hover {
  transform: translateY(-2px);
}

/* Tooltip */
.chip-users::after {
  content: attr(data-name);
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: #111;
  color: white;
  padding: 4px 8px;
  font-size: 0.75rem;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

/* Flechita */
.chip-users::before {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: #111 transparent transparent transparent;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.chip-users:hover::after,
.chip-users:hover::before {
  opacity: 1;
}

</style>
