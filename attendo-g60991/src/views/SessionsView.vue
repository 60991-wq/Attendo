<template>
  <div class="p-6 space-y-6">
    <Breadcrumb :items="[
      { label: 'Accueil', link: '/' },
      { label: 'Sessions', link: '/sessions' },
      { label: sessionLabel, link: `/sessions/${sessionId}` },
      { label: displayUeId }
    ]" />
    
    <!-- Titre de la page -->
    <h1 class="text-2xl text-blue-500 font-medium mb-4">Sessions</h1>
    
    <!-- Tableau des sessions sans double en-tête -->
    <div class="bg-white shadow rounded-lg overflow-hidden mb-6">
      <SessionList 
        :sessions="sessions" 
        @session-clicked="navigateToSession" 
      />
    </div>
    
    <!-- Formulaire d'ajout de session -->
    <div class="bg-white shadow rounded-lg p-4">
      <h2 class="font-medium mb-4">Ajouter une session</h2>
      <SessionForm
        v-model="newSessionLabel"
        :loading="formLoading"
        @submit="handleCreate"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Breadcrumb from '@/components/layout/Breadcrumb.vue';
import SessionList from '@/components/session/SessionList.vue';
import SessionForm from '@/components/session/SessionForm.vue';
import { supabase } from '@/supabase';

export default {
  components: {
    Breadcrumb,
    SessionList,
    SessionForm
  },
  
  setup() {
    const router = useRouter();
    const sessions = ref([]);
    const newSessionLabel = ref('');
    const loading = ref(true);
    const formLoading = ref(false);
    
    // Charger les sessions
    const loadSessions = async () => {
      loading.value = true;
      
      try {
        const { data, error } = await supabase
          .from('session')
          .select('*')
          .order('id', { ascending: true });
        
        if (error) throw error;
        sessions.value = data;
      } catch (error) {
        console.error('Erreur lors du chargement des sessions:', error);
      } finally {
        loading.value = false;
      }
    };
    
    // Créer une nouvelle session
    const handleCreate = async (formData) => {
      formLoading.value = true;
      
      try {
        const { error } = await supabase
          .from('session')
          .insert([{ label: formData.label }]);
        
        if (error) throw error;
        
        newSessionLabel.value = '';
        await loadSessions();
      } catch (error) {
        console.error('Erreur lors de la création de la session:', error);
        alert('Impossible de créer la session');
      } finally {
        formLoading.value = false;
      }
    };
    
    // Navigation vers la page de détail
    const navigateToSession = (session) => {
      router.push({ name: 'session-detail', params: { id: session.id }});
    };
    
    onMounted(() => {
      loadSessions();
    });
    
    return {
      sessions,
      newSessionLabel,
      loading,
      formLoading,
      handleCreate,
      navigateToSession
    };
  }
}
</script>