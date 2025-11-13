<template>
  <nav class="navbar">
    <div class="navbar-container">
      <NuxtLink to="/" class="navbar-brand"> Retrospective AI </NuxtLink>
      <p v-if="userName" class="navbar-user">{{ userName }}</p>
    </div>
  </nav>
</template>

<script setup lang="ts">
const userStore = useUserStore();

const userName = computed(() => userStore.getName);
</script>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(154, 170, 229, 0.2);
}

.navbar-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
  text-decoration: none;
}

.navbar-brand:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.navbar-link {
  color: #666;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.navbar-link:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.navbar-link.router-link-active {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.navbar-user {
  color: #666;
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0;
}

@media (max-width: 640px) {
  .navbar-container {
    padding: 0 1rem;
  }

  .navbar-brand {
    font-size: 1.25rem;
  }

  .navbar-link {
    font-size: 0.875rem;
    padding: 0.375rem 0.75rem;
  }
}
</style>
