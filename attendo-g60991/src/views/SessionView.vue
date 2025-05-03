<template>
    <div>
      <!-- Fil d'Ariane -->
      <Breadcrumb :items="[
        { label: 'Accueil', link: '/' },
        { label: 'Sessions' }
      ]" />
  
      <h2 class="text-xl font-bold mb-4">Sessions</h2>
  
      <!-- Table des sessions -->
      <div class="bg-white shadow rounded overflow-hidden w-full md:w-1/2 mb-8">
        <table class="w-full text-left">
          <thead class="bg-gray-200 text-gray-700 text-sm uppercase">
            <tr>
              <th class="p-3">Sessions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="session in sessions"
              :key="session.id"
              class="border-t hover:bg-gray-50 cursor-pointer"
              @click="$router.push(`/sessions/${session.id}`)"
            >
              <td class="p-3 text-fuchsia-600 hover:underline">{{ session.label }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Ajout d'une session -->
      <form @submit.prevent="addSession" class="bg-white shadow rounded p-4 w-full md:w-1/2 flex items-center space-x-4">
        <div class="flex items-center space-x-2 flex-grow">
          <span class="text-xl">👥</span>
          <input
            v-model="newSession.label"
            type="text"
            placeholder="Nouvelle session"
            class="border rounded px-3 py-1 w-full"
          />
        </div>
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
  import { ref, onMounted } from 'vue'
  import { fetchSessions, createSession } from '@/services/listSessionsService'
  import Breadcrumb from '@/components/Breadcrumb.vue'
  
  const sessions = ref([])
  const newSession = ref({ label: '' })
  
  const loadSessions = async () => {
    try {
      sessions.value = await fetchSessions()
    } catch (e) {
      console.error('Erreur de chargement des sessions:', e)
    }
  }
  
  const addSession = async () => {
    if (!newSession.value.label.trim()) return
    try {
      await createSession(newSession.value)
      newSession.value.label = ''
      await loadSessions()
    } catch (e) {
      console.error('Erreur lors de l’ajout :', e)
    }
  }
  
  onMounted(() => {
    loadSessions()
  })
  </script>
  