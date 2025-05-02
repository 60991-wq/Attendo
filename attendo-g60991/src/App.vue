<template>
  <div class="min-h-screen">
    <!-- En-tête -->
    <AppHeader />
    
    <!-- Navigation avec le composant NavMenu -->
    <nav class="flex justify-between items-center bg-gray-100 px-6 py-2 border-b">
      <NavMenu />
      
      <div class="flex items-center space-x-2 text-sm">
        <span v-if="userStore.user">{{ userStore.user.email }}</span>
        <BaseButton 
          v-if="userStore.user" 
          @click="handleSignOut" 
          variant="link" 
          class="text-red-600 hover:text-red-800"
        >
          Déconnexion
        </BaseButton>
        <BaseButton 
          v-else 
          @click="handleSignIn" 
          variant="outline"
        >
          Connexion avec Google
        </BaseButton>
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
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { supabase } from '@/services/SupabaseClient' 
import AppHeader from '@/components/layout/AppHeader.vue'
import NavMenu from '@/components/layout/NavMenu.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

export default {
  components: {
    RouterView,
    AppHeader,
    NavMenu,
    BaseButton
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