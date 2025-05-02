<template>
  <div class="p-4 space-y-4">
    <Breadcrumb :items="breadcrumbItems" />
    <div v-if="error" class="bg-red-100 border-l-4 border-red-500 p-3 text-red-700">{{ error }}</div>
    
    <h1 class="text-xl font-bold">
      <span class="text-blue-600">{{ ueId }}</span>
      <span class="text-gray-500">({{ sessionLabel }})</span>
    </h1>

    <div v-if="loading" class="flex justify-center">
      <div class="animate-spin h-10 w-10 border-b-2 border-blue-700 rounded-full"></div>
    </div>

    <template v-else>
      <BaseTable
        :headers="['Épreuves', 'Statut']"
        :items="events"
        :fields="['label', 'completed']"
        @row-click="navigateToEvent"
      >
        <template #cell(completed)="{ value }">
          <span :class="value ? 'text-green-600' : 'text-yellow-600'">
            {{ value ? 'Complété' : 'En cours' }}
          </span>
        </template>
      </BaseTable>

      <div class="mt-4 pt-3 border-t">
        <h2 class="text-lg mb-2">Nouvelle épreuve</h2>
        <div class="flex gap-2">
          <BaseInput v-model="newEventLabel" placeholder="Intitulé" :disabled="formLoading"/>
          <BaseButton @click="handleAddEvent" variant="light" :loading="formLoading"
                    :disabled="!newEventLabel.trim()">Créer</BaseButton>
        </div>
        <div v-if="errorMessage" class="mt-2 text-red-600 text-sm">{{ errorMessage }}</div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '@/supabase';
import Breadcrumb from '@/components/layout/Breadcrumb.vue';
import BaseTable from '@/components/ui/BaseTable.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseInput from '@/components/ui/BaseInput.vue';

const route = useRoute();
const router = useRouter();
const { sessionId, ueId } = route.params;
const sessionLabel = ref('');
const events = ref([]);
const newEventLabel = ref('');
const loading = ref(true);
const formLoading = ref(false);
const errorMessage = ref('');
const error = ref('');
const compoId = ref(null);

const breadcrumbItems = computed(() => [
  { label: 'Accueil', link: '/' },
  { label: 'Sessions', link: '/sessions' },
  { label: sessionLabel.value, link: `/sessions/${sessionId}` },
  { label: ueId }
]);

const getSessionCompo = async () => {
  const { data, error } = await supabase
    .from('session_compo').select('id')
    .eq('session', sessionId).eq('ue', ueId).single();
    
  if (error || !data) return null;
  return data;
};

const loadData = async () => {
  loading.value = true;
  try {
    const { data: session } = await supabase
      .from('session').select('label').eq('id', sessionId).single();
    sessionLabel.value = session.label;
    
    const compo = await getSessionCompo();
    if (!compo) {
      error.value = "Association UE-session introuvable";
      return;
    }
    
    compoId.value = compo.id;
    const { data } = await supabase
      .from('event').select('*')
      .eq('session_compo', compo.id).order('label');
    events.value = data || [];
  } catch {
    error.value = "Erreur de chargement";
  } finally {
    loading.value = false;
  }
};

const handleAddEvent = async () => {
  if (!newEventLabel.value.trim()) return;
  formLoading.value = true;
  errorMessage.value = '';
  
  try {
    const compo = compoId.value ? { id: compoId.value } : await getSessionCompo();
    if (!compo) {
      errorMessage.value = "Composition introuvable";
      return;
    }
    
    await supabase.from('event').insert([{ 
      label: newEventLabel.value, 
      completed: false, 
      session_compo: compo.id 
    }]);
    
    newEventLabel.value = '';
    const { data } = await supabase
      .from('event').select('*')
      .eq('session_compo', compo.id).order('label');
    events.value = data || [];
  } catch {
    errorMessage.value = "Impossible de créer l'épreuve";
  } finally {
    formLoading.value = false;
  }
};

const navigateToEvent = (event) => {
  router.push({
    name: 'event-detail',
    params: { sessionId, ueId, eventId: event.id }
  });
};

onMounted(loadData);
</script>