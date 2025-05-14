<template>
  <div class="w-full px-6 mt-6">
    <!-- Breadcrumb -->
    <Breadcrumb :items="[
      { label: 'Accueil', link: '/' },
      { label: 'Sessions', link: '/sessions' },
      { label: 'Session' }
    ]" />

    <h2 class="text-xl font-bold mb-4">
      <span class="text-blue-800">Session</span> <span class="italic text-blue-900">{{ sessionLabel }}</span>
    </h2>

    <!-- Table des UEs associées -->
    <Table
      :headers="['UE']"
      :rows="sessionCompos"
      :columns="['ue']"
      textColor=""
      :enableUnderline="false"
      @row-click="goToEvent"
      class="mb-8"
    />

    <!-- Formulaire ajout UE -->
    <form @submit.prevent="addUE" class="bg-white shadow rounded p-4 flex items-center space-x-4 max-w-xl">
      <select v-model="selectedUE" class="border px-3 py-1 rounded w-full">
        <option value="" disabled>Choisissez d'une ue</option>
        <option v-for="ue in availableUEs" :key="ue.ue" :value="ue.ue">{{ ue.ue }}</option>
      </select>

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
import Breadcrumb from '@/components/Breadcrumb.vue'
import Table from '@/components/Table.vue'  // Ajout de l'import manquant
import {
  fetchSessionLabel,
  fetchSessionCompos,
  fetchAllUEs,
  addUEToSession
} from '@/services/SessionDetailView'

export default {
  components: {
    Breadcrumb,
    Table  // Ajout du composant
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
        
        // Pour déboguer, affichons ce que retourne la fonction
        console.log("Résultat de l'ajout:", result)
        
        // Force la réactivité en créant un nouveau tableau
        this.sessionCompos = [...this.sessionCompos, result]
        
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