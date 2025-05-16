<template>
  <AppHeader />
  <main class="flex-grow">
    <RouterView />
  </main>
</template>

<script>
import { useUserStore } from '@/stores/user'
import AppHeader from '@/components/AppHeader.vue'
import { RouterView } from 'vue-router'

export default {
  components: {
    AppHeader,
    RouterView
  },
  created() {
    const userStore = useUserStore()
    userStore.loadUser()
    userStore.setupAuthListener()
  }
}
</script>
