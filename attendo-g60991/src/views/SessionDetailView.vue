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

<script>
import Breadcrumb from '@/components/Breadcrumb.vue'
import {
  fetchSessionLabel,
  fetchSessionCompos,
  fetchAllUEs,
  addUEToSession
} from '@/services/SessionDetailView'

export default {
  components: {
    Breadcrumb
  },
  
  data() {
    return {
      sessionLabel: '',
      sessionCompos: [],
      allUEs: [],
      selectedUE: ''
    }
  },
  
  computed: {
    availableUEs() {
      return this.allUEs.filter(ue => !this.sessionCompos.some(c => c.ue === ue.ue))
    }
  },
  
  methods: {
    goToEvent(compo) {
      this.$router.push({
        name: 'eventList', 
        params: { id: compo.id },
        query: {
          ue: compo.ue,
          session: this.sessionLabel
        }
      })
    },
    
    async loadSessionDetail() {
      try {
        const sessionId = this.$route.params.id
        
        const resultLabel = await fetchSessionLabel(sessionId)
        this.sessionLabel = resultLabel
        
        const resultCompos = await fetchSessionCompos(sessionId)
        this.sessionCompos = resultCompos
        
        const resultUEs = await fetchAllUEs()
        this.allUEs = resultUEs
      } catch (error) {
        console.error('Erreur lors du chargement de la session :', error)
      }
    },
    
    async addUE() {
      if (!this.selectedUE) return
      
      try {
        const sessionId = this.$route.params.id
        const result = await addUEToSession(sessionId, this.selectedUE)
        this.sessionCompos.push(result)
        this.selectedUE = ''
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'UE :', error)
      }
    }
  },
  
  // Hook de cycle de vie
  mounted() {
    this.loadSessionDetail()
  }
}
</script>