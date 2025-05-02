<template>
  <div class="p-6 space-y-6">
    <!-- Fil d'Ariane -->
    <Breadcrumb :items="[
      { label: 'Accueil', link: '/' },
      { label: 'Sessions', link: '/sessions' },
      { label: sessionLabel || 'Session', link: `/sessions/${sessionId}` },
      { label: ueId }
    ]" />

    <!-- Message d'erreur principal -->
    <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
      {{ error }}
    </div>

    <!-- Titre principal -->
    <h1 class="text-xl font-bold">
      Liste des épreuves de 
      <span class="text-blue-600">{{ ueId }}</span>
      <span class="text-gray-500">(session : {{ sessionLabel }})</span>
    </h1>

    <!-- Loader -->
    <div v-if="loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
    </div>

    <template v-else>
      <!-- Liste des épreuves -->
      <div class="bg-white shadow-sm rounded-lg overflow-hidden">
        <BaseTable
          :headers="['Épreuves', 'Statut']"
          :items="events"
          :fields="['label', 'completed']"
          @row-click="navigateToEvent"
        >
          <template #cell(completed)="{ value }">
            <span v-if="value" class="text-green-600">Complété</span>
            <span v-else class="text-yellow-600">En cours</span>
          </template>

          <template #empty>
            <div class="py-4 text-center text-gray-500">
              Aucune épreuve n'est disponible pour cette UE
            </div>
          </template>
        </BaseTable>
      </div>

      <!-- Formulaire d'ajout -->
      <div class="mt-6 pt-4 border-t">
        <h2 class="text-lg font-semibold mb-3">Ajouter une épreuve</h2>
        <div class="flex items-center space-x-2">
          <input 
            v-model="newEventLabel"
            class="border px-3 py-2 rounded flex-grow text-sm"
            placeholder="Intitulé (ex: bilan, projet, examen...)"
            :disabled="formLoading"
          />
          <BaseButton 
            @click="handleAddEvent" 
            variant="light"
            :loading="formLoading"
            :disabled="!newEventLabel.trim()"
          >
            Créer
          </BaseButton>
        </div>
        <div v-if="errorMessage" class="mt-2 text-red-600 text-sm">
          {{ errorMessage }}
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { supabase } from '@/supabase'
import Breadcrumb from '@/components/layout/Breadcrumb.vue'
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

export default {
  components: { 
    Breadcrumb, 
    BaseTable, 
    BaseButton 
  },
  
  data() {
    return {
      sessionId: this.$route.params.sessionId,
      ueId: this.$route.params.ueId,
      sessionLabel: '',
      events: [],
      newEventLabel: '',
      loading: true,
      formLoading: false,
      errorMessage: '',
      error: ''
    }
  },
  
  async created() {
    console.log('Session ID:', this.sessionId)
    console.log('UE ID:', this.ueId)
    await this.loadData()
  },
  
  methods: {
    async loadData() {
      this.loading = true
      try {
        await this.loadSessionDetails()
        await this.loadEvents()
      } catch (error) {
        console.error('Erreur de chargement:', error)
      } finally {
        this.loading = false
      }
    },
    
    async loadSessionDetails() {
      try {
        const { data, error } = await supabase
          .from('session')
          .select('label')
          .eq('id', this.sessionId)
          .single()
          
        if (error) throw error
        this.sessionLabel = data.label
      } catch (error) {
        console.error('Erreur chargement session:', error)
      }
    },
    
    async loadEvents() {
      try {
        console.log('Recherche de composition pour session_id:', this.sessionId, 'ue_id:', this.ueId)
        
        // D'abord, récupérer l'ID de la composition de session
        const { data: compo, error: compoError } = await supabase
          .from('session_compo')
          .select('id')
          .eq('session', this.sessionId)
          .eq('ue', this.ueId)
          .single()
          
        if (compoError) {
          console.error('Erreur récupération composition:', compoError)
          this.error = "Erreur: Impossible de trouver la composition session-UE"
          return
        }
        
        if (!compo) {
          console.error('Aucune session_compo trouvée')
          this.error = "Aucune association trouvée pour cette UE"
          this.events = []
          return
        }
        
        console.log('Composition trouvée:', compo)
        
        // Ensuite, récupérer les événements liés à cette composition
        const { data, error } = await supabase
          .from('event')
          .select('*')
          .eq('session_compo', compo.id)
          .order('label')
          
        if (error) throw error
        this.events = data
      } catch (error) {
        console.error('Erreur chargement épreuves:', error)
        this.events = []
      }
    },
    
    async handleAddEvent() {
      if (!this.newEventLabel.trim()) return
      
      this.formLoading = true
      this.errorMessage = ''
      
      try {
        // D'abord, récupérer l'ID de la composition de session
        const { data: compo, error: compoError } = await supabase
          .from('session_compo')
          .select('id')
          .eq('session', this.sessionId)
          .eq('ue', this.ueId)
          .single()
          
        if (compoError) {
          this.errorMessage = "Erreur: Impossible de trouver la composition session-UE"
          console.error('Erreur récupération composition:', compoError)
          return
        }
        
        if (!compo) {
          this.errorMessage = "Aucune composition session-UE trouvée"
          return
        }
        
        // Ensuite, créer l'événement
        const { error } = await supabase
          .from('event')
          .insert([{ 
            label: this.newEventLabel, 
            completed: false, 
            session_compo: compo.id 
          }])
          
        if (error) {
          this.errorMessage = "Erreur lors de la création de l'épreuve"
          throw error
        }
        
        this.newEventLabel = ''
        await this.loadEvents()
      } catch (error) {
        console.error('Erreur création épreuve:', error)
        if (!this.errorMessage) {
          this.errorMessage = "Impossible de créer l'épreuve"
        }
      } finally {
        this.formLoading = false
      }
    },
    
    navigateToEvent(event) {
      this.$router.push({
        name: 'event-detail',
        params: {
          sessionId: this.sessionId,
          ueId: this.ueId,
          eventId: event.id
        }
      })
    }
  }
}
</script>