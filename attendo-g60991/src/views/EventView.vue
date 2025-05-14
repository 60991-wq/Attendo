<template>
  <div class="w-full px-6 mt-6">
    <!-- Fil d'Ariane -->
    <Breadcrumb :items="[
      { label: 'Accueil', link: '/' },
      { label: 'Sessions', link: '/sessions' },
      { label: 'Session', link: `/sessions/${$route.query.session}` },
      { label: 'UE' }
    ]" />

    <h2 class="text-xl font-bold mb-4 text-blue-400">
     Liste des épreuves de
     <span class="font-medium">{{ $route.query.ue }}</span>
    <span class="text-italic">(session : {{ $route.query.session }})</span>
</h2>

    <!-- Liste des épreuves -->
    <div class="flex flex-wrap gap-4 mb-6">
      <div
        v-for="event in events"
        :key="event.id"
        class="bg-gray-100 p-4 rounded shadow min-w-[150px] text-center font-semibold cursor-pointer hover:bg-gray-200"
        @click="goToRooms(event)"
      >
        {{ event.label }}
      </div>
    </div>

    <!-- Ajout d'une épreuve -->
    <form @submit.prevent="addEvent" class="bg-white shadow rounded p-4 flex items-center space-x-4 max-w-xl">
      <label class="text-gray-600">Intitulé :</label>
      <input
        v-model="newEventLabel"
        type="text"
        placeholder="bilan, projet, examen..."
        class="border rounded px-3 py-1 w-full"
      />
      <button
        type="submit"
        class="bg-white text-black border border-black rounded px-4 py-1 hover:bg-gray-100"
      >
        Créer
      </button>
    </form>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb.vue'
import { fetchEvents, createEvent } from '@/services/eventService'

export default {
  name: 'EventView',
  
  components: {
    Breadcrumb
  },
  
  data() {
    return {
      sessionCompoId: this.$route.params.id,
      events: [],
      newEventLabel: ''
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
          session: this.$route.query.session
        }
      })
    },
    
    async loadEvents() {
      try {
        const result = await fetchEvents(this.sessionCompoId)
        this.events = result
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
    }
  },
  
  mounted() {
    this.loadEvents()
  }
}
</script>