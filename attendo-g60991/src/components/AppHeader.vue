<template>
  <header class="shadow-md">

    <div class="bg-black px-6 py-4 text-center">
      <h1 class="text-2xl font-bold text-pink-500">Attendo</h1>
    </div>

    <nav class="bg-gray-100 px-6 py-2 flex justify-between items-center">

      <div class="flex space-x-6 text-black">
        <RouterLink to="/" class="hover:underline">Accueil</RouterLink>
        <RouterLink to="/sessions" class="hover:underline">Sessions</RouterLink>
        <RouterLink to="/about" class="hover:underline">À propos</RouterLink>
      </div>

      <div>
        <button
          v-if="user"
          @click="handleLogout"
          class="border border-black text-black px-4 py-2 rounded hover:bg-black hover:text-white transition"
        >
          Déconnexion
        </button>
        <button
          v-else
          @click="handleLogin"
          class="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition"
        >
          Connexion avec Google
        </button>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useUserStore } from '@/stores/user'
import { RouterLink } from 'vue-router'

export default {
  name: 'AppHeader',
  components: { RouterLink },
  computed: {
    ...mapState(useUserStore, ['user'])
  },
  methods: {
    ...mapActions(useUserStore, ['signInWithGoogle', 'signOut']),
    handleLogin() {
      this.signInWithGoogle()
    },
    handleLogout() {
      this.signOut(this.$router)
    }
  }
}
</script>
