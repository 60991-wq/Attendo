<template>
  <header class="bg-gray-900 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-2xl font-bold text-purple-400">Attendo</h1>
      <div class="flex items-center space-x-6">
        <!-- Menu de navigation -->
        <nav class="space-x-4">
          <RouterLink to="/" class="hover:underline">Accueil</RouterLink>
          <RouterLink to="/sessions" class="hover:underline">Sessions</RouterLink>
          <RouterLink to="/about" class="hover:underline">À propos</RouterLink>
        </nav>
        
        <!-- Connexion / Déconnexion -->
        <div v-if="user">
          <button 
            @click="handleLogout" 
            class="border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-gray-900 transition"
          >
            Déconnexion
          </button>
        </div>
        <div v-else>
          <button 
            @click="handleLogin" 
            class="border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-gray-900 transition"
          >
            Connexion avec Google
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { useUserStore } from '@/stores/user';
import { supabase } from '@/services/SupabaseClient'; 
import { RouterLink } from 'vue-router';

export default{
  name :'AppHearder',
  components:{
    RouterLink
  },
  data(){
    return{
      userStore:useUserStore()
    }
  },
  computed:{
    user(){
    return this.useStore.user
  }
},
methods:{
  async handleLogin(){
    await supabase.auth.signWithAuth({ provider: 'google' })
  },
  async handleLogout(){
    await supabase.auth.signOut()
    this.useUserStore.setUser(null)
  }
}
}
</script>
