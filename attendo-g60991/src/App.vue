<template>
  <div class="min-h-screen">
    <!-- En-tête -->
    <header class="bg-black py-4">
      <h1 class="text-center text-fuchsia-600 text-3xl font-bold">Attendo</h1>
    </header>

    <!-- Navigation -->
    <nav class="flex justify-between items-center bg-gray-100 px-6 py-2 border-b">
      <div class="space-x-6 text-gray-800 text-sm">
        <RouterLink to="/">Accueil</RouterLink>
        <RouterLink to="/sessions">Sessions</RouterLink>
        <RouterLink to="/about">À propos</RouterLink>
      </div>

      <div class="flex items-center space-x-2 text-sm">
        <span v-if="user">{{ user.email }}</span>
        <button v-if="user" @click="signOut" class="text-red-600 underline hover:text-red-800">
          Déconnexion
        </button>
        <button v-else @click="signIn" class="border px-3 py-1 rounded hover:bg-gray-200">
          Connexion avec Google
        </button>
      </div>
    </nav>

    <!-- Contenu principal -->
    <main class="p-6">
      <RouterView />
    </main>
  </div>
</template>

<script>
import { supabase } from '@/supabase'
import store from '@/stores/user'
import { RouterLink, RouterView } from 'vue-router'

export default {
  components: {
    RouterLink,
    RouterView
  },
  computed: {
    user() {
      return store.user
    }
  },
  created() {
    this.loadUser()

    supabase.auth.onAuthStateChange((_event, session) => {
      store.user = session?.user ?? null
      if (!session) this.$router.push('/')
    })
  },
  methods: {
    async loadUser() {
      const { data } = await supabase.auth.getSession()
      store.user = data.session?.user ?? null
      store.isLoadingUser = false
    },
    async signIn() {
      await supabase.auth.signInWithOAuth({ provider: 'google' })
    },
    async signOut() {
      await supabase.auth.signOut()
      store.user = null
      this.$router.push('/')
    }
  }
}
</script>
