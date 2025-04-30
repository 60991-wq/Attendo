<template>
  <div class="text-xl mt-10 px-6">
    <p v-if="user">Bonjour, {{ user.email }}</p>
    <p v-else>Bienvenue, veuillez vous connecter pour plus de contenu !</p>
  </div>
</template>

<script>
import { user } from '@/stores/user'

export default {
  computed: {
    user() {
      return user
    }
  }
}
</script>
