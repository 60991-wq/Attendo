<template>
  <div class="space-y-6">
    <!-- Fil d'Ariane -->
    <div class="text-sm text-gray-500 flex items-center space-x-2">
      <router-link to="/" class="hover:underline">Accueil</router-link>
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
      <router-link to="/sessions" class="hover:underline">Sessions</router-link>
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
      <span>{{ session?.label || 'Détail de la session' }}</span>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
    </div>

    <template v-else>
      <h1 class="text-2xl font-bold">
        Session <span class="italic text-fuchsia-600">{{ session?.label }}</span>
      </h1>

      <!-- Liste des UE -->
      <div class="bg-white shadow-sm rounded-lg overflow-hidden">
        <div class="bg-gray-900 text-white px-4 py-3 font-medium">
          UE associées à cette session
        </div>
        <div class="divide-y">
          <div 
            v-for="ue in sessionUes" 
            :key="ue.ue" 
            class="px-4 py-3 hover:bg-gray-50"
          >
            <router-link 
              :to="`/sessions/${sessionId}/ue/${ue.ue}`" 
              class="text-blue-600 hover:underline"
            >
              {{ ue.ue }}
            </router-link>
          </div>
          <div v-if="sessionUes.length === 0" class="px-4 py-6 text-center text-gray-500">
            Aucune UE n'est associée à cette session
          </div>
        </div>
      </div>

      <!-- Formulaire ajout UE -->
      <div class="mt-6 bg-white shadow-sm rounded-lg overflow-hidden">
        <div class="bg-gray-100 px-4 py-3 font-medium border-b">
          Ajouter une UE dans la session
        </div>
        <div class="p-4">
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <select 
              v-model="selectedUeId" 
              class="border rounded px-3 py-2 flex-grow"
              :disabled="availableUes.length === 0 || formLoading"
            >
              <option disabled value="">Choisissez une UE</option>
              <option v-for="ue in availableUes" :key="ue.ue" :value="ue.ue">
                {{ ue.ue }}
              </option>
            </select>
            <button
              @click="handleAddUe"
              class="bg-white border px-4 py-2 rounded hover:bg-gray-100 text-sm"
              :disabled="!selectedUeId || formLoading"
            >
              <span v-if="formLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Traitement...
              </span>
              <span v-else>Ajouter l'UE</span>
            </button>
          </div>
          <p v-if="availableUes.length === 0" class="mt-2 text-sm text-gray-500">
            Toutes les UE ont déjà été ajoutées à cette session
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { 
  fetchSessionUes, 
  fetchAvailableUes, 
  addUeToSession,
  fetchSessionDetails
} from '@/services/sessionDetailsService'

export default {
  data() {
    return {
      sessionId: this.$route.params.id,
      session: null,
      sessionUes: [],
      availableUes: [],
      selectedUeId: '',
      loading: true,
      formLoading: false
    }
  },
  
  async created() {
    await this.loadDetails()
  },
  
  methods: {
    async loadDetails() {
      this.loading = true
      
      try {
        // Charger les détails de la session
        this.session = await fetchSessionDetails(this.sessionId)
        
        // Charger les UE associées à cette session
        this.sessionUes = await fetchSessionUes(this.sessionId)
        
        // Charger les UE disponibles (non associées)
        this.availableUes = await fetchAvailableUes(this.sessionId)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      } finally {
        this.loading = false
      }
    },
    
    async handleAddUe() {
      if (!this.selectedUeId) return
      
      this.formLoading = true
      
      try {
        await addUeToSession(this.sessionId, this.selectedUeId)
        this.selectedUeId = ''
        await this.loadDetails()
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'UE:', error)
        alert('Impossible d\'ajouter l\'UE')
      } finally {
        this.formLoading = false
      }
    }
  }
}
</script>