<template>
  <div class="p-6 space-y-8">
    <!-- Fil d'Ariane simple -->
    <div class="text-sm text-gray-500 flex items-center space-x-2">
      <router-link to="/" class="hover:underline">Accueil</router-link>
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
      <span>Sessions</span>
    </div>

    <h1 class="text-2xl font-bold">Sessions</h1>

    <!-- Loader -->
    <div v-if="loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
    </div>
    
    <template v-else>
      <!-- 🗂 Tableau des sessions -->
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-900 text-white">
            <th class="text-left p-2">SESSIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="session in sessions"
            :key="session.id"
            class="border-b hover:bg-gray-50"
          >
            <td class="p-2">
              <router-link :to="`/sessions/${session.id}`" class="text-blue-600 hover:underline">
                {{ session.label }}
              </router-link>
            </td>
          </tr>
          <tr v-if="sessions.length === 0">
            <td class="p-4 text-center text-gray-500">
              Aucune session disponible
            </td>
          </tr>
        </tbody>
      </table>

      <!-- ➕ Formulaire d'ajout -->
      <form @submit.prevent="handleCreate" class="flex items-center space-x-2 mt-4">
        <div class="flex items-center border rounded bg-gray-100 px-2 py-1 w-full max-w-sm">
          <span class="text-purple-600">👥</span>
          <input
            v-model="label"
            type="text"
            placeholder="Nouvelle session"
            class="bg-transparent ml-2 w-full outline-none"
            required
          />
        </div>
        <button
          type="submit"
          class="bg-white border px-4 py-2 rounded hover:bg-gray-100 text-sm"
          :disabled="formLoading"
        >
          <span v-if="formLoading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Ajout...
          </span>
          <span v-else>Ajouter</span>
        </button>
      </form>
    </template>
  </div>
</template>

<script>
import { supabase } from '@/supabase' // Utiliser votre chemin d'import existant

export default {
  data() {
    return {
      sessions: [],
      label: '',
      loading: true,
      formLoading: false
    }
  },
  
  async created() {
    await this.loadSessions()
  },
  
  methods: {
    // 🔄 Charger la liste des sessions
    async loadSessions() {
      this.loading = true
      
      try {
        const { data, error } = await supabase
          .from('session')
          .select('*')
          .order('id', { ascending: true })
        
        if (error) throw error
        this.sessions = data
      } catch (error) {
        console.error('Erreur lors du chargement des sessions:', error)
      } finally {
        this.loading = false
      }
    },
    
    // ➕ Créer une nouvelle session
    async handleCreate() {
      if (!this.label.trim()) return
      
      this.formLoading = true
      
      try {
        const { error } = await supabase
          .from('session')
          .insert([{ label: this.label }])
        
        if (error) throw error
        
        this.label = ''
        await this.loadSessions()
      } catch (error) {
        console.error('Erreur lors de la création de la session:', error)
        alert('Impossible de créer la session')
      } finally {
        this.formLoading = false
      }
    }
  }
}
</script>