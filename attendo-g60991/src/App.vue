<template>
  <div class="min-h-screen bg-white text-gray-800">

    <header class="bg-black text-white py-4 text-center">
      <h1 class="text-3xl font-bold text-fuchsia-500">Attendo</h1>
    </header>

    <nav class="bg-gray-100 border-b">
      <div class="container mx-auto px-6 py-2 flex justify-between items-center">
        <div class="space-x-6 text-sm">
          <RouterLink to="/" class="hover:text-fuchsia-600" :class="{ 'text-fuchsia-600': $route.path === '/' }">Accueil</RouterLink>
          <RouterLink to="/sessions" class="hover:text-fuchsia-600" :class="{ 'text-fuchsia-600': $route.path.startsWith('/sessions') }">Sessions</RouterLink>
          <RouterLink to="/about" class="hover:text-fuchsia-600" :class="{ 'text-fuchsia-600': $route.path === '/about' }">À propos</RouterLink>
        </div>

        <div class="flex items-center space-x-2 text-sm">
          <span v-if="userStore.user">{{ userStore.user.email }}</span>
          <button
            v-if="userStore.user"
            @click="handleSignOut"
            class="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-600 hover:text-white"
          >
            Déconnexion
          </button>
          <button
            v-else
            @click="handleSignIn"
            class="border px-3 py-1 rounded hover:bg-gray-200"
          >
            Connexion avec Google
          </button>
        </div>
      </div>
    </nav>

    <div v-if="userStore.isLoadingUser" class="fixed inset-0 bg-white/50 flex items-center justify-center z-50">
      <div class="animate-spin h-10 w-10 border-4 border-fuchsia-500 border-t-transparent rounded-full"></div>
    </div>

    <main class="p-6">
      <RouterView />
    </main>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user'
import { supabase } from '@/supabase'
import { RouterLink, RouterView } from 'vue-router'

export default {
  components: {
    RouterLink,
    RouterView
  },
  data() {
    return {
      userStore: useUserStore()
    }
  },
  created() {
    this.loadUser()
    supabase.auth.onAuthStateChange((_event, session) => {
      this.userStore.user = session?.user ?? null
    })
  },
  methods: {
    async loadUser() {
      this.userStore.isLoadingUser = true
      const { data } = await supabase.auth.getSession()
      this.userStore.user = data.session?.user ?? null
      this.userStore.isLoadingUser = false
    },
    async handleSignIn() {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })
    },
    async handleSignOut() {
      await supabase.auth.signOut()
      this.userStore.user = null
      this.$router.push('/')
    }
  }
}
</script>
