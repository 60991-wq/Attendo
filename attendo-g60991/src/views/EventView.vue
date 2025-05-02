<template>
  <div class="p-4 space-y-4">
    <Breadcrumb :items="breadcrumbItems" />

    <div v-if="loading" class="flex justify-center my-6">
      <div class="animate-spin h-10 w-10 border-2 border-fuchsia-600 rounded-full"></div>
    </div>

    <template v-else-if="event">
      <h1 class="text-xl font-bold">
        <span class="text-fuchsia-600">{{ event.label }}</span> - {{ ueId }}
      </h1>
      
      <!-- Message informant que les fonctionnalités des locaux viendront plus tard -->
      <div class="bg-blue-50 p-3 rounded border border-blue-200 text-blue-800">
        La gestion des locaux sera implémentée dans une version future.
      </div>
    </template>
    
    <div v-else-if="error" class="bg-red-50 border rounded p-3 text-red-700">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumb from '@/components/layout/Breadcrumb.vue';
import { supabase } from '@/supabase';

const route = useRoute();
const { sessionId, ueId, eventId } = route.params;
const sessionLabel = ref('');
const event = ref(null);
const loading = ref(true);
const error = ref(null);

const breadcrumbItems = computed(() => [
  { label: 'Accueil', link: '/' },
  { label: 'Sessions', link: '/sessions' },
  { label: sessionLabel.value, link: `/sessions/${sessionId}` },
  { label: ueId, link: `/sessions/${sessionId}/ue/${ueId}` },
  { label: event.value?.label || 'Épreuve' }
]);

const loadData = async () => {
  loading.value = true;
  try {
    // Charger session
    const { data: sessionData } = await supabase
      .from('session').select('label').eq('id', sessionId).single();
    sessionLabel.value = sessionData.label;
    
    // Charger épreuve
    const { data: eventData } = await supabase
      .from('event').select('*').eq('id', eventId).single();
    event.value = eventData;
  } catch (err) {
    error.value = "Impossible de charger les données";
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);
</script>