<template>
  <div class="p-6">
    <Breadcrumb :items="breadcrumb" />
    <h2 class="text-xl font-bold mb-4">
      Liste des locaux pour <span class="text-fuchsia-600">{{ route.query.label }}</span>
    </h2>

    <!-- 📦 Salles déjà attribuées -->
    <div class="flex flex-wrap gap-4 mb-6">
      <RoomCard
        v-for="room in assignedRooms"
        :key="room.id"
        :label="room.room"
        :capacity="getCapacity(room.room)"
        :supervisor="room.supervisor"
        :presentCount="room.presentCount"
        :eventId="eventId"
      />
    </div>

    <!-- ➕ Ajout -->
    <form @submit.prevent="addRoom" class="flex items-center gap-3 mb-6">
      <label class="text-sm">Local</label>
      <select v-model="selectedRoom" class="border px-3 py-1 rounded">
        <option value="">Choisissez un local</option>
        <option v-for="room in availableRooms" :key="room.label" :value="room.label">
          {{ room.label }}
        </option>
      </select>
      <button
        type="submit"
        class="bg-fuchsia-600 text-white px-4 py-1 rounded hover:bg-fuchsia-700"
      >
        Ajouter
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabase'
import Breadcrumb from '@/components/Breadcrumb.vue'
import RoomCard from '@/components/RoomCard.vue'
import { fetchAllRooms } from '@/services/roomService'
import { fetchAssignedRooms, assignRoomToEvent } from '@/services/eventRomService'

const route = useRoute()
const eventId = route.params.id

const allRooms = ref([])
const assignedRooms = ref([])
const selectedRoom = ref('')

// 🧭 Fil d’ariane dynamique
const breadcrumb = [
  { label: 'Accueil', link: '/' },
  { label: 'Sessions', link: '/sessions' },
  { label: 'Session', link: `/sessions/${route.query.session}` },
  { label: 'UE', link: `/session-compo/${route.query.ue}` },
  { label: 'Épreuve' }
]

// 📦 Locaux restants à affecter
const availableRooms = computed(() =>
  allRooms.value.filter(room => !assignedRooms.value.some(a => a.room === room.label))
)

const getCapacity = (label) => {
  const found = allRooms.value.find(r => r.label === label)
  return found ? found.capacity : '?'
}

// 📤 Ajout
const addRoom = async () => {
  if (!selectedRoom.value) return
  await assignRoomToEvent(eventId, selectedRoom.value)
  await loadAssignedRooms() // recharge après ajout
  selectedRoom.value = ''
}

// 📥 Chargement
const loadAssignedRooms = async () => {
  const rooms = await fetchAssignedRooms(eventId)

  for (const room of rooms) {
    const { data: examRoom, error } = await supabase
      .from('examination_room')
      .select('id')
      .eq('event', eventId)
      .eq('room', room.room)
      .single()

    if (!error && examRoom) {
      const { count, error: countErr } = await supabase
        .from('examination')
        .select('*', { count: 'exact', head: true })
        .eq('examination_room', examRoom.id)

      room.presentCount = count || 0
    } else {
      room.presentCount = 0
    }
  }

  assignedRooms.value = rooms
}

onMounted(async () => {
  allRooms.value = await fetchAllRooms()
  await loadAssignedRooms()
})
</script>
