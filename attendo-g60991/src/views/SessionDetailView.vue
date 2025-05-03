<template>
    <div class="w-full px-6 mt-6">
      <!-- Breadcrumb -->
      <Breadcrumb :items="[
        { label: 'Accueil', link: '/' },
        { label: 'Sessions', link: '/sessions' },
        { label: 'Session' }
      ]" />
  
      <h2 class="text-xl font-bold mb-4">
        Session <span class="italic text-fuchsia-600">{{ sessionLabel }}</span>
      </h2>
  
      <!-- Table des UEs associées -->
      <div class="bg-white shadow rounded overflow-hidden mb-8">
        <table class="w-full text-left">
          <thead class="bg-gray-200 text-gray-700 text-sm uppercase">
            <tr>
              <th class="p-3">UE</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="compo in sessionCompos"
              :key="compo.id"
              class="border-t hover:bg-gray-50 cursor-pointer"
              @click="goToEvent(compo)"
            >
              <td class="p-3 text-fuchsia-600 hover:underline">{{ compo.ue }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Formulaire ajout UE -->
      <form @submit.prevent="addUE" class="bg-white shadow rounded p-4 flex items-center space-x-4 max-w-xl">
        <select v-model="selectedUE" class="border px-3 py-1 rounded w-full">
          <option value="" disabled>Choisissez d'une ue</option>
          <option v-for="ue in availableUEs" :key="ue.ue" :value="ue.ue">{{ ue.ue }}</option>
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
  import { useRoute, useRouter } from 'vue-router'
  import Breadcrumb from '@/components/Breadcrumb.vue'
  
  import {
    fetchSessionLabel,
    fetchSessionCompos,
    fetchAllUEs,
    addUEToSession
  } from '@/services/SessionDetailView'
  
  const route = useRoute()
  const router = useRouter()
  const sessionId = route.params.id
  
  const sessionLabel = ref('')
  const sessionCompos = ref([])
  const allUEs = ref([])
  const selectedUE = ref('')
  
  // 🔁 UE encore disponibles
  const availableUEs = computed(() =>
    allUEs.value.filter(ue => !sessionCompos.value.some(c => c.ue === ue.ue))
  )
  
  // ✅ Redirection vers les épreuves d’une UE
  const goToEvent = (compo) => {
    router.push({
      name: 'EventList',
      params: { id: compo.id }, 
      query: {
        ue: compo.ue,
        session: sessionLabel.value
      }
    })
  }
  
  // ✅ Chargement initial
  const loadSessionDetail = async () => {
    try {
      sessionLabel.value = await fetchSessionLabel(sessionId)
      sessionCompos.value = await fetchSessionCompos(sessionId)
      allUEs.value = await fetchAllUEs()
    } catch (e) {
      console.error('Erreur lors du chargement de la session :', e)
    }
  }
  
  // ✅ Ajout d’une UE
  const addUE = async () => {
    if (!selectedUE.value) return
    try {
      const inserted = await addUEToSession(sessionId, selectedUE.value)
      sessionCompos.value.push(inserted) // on garde l’ID pour redirection
      selectedUE.value = ''
    } catch (e) {
      console.error('Erreur lors de l’ajout de l’UE :', e)
    }
  }
  
  onMounted(() => {
    loadSessionDetail()
  })
  </script>
  