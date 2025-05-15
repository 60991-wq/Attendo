<template>
  <div class="w-full px-4 mt-0">

    <Breadcrumb :items="breadcrumbItems" />

    <h2 class="text-xl font-bold mb-3 mt-3">
      <span class="text-blue-800">Session</span> <span class="italic text-blue-900">{{ sessionLabel }}</span>
    </h2>

    <div v-if="sessionCompos.length === 0" class="text-gray-600 italic mb-4">
      Aucune UE n’a encore été ajoutée à cette session.
    </div>

    <Table
      :headers="['UE']"
      :rows="sessionCompos"
      :columns="['ue']"
      textColor=""
      :enableUnderline="false"
      @row-click="goToEvent"
      class="mb-8"
    />

    <AddForm
      v-model="selectedUE"
      submitLabel="Ajouter"
      icon="📚"
      @submit="addUE"
    >
      <select v-model="selectedUE" class="border px-3 py-1 rounded w-full">
        <option value="" disabled>Choisissez une UE</option>
        <option v-for="ue in availableUEs" :key="ue.ue" :value="ue.ue">{{ ue.ue }}</option>
      </select>
    </AddForm>
  </div>
</template>

<script>
import AddForm from '@/components/AddForm.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import Table from '@/components/Table.vue'
import {
  fetchSessionLabel,
  fetchSessionCompos,
  fetchAllUEs,
  addUEToSession
} from '@/services/SessionDetailView'

export default {
  components: {
    Breadcrumb,
    Table,
    AddForm
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
    sessionId() {
      return parseInt(this.$route.params.id)
    },
    availableUEs() {
      return this.allUEs.filter(ue => !this.sessionCompos.some(c => c.ue === ue.ue))
    },
    breadcrumbItems() {
      return [
        { label: 'Accueil', link: '/' },
        { label: 'Sessions', link: '/sessions' },
        { label: 'Session', link: `/sessions/${this.sessionId}` }
      ]
    }
  },

  methods: {
    goToEvent(compo) {
      this.$router.push({
        name: 'eventList',
        params: { id: compo.id },
        query: {
          ue: compo.ue,
          session: this.sessionId 
        }
      })
    },

    async loadSessionDetail() {
  const id = this.sessionId
  if (!id) {
    console.warn('ID de session invalide, redirection...')
    this.$router.push('/sessions')
    return
  }

  try {
    const resultLabel = await fetchSessionLabel(id)
    this.sessionLabel = resultLabel

    const resultCompos = await fetchSessionCompos(id)
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
        const result = await addUEToSession(this.sessionId, this.selectedUE)
        this.sessionCompos = [...this.sessionCompos, result]
        this.selectedUE = ''
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'UE :', error)
      }
    }
  },

  mounted() {
    this.loadSessionDetail()
  }
}
</script>
