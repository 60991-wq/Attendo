<template>
  <div class="w-full px-6 mt-6">
    <!-- Fil d'Ariane -->
    <Breadcrumb :items="[
      { label: 'Accueil', link: '/' },
      { label: 'Sessions' }
    ]" />

    <h2 class="text-xl font-bold mb-4 text-blue-800">Sessions</h2>

    <!-- Table des sessions - utilisez simplement le composant sans modifier ses styles -->
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
        class="bg-white text-black border border-black rounded px-4 py-1 hover:bg-gray-100"
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
    goToSession(session) {
      this.$router.push(`/sessions/${session.id}`)
    },
    
    async loadSessions() {
      try {
        const result = await fetchSessions()
        this.sessions = result
      } catch (error) {
        console.error('Erreur de chargement des sessions:', error)
      }
    },
    
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
  
  mounted() {
    this.loadSessions()
  }
}
</script>