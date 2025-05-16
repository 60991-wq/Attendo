<template>
  <div class="w-full px-6 mt-0">
       <Breadcrumb :items="breadcrumbItems" />

    <h2 class="text-xl font-bold mb-4 mt-4 text-blue-800">
      Liste des épreuves de
      <span class="font-medium text-blue-700">{{ $route.query.ue }}</span>
      <span class="italic text-blue-600">(session : {{ sessionLabel }})</span>
    </h2>

    <div v-if="events.length === 0" class="text-gray-600 italic mb-4">
      Aucune épreuve n’a encore été ajoutée pour cette UE.
    </div>


    <div v-if="events.length > 0" class="flex flex-wrap gap-4 mb-6">
      <div
        v-for="event in events"
        :key="event.id"
        class="bg-gray-100 p-4 rounded shadow min-w-[150px] text-center font-semibold cursor-pointer hover:bg-gray-200"
        @click="goToRooms(event)"
      >
        {{ event.label }}
      </div>
    </div>

    <AddForm
      v-model="newEventLabel"
      icon="📝"
      placeholder="bilan, projet, examen..."
      submitLabel="Créer"
      @submit="addEvent"
    />
  </div>
</template>


<script>
import Breadcrumb from '@/components/Breadcrumb.vue'
import { fetchEvents, createEvent } from '@/services/eventService'
import AddForm from '@/components/AddForm.vue'
import { fetchSessionLabel } from '@/services/SessionDetailView'

export default {
  name: 'EventView',

  components: {
    Breadcrumb,
    AddForm
  },

  data() {
    return {
       sessionCompoId: this.$route.params.id || this.$route.query.sessionCompoId,
      events: [],
      newEventLabel: '',
      sessionLabel: ''
    }
  },

  computed: {
    breadcrumbItems() {
      return [
        { label: 'Accueil', link: '/' },
        { label: 'Sessions', link: '/sessions' },
        { label: 'Session', link: `/sessions/${this.$route.query.session}` },
        {
          label: 'UE',
          link: `/session-compo/${this.$route.query.sessionCompoId || this.sessionCompoId}/events?ue=${this.$route.query.ue}&session=${this.$route.query.session}`

        }
      ]
    }
  },

  methods: {
    goToRooms(event) {
      this.$router.push({
        name: 'eventRooms',
        params: { id: event.id },
        query: {
          label: event.label,
          ue: this.$route.query.ue,
          session: this.$route.query.session,
          sessionCompoId: this.sessionCompoId
        }
      })
    },

    async loadEvents() {
      try {
         this.events = await fetchEvents(this.sessionCompoId)
      } catch (error) {
        console.error('Erreur chargement events :', error)
      }
    },

    async addEvent() {
      if (!this.newEventLabel.trim()) return

      try {
        const result = await createEvent(this.sessionCompoId, this.newEventLabel)
        this.events.push(result)
        this.newEventLabel = ''
      } catch (error) {
        console.error('Erreur création épreuve :', error)
      }
    },

    async loadSessionLabel() {
      try {
        const label = await fetchSessionLabel(parseInt(this.$route.query.session))
        this.sessionLabel = label
      } catch (error) {
        console.error('Erreur récupération label session :', error)
        this.sessionLabel = '[inconnue]'
      }
    }
  },

  mounted() {
    this.loadEvents()
    this.loadSessionLabel()
  }
}
</script>
