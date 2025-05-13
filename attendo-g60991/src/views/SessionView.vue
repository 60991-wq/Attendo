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

<script>
import { fetchSessions, createSession } from '@/services/listSessionsService'
import Breadcrumb from '@/components/Breadcrumb.vue'
import Table from '@/components/Table.vue'

export default {
  components: {
    Breadcrumb,
    Table
  },
  
  data() {
    return {
      sessions: [],
      newSession: { label: '' }
    }
  },
  
  methods: {
    // Redirection vers le détail d'une session
    goToSession(session) {
      this.$router.push(`/sessions/${session.id}`)
    },
    
    // Chargement des sessions au démarrage
    async loadSessions() {
      try {
        const result = await fetchSessions()
        this.sessions = result
      } catch (error) {
        console.error('Erreur de chargement des sessions:', error)
      }
    },
    
    // Ajout d'une nouvelle session
    async addSession() {
      const label = this.newSession.label.trim()
      if (!label) return
      
      try {
        const result = await createSession({ label })
        this.sessions.push(result)
        this.newSession.label = ''
      } catch (error) {
        console.error('Erreur lors de l\'ajout :', error)
      }
    }
  },
  
  // Hook de cycle de vie
  mounted() {
    this.loadSessions()
  }
}
</script>