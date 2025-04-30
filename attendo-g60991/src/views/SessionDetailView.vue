<template>
    <div class="p-6 space-y-6">
      <Breadcrumb :items="[
        { label: 'Accueil', link: '/' },
        { label: 'Sessions', link: '/sessions' },
        { label: `Session ${session?.label}` }
      ]" />
  
      <h1 class="text-2xl">
        Session <span class="italic text-blue-700">{{ session?.label }}</span>
      </h1>
  
      <!-- Liste des UE -->
      <table class="w-full table-auto border">
  <thead>
    <tr class="bg-gray-900 text-white">
      <th class="text-left px-4 py-2 text-lg">UE</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="ue in sessionUes" :key="ue.ue" class="border-b">
      <td class="px-4 py-2 text-blue-600 text-base">{{ ue.ue }}</td>
    </tr>
  </tbody>
</table>

      <!-- Formulaire ajout UE -->
      <div class="mt-4">
        <p class="font-semibold mb-2">Ajouter une UE dans la session</p>
        <div class="flex items-center space-x-2">
          <button class="px-4 py-2 border">Ajouter</button>
          
          <select v-model="selectedUeId" class="border p-2 rounded">
            <option disabled value="">Choisissez d'une ue</option>
            <option v-for="ue in availableUes" :key="ue.ue" :value="ue.ue">
         {{ ue.ue }}
      </option>

<tr v-for="ue in sessionUes" :key="ue.ue">
  <td class="p-2 text-blue-600">{{ ue.ue }}</td>
</tr>
          </select>
          <button
            @click="handleAddUe"
            class="border px-4 py-2 rounded hover:bg-gray-100"
          >
            Ajouter l'UE
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Breadcrumb from '@/components/Breadcrumb.vue'
  import { fetchSessions } from '@/services/listSessionsService'
  import {
    fetchSessionUes,
    fetchAvailableUes,
    addUeToSession
  } from '@/services/sessionDetailsService'
  
  export default {
    components: { Breadcrumb },
    data() {
      return {
        session: null,
        sessionUes: [],
        availableUes: [],
        selectedUeId: ''
      }
    },
    async created() {
      const sessionId = this.$route.params.id
      const allSessions = await fetchSessions()
      this.session = allSessions.find(s => s.id == sessionId)
      await this.loadDetails()
    },
    methods: {
      async loadDetails() {
        this.sessionUes = await fetchSessionUes(this.session.id)
        this.availableUes = await fetchAvailableUes(this.session.id)
        console.log('📦 UE disponibles :', this.availableUes)
      },
      async handleAddUe() {
        if (!this.selectedUeId) return
        await addUeToSession(this.session.id, this.selectedUeId)
        await this.loadDetails()
        this.selectedUeId = ''
      }
    }
  }
  </script>
  