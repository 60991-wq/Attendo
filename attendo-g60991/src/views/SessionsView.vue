<template>
  <div class="p-6 space-y-8">
    <h1 class="text-2xl font-bold">Créer une session</h1>

    <form @submit.prevent="handleCreate" class="space-y-4 max-w-md">
      <input v-model="nom" type="text" placeholder="Nom de la session" class="w-full p-2 border rounded" required />
      <input v-model="annee" type="number" placeholder="Année" class="w-full p-2 border rounded" required />
      <input v-model="dateDebut" type="date" class="w-full p-2 border rounded" required />
      <input v-model="dateFin" type="date" class="w-full p-2 border rounded" required />
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">➕ Ajouter</button>
    </form>

    <div v-if="sessions.length" class="mt-8">
      <h2 class="text-xl font-semibold">Sessions existantes</h2>
      <ul class="list-disc pl-6">
        <li v-for="s in sessions" :key="s.id">
          {{ s.label }} – {{ s.annee }} (du {{ s.date_debut }} au {{ s.date_fin }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { fetchSessions, createSession } from '@/services/listSessionsService'

export default {
  data() {
    return {
      sessions: [],
      nom: '',
      annee: '',
      dateDebut: '',
      dateFin: ''
    }
  },
  async created() {
    this.sessions = await fetchSessions()
  },
  methods: {
    async handleCreate() {
      await createSession({
        label: this.nom,
        annee: Number(this.annee),
        date_debut: this.dateDebut,
        date_fin: this.dateFin
      })
      this.nom = this.annee = this.dateDebut = this.dateFin = ''
      this.sessions = await fetchSessions()
    }
  }
}
</script>
