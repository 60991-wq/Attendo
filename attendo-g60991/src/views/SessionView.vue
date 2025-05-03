<template>
    <div class="w-full px-6 mt-6">
      <!-- Fil d'Ariane -->
      <Breadcrumb :items="[
        { label: 'Accueil', link: '/' },
        { label: 'Sessions' }
      ]" />
  
      <h2 class="text-xl font-bold mb-4">Sessions</h2>
  
      <!-- Table des sessions -->
      <Table
        :headers="['Sessions']"
        :rows="sessions"
        :columns="['label']"
        @row-click="goToSession"
        class="mb-8"
      />
  
      <!-- Formulaire d'ajout -->
      <form @submit.prevent="addSession" class="bg-white shadow rounded p-4 flex items-center space-x-4 w-full max-w-xl">
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
  import { useRouter } from 'vue-router'
  import { fetchSessions, createSession } from '@/services/listSessionsService'
  import Breadcrumb from '@/components/Breadcrumb.vue'
  import Table from '@/components/Table.vue'
  
  const router = useRouter()
  const sessions = ref([])
  const newSession = ref({ label: '' })
  
  // Redirection vers le détail d'une session
  const goToSession = (session) => {
    router.push(`/sessions/${session.id}`)
  }
  
  // Chargement des sessions au démarrage
  const loadSessions = async () => {
    try {
      sessions.value = await fetchSessions()
    } catch (e) {
      console.error('Erreur de chargement des sessions:', e)
    }
  }
  
  // Ajout d'une nouvelle session
  const addSession = async () => {
    const label = newSession.value.label.trim()
    if (!label) return
    try {
      const created = await createSession({ label })
      sessions.value.push(created)
      newSession.value.label = ''
    } catch (e) {
      console.error('Erreur lors de l’ajout :', e)
    }
  }
  
  onMounted(() => {
    loadSessions()
  })
  </script>
  