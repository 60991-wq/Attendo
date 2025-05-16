<template>
  <div class="w-full px-6 mt-0">
    <Breadcrumb :items="breadcrumbItems" />

    <h2 class="text-xl font-bold mb-4 mt-4 text-blue-800">
      Liste des locaux pour <span class="text-blue-700">{{ eventLabel }}</span>
      <span class="text-sm italic"> - {{ ue }}</span>
    </h2>

    <AddForm v-model="selectedRoom" icon="🏫" submitLabel="Ajouter" @submit="addRoom">
      <select v-model="selectedRoom" class="border px-3 py-1 rounded w-full">
        <option disabled value="">Choisissez un local</option>
        <option v-for="room in availableRooms" :key="room.label" :value="room.label">
          {{ room.label }}
        </option>
      </select>
    </AddForm>

    <div v-if="usedRooms.length === 0" class="text-gray-600 italic mt-4">
      Aucun local n'a encore été assigné à cette épreuve.
    </div>


    <div v-else class="flex flex-wrap gap-3 mt-4">
      <div v-for="room in usedRooms" :key="room.room"
        class="border rounded-md px-4 py-2 shadow-sm hover:shadow transition cursor-pointer bg-white text-sm min-w-[100px]"
        @click="goToPresence(room.room)">
        <div class="font-semibold text-blue-800 text-center">{{ room.room }}</div>
        <div class="text-xs text-gray-500 text-center mt-1">
          <div class="text-xs text-gray-500 text-center mt-1">
            Présents :
            <span class="text-black font-medium">
              {{ roomStats[room.room]?.present || 0 }}
            </span>
            /
            <span>
              {{ roomStats[room.room]?.capacity || '?' }}
            </span>
          </div>

          Surveillant :
          <span :class="room.supervisor ? 'text-black font-medium' : 'italic text-gray-400'">
            {{ room.supervisor || 'Non défini' }}
          </span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb.vue'
import { fetchAllRooms } from '@/services/roomService'
import { fetchUsedRooms, assignRoomToEvent } from '@/services/eventRomService'
import AddForm from '@/components/AddForm.vue'
import { supabase } from '@/supabase'

export default {
  name: 'EventRoomsView',

  components: {
    Breadcrumb,
    AddForm
  },

  data() {
    return {
      eventId: this.$route.params.id || this.$route.query.eventId,
      eventLabel: this.$route.query.label,
      session: this.$route.query.session,
      ue: this.$route.query.ue,
      sessionCompoId: this.$route.query.sessionCompoId,

      allRooms: [],
      usedRooms: [],
      selectedRoom: '',
      isLoading: false,
      roomStats: {}
    }
  },


  computed: {
    breadcrumbItems() {
      return [
        { label: 'Accueil', link: '/' },
        { label: 'Sessions', link: '/sessions' },
        { label: 'Session', link: `/sessions/${this.session}` },
        {
          label: 'UE',
          link: `/session-compo/${this.sessionCompoId}/events?ue=${this.ue}&session=${this.session}`
        },
        {
          label: 'Épreuve',
          link: `/event/${this.eventId}/rooms?ue=${this.ue}&session=${this.session}&sessionCompoId=${this.sessionCompoId}`
        }
      ]
    },


    availableRooms() {
      return this.allRooms.filter(
        room => !this.usedRooms.some(used => used.room === room.label)
      )
    }
  },

  methods: {
    async addRoom() {
      if (
        !this.selectedRoom ||
        this.isLoading ||
        this.usedRooms.some(r => r.room === this.selectedRoom)
      ) return

      this.isLoading = true
      try {
        await assignRoomToEvent(this.eventId, this.selectedRoom)

        this.usedRooms = await fetchUsedRooms(this.eventId)
        await this.loadRoomStats()

        this.selectedRoom = ''
      } catch (error) {
        console.error('Erreur lors de l\'ajout du local :', error)
      } finally {
        this.isLoading = false
      }
    },

    async loadRoomStats() {
      for (const room of this.usedRooms) {
        try {
          const { data: roomInfo } = await supabase
            .from('room')
            .select('capacity')
            .eq('label', String(room.room))
            .single()

          const { data: examRoom } = await supabase
            .from('examination_room')
            .select('id')
            .eq('event', this.eventId)
            .eq('room', room.room)
            .single()

          const { count } = await supabase
            .from('examination')
            .select('*', { count: 'exact', head: true })
            .eq('examination_room', examRoom.id)

          this.roomStats[room.room] = {
            capacity: roomInfo?.capacity ?? '?',
            present: count ?? 0
          }
        } catch (error) {
          console.error(`Erreur chargement stats pour ${room.room}:`, error)
        }
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
          session: this.session,
          label: this.eventLabel,
          sessionCompoId: this.sessionCompoId
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
      await this.loadRoomStats()
    } catch (error) {
      console.error('Erreur lors du chargement des données :', error)
    }
  }

}
</script>
