<template>
  <div class="min-h-screen">
    <!-- En-tête -->
    <header class="bg-black py-4">
      <h1 class="text-center text-fuchsia-600 text-3xl font-bold">Attendo</h1>
    </header>
    
    <!-- Navigation -->
    <nav class="flex justify-between items-center bg-gray-100 px-6 py-2 border-b">
      <div class="space-x-6 text-gray-800 text-sm">
        <RouterLink to="/" class="hover:text-fuchsia-600 transition-colors" :class="{ 'text-fuchsia-600': $route.path === '/' }">Accueil</RouterLink>
        <RouterLink to="/sessions" class="hover:text-fuchsia-600 transition-colors" :class="{ 'text-fuchsia-600': $route.path.startsWith('/sessions') }">Sessions</RouterLink>
        <RouterLink to="/about" class="hover:text-fuchsia-600 transition-colors" :class="{ 'text-fuchsia-600': $route.path === '/about' }">À propos</RouterLink>
      </div>
      
      <div class="flex items-center space-x-2 text-sm">
        <span v-if="userStore.user">{{ userStore.user.email }}</span>
        <button v-if="userStore.user" @click="handleSignOut" class="text-red-600 underline hover:text-red-800">
          Déconnexion
        </button>
        <button v-else @click="handleSignIn" class="border px-3 py-1 rounded hover:bg-gray-200">
          Connexion avec Google
        </button>
      </div>
    </nav>
    
    <!-- Loader pendant le chargement de l'utilisateur -->
    <div v-if="userStore.isLoadingUser" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
    </div>
    
    <!-- Contenu principal -->
    <main class="p-6">
      <RouterView />
    </main>
  </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { supabase } from '@/services/SupabaseClient'

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
    
    // Écouter les changements d'authentification
    supabase.auth.onAuthStateChange((_event, session) => {
      this.userStore.user = session?.user ?? null
      if (!session) this.$router.push('/')
    })
  },
  methods: {
    async loadUser() {
      try {
        this.userStore.isLoadingUser = true
        const { data } = await supabase.auth.getSession()
        this.userStore.user = data.session?.user ?? null
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error)
      } finally {
        this.userStore.isLoadingUser = false
      }
    },
    
    async handleSignIn() {
      try {
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        })
      } catch (error) {
        console.error('Erreur lors de la connexion:', error)
      }
    },
    
    async handleSignOut() {
      try {
        await supabase.auth.signOut()
        this.userStore.user = null
        this.$router.push('/')
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error)
      }
    }
  }
}
</script>