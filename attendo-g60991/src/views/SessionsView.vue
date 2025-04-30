<template>
  <div class="p-6 space-y-8">
    <Breadcrumb :items="[
      { label: 'Accueil', link: '/' },
      { label: 'sessions', link: '/sessions' },
      { label: 'session' }
    ]" />

    <h1 class="text-2xl font-bold">Sessions</h1>

    <!-- 🗂 Tableau des sessions -->
    <table class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-900 text-white">
          <th class="text-left p-2">SESSIONS</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="session in sessions"
          :key="session.id"
          class="border-b hover:bg-gray-50"
        >
          <td class="p-2">
            <router-link :to="`/sessions/${session.id}`" class="text-blue-600 hover:underline">
              {{ session.label }}
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- ➕ Formulaire d’ajout -->
    <form @submit.prevent="handleCreate" class="flex items-center space-x-2 mt-4">
      <div class="flex items-center border rounded bg-gray-100 px-2 py-1 w-full max-w-sm">
        <span class="text-purple-600">👥</span>
        <input
          v-model="label"
          type="text"
          placeholder="Nouvelle session"
          class="bg-transparent ml-2 w-full outline-none"
          required
        />
      </div>
      <button
        type="submit"
        class="bg-white border px-4 py-2 rounded hover:bg-gray-100 text-sm"
      >
        Ajouter
      </button>
    </form>
  </div>
</template>

<script>
import { fetchSessions, createSession } from '@/services/listSessionsService'
import Breadcrumb from '@/components/Breadcrumb.vue'

export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      sessions: [],
      label: ''
    }
  },
  async created() {
    await this.loadSessions()
  },
  methods: {
    async loadSessions() {
      this.sessions = await fetchSessions()
    },
    async handleCreate() {
      await createSession({ label: this.label })
      this.label = ''
      await this.loadSessions()
    }
  }
}
</script>
