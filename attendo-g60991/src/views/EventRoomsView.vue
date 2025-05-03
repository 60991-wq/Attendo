<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { fetchAllRooms } from '@/services/roomService'
import { fetchUsedRooms, assignRoomToEvent } from '@/services/eventRomService'

const route = useRoute()
const router = useRouter()

const eventId = route.params.id
const eventLabel = route.query.label
const session = route.query.session
const ue = route.query.ue

const allRooms = ref([])
const usedRooms = ref([])
const selectedRoom = ref('')
const isLoading = ref(false)

const availableRooms = computed(() =>
  allRooms.value.filter(room => !usedRooms.value.includes(room.label))
)

onMounted(async () => {
  allRooms.value = await fetchAllRooms()
  usedRooms.value = await fetchUsedRooms(eventId)
})

const addRoom = async () => {
  if (
    !selectedRoom.value ||
    isLoading.value ||
    usedRooms.value.includes(selectedRoom.value)
  ) return

  isLoading.value = true
  try {
    await assignRoomToEvent(eventId, selectedRoom.value)
    usedRooms.value.push(selectedRoom.value)
    selectedRoom.value = ''
  } catch (e) {
    console.error('Erreur lors de l’ajout du local :', e)
  } finally {
    isLoading.value = false
  }
}
const goToPresence = (roomLabel) => {
  router.push({
    name: 'PresenceView',
    params: {
      eventId,
      roomId: roomLabel
    },
    query: {
      room: roomLabel,
      ue,
      session
    }
  })
}

</script>

<template>
  <div class="p-6">
    <Breadcrumb :items="[
      { label: 'Accueil', link: '/' },
      { label: 'Sessions', link: '/sessions' },
      { label: 'Session', link: `/sessions/${session}` },
      { label: 'UE' },
      { label: 'Épreuve' }
    ]" />

    <h2 class="text-xl font-bold mb-6">
      Liste des locaux pour <span class="text-fuchsia-600">{{ eventLabel }}</span>
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
        class="bg-fuchsia-600 text-white px-4 py-1 rounded hover:bg-fuchsia-700 disabled:opacity-50"
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
