<template>
  <div class="p-4 space-y-4">
    <Breadcrumb :items="breadcrumbItems" />
    
    <h1 class="text-lg font-bold">
      <span class="text-blue-700">{{ ueId }}</span> ({{ sessionLabel }})
    </h1>
    
    <div v-if="loading" class="flex justify-center">
      <div class="animate-spin h-10 w-10 border-b-2 border-blue-700 rounded-full"></div>
    </div>
    
    <template v-else>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div v-for="event in events" :key="event.id"
             class="border rounded p-3 hover:bg-gray-50 cursor-pointer bg-white"
             @click="navigateToEvent(event)">
          <h3>{{ event.label }}</h3>
          <p :class="event.completed ? 'text-green-600' : 'text-yellow-600'" class="text-sm mt-1">
            {{ event.completed ? 'Complété' : 'En cours' }}
          </p>
        </div>
        
        <div v-if="!events.length" class="col-span-full p-3 text-center text-gray-500 bg-white rounded">
          Aucune épreuve disponible
        </div>
      </div>
      
      <div class="mt-4 pt-3 border-t">
        <h2 class="text-lg mb-2">Ajouter une épreuve</h2>
        <div class="flex gap-2">
          <input
            v-model="newEventLabel"
            type="text"
            placeholder="Intitulé"
            class="border p-2 rounded flex-grow"
            :disabled="formLoading"
          />
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
import BaseButton from '@/components/ui/BaseButton.vue';

const route = useRoute();
const router = useRouter();
const { sessionId, ueId } = route.params;

const sessionLabel = ref('');
const events = ref([]);
const sessionCompoId = ref(null);
const newEventLabel = ref('');
const loading = ref(true);
const formLoading = ref(false);
const errorMessage = ref('');

const breadcrumbItems = computed(() => [
  { label: 'Accueil', link: '/' },
  { label: 'Sessions', link: '/sessions' },
  { label: sessionLabel.value, link: `/sessions/${sessionId}` },
  { label: ueId }
]);

const loadData = async () => {
  try {
    // Session details
    const { data: session } = await supabase
      .from('session').select('label').eq('id', sessionId).single();
    sessionLabel.value = session.label;
    
    // Session composition
    const { data: compo } = await supabase
      .from('session_compo').select('id')
      .eq('session', sessionId).eq('ue', ueId).single();
    sessionCompoId.value = compo.id;
    
    // Events list
    const { data } = await supabase
      .from('event').select('*').eq('session_compo', sessionCompoId.value);
    events.value = data;
  } catch (err) {
    console.error('Erreur:', err);
    errorMessage.value = 'Erreur de chargement';
  } finally {
    loading.value = false;
  }
};

const handleAddEvent = async () => {
  if (!newEventLabel.value.trim()) return;
  
  formLoading.value = true;
  errorMessage.value = '';
  
  try {
    await supabase.from('event').insert([{
      label: newEventLabel.value,
      session_compo: sessionCompoId.value,
      completed: false
    }]);
    
    newEventLabel.value = '';
    const { data } = await supabase
      .from('event').select('*').eq('session_compo', sessionCompoId.value);
    events.value = data;
  } catch (err) {
    errorMessage.value = 'Erreur lors de la création';
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