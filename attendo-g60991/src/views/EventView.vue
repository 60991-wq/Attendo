<template>
  <div class="w-full px-6 mt-6">
    <!-- Fil d’Ariane -->
    <Breadcrumb :items="[
      { label: 'Accueil', link: '/' },
      { label: 'Sessions', link: '/sessions' },
      { label: 'Session', link: `/sessions/${route.query.session}` },
      { label: 'UE' }
    ]" />

    <h2 class="text-xl font-bold mb-4">
      Liste des épreuves de
      <span class="text-fuchsia-600">{{ route.query.ue }}</span>
      <span class="text-sm italic">(session : {{ route.query.session }})</span>
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
        class="bg-fuchsia-600 text-white px-4 py-1 rounded hover:bg-fuchsia-700"
      >
        Créer
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { fetchEvents, createEvent } from '@/services/eventService'

const route = useRoute()
const router = useRouter()
const sessionCompoId = route.params.id

const events = ref([])
const newEventLabel = ref('')

// ✅ Corrigé ici : 'EventRooms' au lieu de 'RoomList'
const goToRooms = (event) => {
  router.push({
    name: 'EventRooms',
    params: { id: event.id },
    query: {
      label: event.label,
      ue: route.query.ue,
      session: route.query.session
    }
  })
}

const loadEvents = async () => {
  try {
    events.value = await fetchEvents(sessionCompoId)
  } catch (e) {
    console.error('Erreur chargement events :', e)
  }
}

const addEvent = async () => {
  if (!newEventLabel.value.trim()) return
  try {
    const created = await createEvent(sessionCompoId, newEventLabel.value)
    events.value.push(created)
    newEventLabel.value = ''
  } catch (e) {
    console.error('Erreur création épreuve :', e)
  }
}

onMounted(loadEvents)
</script>
