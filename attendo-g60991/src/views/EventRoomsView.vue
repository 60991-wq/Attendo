<template>
  <div class="p-6">
    <Breadcrumb :items="[
      { label: 'Accueil', link: '/' },
      { label: 'Sessions', link: '/sessions' },
      { label: 'Session', link: `/sessions/${session}` },
      { label: 'UE' },
      { label: 'Épreuve' }
    ]" />

    <h2 class="text-xl font-bold mb-4 text-blue-900">
      Liste des locaux pour <span class="text-blue-700">{{ eventLabel }}</span>
      <span class="text-sm italic"> - {{ ue }}</span>
    </h2>

    <!-- Formulaire ajout -->
    <div class="bg-white shadow rounded p-4 flex items-center space-x-4 max-w-xl mb-6">
      <label class="text-gray-600">Local</label>
      <select v-model="selectedRoom" class="border px-3 py-1 rounded w-full">
        <option disabled value="">Choisissez un local</option>
        <option v-for="room in availableRooms" :key="room.label" :value="room.label">
          {{ room.label }}
        </option>
      </select>
      <button
        :disabled="isLoading"
        @click="addRoom"
        class="bg-white text-black border border-black rounded px-4 py-1 hover:bg-gray-100"
      >
        Ajouter
      </button>
    </div>

    <!-- Locaux assignés cliquables -->
    <div class="flex flex-wrap gap-4">
      <div
        v-for="label in usedRooms"
        :key="label"
        class="bg-white p-4 border rounded shadow text-center min-w-[120px] cursor-pointer hover:bg-gray-100"
        @click="goToPresence(label)"
      >
        <div class="text-xl font-bold text-blue-900">{{ label }}</div>
        <div class="text-sm text-gray-500 mt-1">Surveillant : -</div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb.vue'
import { fetchAllRooms } from '@/services/roomService'
import { fetchUsedRooms, assignRoomToEvent } from '@/services/eventRomService'

export default {
  name: 'EventRoomsView',
  
  components: {
    Breadcrumb
  },
  
  data() {
    return {
      eventId: this.$route.params.id,
      eventLabel: this.$route.query.label,
      session: this.$route.query.session,
      ue: this.$route.query.ue,
      allRooms: [],
      usedRooms: [],
      selectedRoom: '',
      isLoading: false
    }
  },
  
  computed: {
    availableRooms() {
      return this.allRooms.filter(room => !this.usedRooms.includes(room.label))
    }
  },
  
  methods: {
    async addRoom() {
      if (
        !this.selectedRoom ||
        this.isLoading ||
        this.usedRooms.includes(this.selectedRoom)
      ) return

      this.isLoading = true
      try {
        const result = await assignRoomToEvent(this.eventId, this.selectedRoom)
        this.usedRooms.push(this.selectedRoom)
        this.selectedRoom = ''
      } catch (error) {
        console.error('Erreur lors de l\'ajout du local :', error)
      } finally {
        this.isLoading = false
      }
    },
    
    goToPresence(roomLabel) {
      this.$router.push({
        name: 'presenceView', 
        params: {
          eventId: this.eventId,
          roomId: roomLabel
        },
        query: {
          room: roomLabel,
          ue: this.ue,
          session: this.session
        }
      })
    }
  },
  
  async mounted() {
    try {
      const resultRooms = await fetchAllRooms()
      this.allRooms = resultRooms
      
      const resultUsedRooms = await fetchUsedRooms(this.eventId)
      this.usedRooms = resultUsedRooms
    } catch (error) {
      console.error('Erreur lors du chargement des données :', error)
    }
  }
}
</script>