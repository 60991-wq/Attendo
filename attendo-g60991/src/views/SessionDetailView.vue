<template>
    <div class="w-full px-6 mt-6">
      <!-- Fil d'Ariane -->
      <Breadcrumb :items="[
        { label: 'Accueil', link: '/' },
        { label: 'Sessions', link: '/sessions' },
        { label: 'Session' }
      ]" />
  
      <h2 class="text-xl font-bold mb-4">
        Session <span class="italic text-fuchsia-600">{{ sessionLabel }}</span>
      </h2>
  
      <!-- Table des UEs associées -->
      <Table
        :headers="['UE']"
        :rows="sessionCompos"
        :columns="['ue']"
        class="mb-8"
      />
  
      <!-- Formulaire d'ajout d'UE -->
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
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import Breadcrumb from '@/components/Breadcrumb.vue'
  import Table from '@/components/Table.vue'
  
  import {
    fetchSessionLabel,
    fetchSessionCompos,
    fetchAllUEs,
    addUEToSession
  } from '@/services/SessionDetailView'
  
  const route = useRoute()
  const sessionId = route.params.id
  
  const sessionLabel = ref('')
  const sessionCompos = ref([])
  const allUEs = ref([])
  const selectedUE = ref('')
  
  // UE disponibles = toutes sauf celles déjà liées à la session
  const availableUEs = computed(() =>
    allUEs.value.filter(
      ue => !sessionCompos.value.some(c => c.ue === ue.ue)
    )
  )
  
  // Charger tous les détails depuis le service
  const loadSessionDetail = async () => {
    try {
      sessionLabel.value = await fetchSessionLabel(sessionId)
      sessionCompos.value = await fetchSessionCompos(sessionId)
      allUEs.value = await fetchAllUEs()
    } catch (e) {
      console.error('Erreur lors du chargement de la session :', e)
    }
  }
  
  // Ajouter une UE à la session
  const addUE = async () => {
    if (!selectedUE.value) return
    try {
      await addUEToSession(sessionId, selectedUE.value)
      sessionCompos.value.push({ ue: selectedUE.value })
      selectedUE.value = ''
    } catch (e) {
      console.error('Erreur lors de l’ajout de l’UE :', e)
    }
  }
  
  onMounted(() => {
    loadSessionDetail()
  })
  </script>
  