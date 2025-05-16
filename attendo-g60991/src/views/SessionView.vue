<template>
  <div class="w-full px-6 mt-0">

<Breadcrumb :items="[
      { label: 'Accueil', link: '/' },
      { label: 'Sessions' }
    ]" />

    <h2 class="text-xl font-bold mb-4 mt-4 text-blue-800">Sessions</h2>
    <DataTable
      :headers="['Sessions']"
      :rows="sessions"
      :columns="['label']"
      @row-click="goToSession"
      class="mb-8"
    />

    <AddForm
      v-model="newSession.label"
      icon="👥"
      placeholder="Nouvelle session"
      submitLabel="Ajouter"
      @submit="addSession"
    />
  </div>
</template>

<script>
import { fetchSessions, createSession } from '@/services/listSessionsService'
import Breadcrumb from '@/components/Breadcrumb.vue'
import DataTable from '@/components/DataTable.vue'
import AddForm from '@/components/AddForm.vue'

export default {
  components: {
    Breadcrumb,
    DataTable,
    AddForm
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

        this.sessions = [...this.sessions, result]


        this.newSession.label = ''

        console.log('Session ajoutée avec succès:', result)
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
