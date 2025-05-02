<template>
  <div class="p-6 space-y-6">
    <Breadcrumb :items="[
      { label: 'Accueil', link: '/' },
      { label: 'Sessions', link: '/sessions' },
      { label: sessionLabel, link: `/sessions/${sessionId}` },
      { label: ueId }
    ]" />

    <h1 class="text-2xl">
      Liste des épreuves de <span class="italic text-blue-700">{{ ueId }}</span> 
      (session {{ sessionLabel }})
    </h1>

    <div v-if="loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
    </div>

    <template v-else>
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

      <div class="mt-6 pt-4 border-t">
        <h2 class="text-lg font-semibold mb-3">Ajouter une épreuve</h2>
        <div class="flex items-center space-x-2">
          <input
            v-model="newEventLabel"
            type="text"
            placeholder="Intitulé (ex: bilan, projet, examen...)"
            class="border p-2 rounded flex-grow"
            :disabled="formLoading"
          />
          <BaseButton
            @click="handleAddEvent"
            variant="light"
            :loading="formLoading"
            :disabled="!newEventLabel"
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
import { fetchSessionDetails } from '@/services/sessionDetailsService'
import { fetchEventsForUe, createEvent } from '@/services/events'
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import Breadcrumb from '@/components/layout/Breadcrumb.vue'

export default {
  components: {
    BaseTable,
    BaseButton,
    Breadcrumb
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
      errorMessage: ''
    }
  },
  async created() {
    await this.loadEvents()
  },
  methods: {
    async loadSessionDetails() {
      try {
        const sessionData = await fetchSessionDetails(this.sessionId)
        this.sessionLabel = sessionData.label
      } catch (error) {
        console.error('Erreur chargement session:', error)
      }
    },

    async loadEvents() {
      this.loading = true
      try {
        await this.loadSessionDetails()
        this.events = await fetchEventsForUe(this.sessionId, this.ueId)
      } catch (error) {
        console.error('Erreur chargement épreuves:', error)
      } finally {
        this.loading = false
      }
    },

    async handleAddEvent() {
      if (!this.newEventLabel.trim()) return
      this.formLoading = true
      this.errorMessage = ''
      try {
        await createEvent({
          label: this.newEventLabel,
          session: this.sessionId,
          ue: this.ueId,
          completed: false
        })
        this.newEventLabel = ''
        await this.loadEvents()
      } catch (error) {
        console.error('Erreur création épreuve:', error)
        this.errorMessage = "Impossible de créer l'épreuve"
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
