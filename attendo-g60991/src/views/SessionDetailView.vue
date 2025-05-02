<template>
  <div class="space-y-6">
    <!-- Fil d'Ariane avec le composant -->
    <Breadcrumb :items="[
      { label: 'Accueil', link: '/' },
      { label: 'Sessions', link: '/sessions' },
      { label: session?.label || 'Détail de la session' }
    ]" />

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
        <UEList 
          :ues="sessionUes" 
          :sessionId="sessionId" 
          @ue-clicked="navigateToUE"
        />
      </div>

      <!-- Formulaire ajout UE -->
      <div class="mt-6 bg-white shadow-sm rounded-lg overflow-hidden">
        <div class="bg-gray-100 px-4 py-3 font-medium border-b text-sm">
          Ajouter une UE dans la session
        </div>
        <div class="p-2 text-sm">
          <div class="flex flex-col sm:flex-row sm:items-center gap-2">
            <BaseSelect 
              v-model="selectedUeId" 
              :options="availableUEOptions"
              placeholder="Choisissez une UE"
              :disabled="availableUes.length === 0 || formLoading"
              class="flex-grow text-sm py-1 px-2"
            />
            <BaseButton
              @click="handleAddUe"
              variant="light"
              :loading="formLoading"
              :disabled="!selectedUeId || formLoading"
              class="text-sm px-3 py-1"
            >
              Ajouter l'UE
            </BaseButton>
          </div>
          <p v-if="availableUes.length === 0" class="mt-2 text-xs text-gray-500">
            Toutes les UE ont déjà été ajoutées à cette session.
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
import Breadcrumb from '@/components/layout/Breadcrumb.vue'
import UEList from '@/components/session/ueList.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

export default {
  components: {
    Breadcrumb,
    UEList,
    BaseSelect,
    BaseButton
  },
  
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
  
  computed: {
    availableUEOptions() {
      return this.availableUes.map(ue => ({
        value: ue.ue,
        label: ue.ue
      }))
    }
  },
  
  async created() {
    await this.loadDetails()
  },
  
  methods: {
    async loadDetails() {
      this.loading = true
      try {
        this.session = await fetchSessionDetails(this.sessionId)
        this.sessionUes = await fetchSessionUes(this.sessionId)
        this.availableUes = await fetchAvailableUes(this.sessionId)
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error)
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
        console.error('Erreur lors de l\'ajout de l\'UE :', error)
        alert('Impossible d\'ajouter l\'UE')
      } finally {
        this.formLoading = false
      }
    },
    
    navigateToUE(ueCode) {
      console.log('UE cliquée (code) :', ueCode)
      this.$router.push(`/sessions/${this.sessionId}/ue/${ueCode}`)
    }
  }
}
</script>
