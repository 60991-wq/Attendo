<template>
  <div class="p-4 space-y-4">
    <Breadcrumb :items="breadcrumbItems" />
    
    <h1 class="text-xl font-bold">
      Session <span class="text-fuchsia-600">{{ session?.label }}</span>
    </h1>

    <div v-if="loading" class="flex justify-center">
      <div class="animate-spin h-10 w-10 border-b-2 border-fuchsia-600 rounded-full"></div>
    </div>

    <template v-else>
      <!-- Liste des UE -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="bg-gray-900 text-white px-4 py-3 font-medium">UE</div>
        <div>
          <div v-for="ue in sessionUes" :key="ue.ue" class="border-b px-4 py-3 hover:bg-gray-50">
            <router-link :to="`/sessions/${sessionId}/ue/${ue.ue}`" class="text-blue-600 hover:underline">
              {{ ue.ue }}
            </router-link>
          </div>
          <div v-if="sessionUes.length === 0" class="p-4 text-center text-gray-500">
            Aucune UE n'est associée à cette session
          </div>
        </div>
      </div>

      <!-- Formulaire ajout UE -->
      <div class="mt-4 pt-3 border-t">
        <h2 class="text-lg mb-2">Ajouter une UE dans la session</h2>
        <div class="flex gap-2">
          <select v-model="selectedUeId" class="border rounded px-3 py-2 flex-grow">
            <option disabled value="">Choisissez une UE</option>
            <option v-for="ue in availableUes" :key="ue.ue" :value="ue.ue">
              {{ ue.ue }}
            </option>
          </select>
          <button 
            @click="handleAddUe" 
            class="bg-fuchsia-600 text-white px-4 py-2 rounded"
            :disabled="!selectedUeId"
          >
            Ajouter l'UE
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Breadcrumb from '@/components/layout/Breadcrumb.vue';
import BaseTable from '@/components/ui/BaseTable.vue';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import {
  fetchSessionUes,
  fetchAvailableUes,
  addUeToSession,
  fetchSessionDetails
} from '@/services/sessionDetailsService';

const route = useRoute();
const router = useRouter();
const sessionId = route.params.id;

const session = ref(null);
const sessionUes = ref([]);
const availableUes = ref([]);
const selectedUeId = ref('');
const loading = ref(true);
const formLoading = ref(false);

const breadcrumbItems = computed(() => [
  { label: 'Accueil', link: '/' },
  { label: 'Sessions', link: '/sessions' },
  { label: session.value?.label || 'Détail de la session' }
]);

const loadDetails = async () => {
  loading.value = true;
  
  try {
    session.value = await fetchSessionDetails(sessionId);
    sessionUes.value = await fetchSessionUes(sessionId);
    availableUes.value = await fetchAvailableUes(sessionId);
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
  } finally {
    loading.value = false;
  }
};

const handleAddUe = async () => {
  if (!selectedUeId.value) return;
  
  formLoading.value = true;
  
  try {
    await addUeToSession(sessionId, selectedUeId.value);
    selectedUeId.value = '';
    await loadDetails();
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'UE:', error);
    alert('Impossible d\'ajouter l\'UE');
  } finally {
    formLoading.value = false;
  }
};

const navigateToUe = (ue) => {
  router.push(`/sessions/${sessionId}/ue/${ue.ue}`);
};

onMounted(loadDetails);
</script>