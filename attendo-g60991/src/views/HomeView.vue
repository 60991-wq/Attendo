<template>
  <div class="text-xl mt-10 px-6">
    <p v-if="userStore.user">Bonjour, {{ userStore.user.email }}</p>
    <p v-else>Bienvenue, veuillez vous connecter pour plus de contenu !</p>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user'

export default {
  data() {
    return {
      userStore: useUserStore()
    }
  }
}
</script>
