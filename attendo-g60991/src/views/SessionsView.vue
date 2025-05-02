<template>
  <div class="p-4 space-y-4">
    <Breadcrumb :items="breadcrumbItems" />

    <h1 class="text-2xl font-bold">Sessions</h1>

    <div v-if="loading" class="flex justify-center my-4">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
    </div>
    
    <template v-else>
      <BaseTable
        :headers="['SESSIONS']"
        :items="sessions"
        :fields="['label']"
        @row-click="navigateToSession"
      />

      <form @submit.prevent="handleCreate" class="flex items-center gap-2 mt-4">
        <div class="flex items-center border rounded bg-gray-100 px-2 py-1 flex-grow">
          <input
            v-model="label"
            type="text"
            placeholder="Nouvelle session"
            class="bg-transparent w-full outline-none"
            required
          />
        </div>
        <BaseButton
          type="submit"
          variant="light"
          :disabled="formLoading"
        >
          {{ formLoading ? 'Ajout...' : 'Ajouter' }}
        </BaseButton>
      </form>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Breadcrumb from '@/components/layout/Breadcrumb.vue';
import BaseTable from '@/components/ui/BaseTable.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { supabase } from '@/supabase';

const router = useRouter();
const sessions = ref([]);
const label = ref('');
const loading = ref(true);
const formLoading = ref(false);

const breadcrumbItems = computed(() => [
  { label: 'Accueil', link: '/' },
  { label: 'Sessions' }
]);

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
    console.error('Erreur:', error);
  } finally {
    loading.value = false;
  }
};

const handleCreate = async () => {
  if (!label.value.trim()) return;
  
  formLoading.value = true;
  try {
    const { error } = await supabase
      .from('session')
      .insert([{ label: label.value }]);
    
    if (error) throw error;
    label.value = '';
    await loadSessions();
  } catch (error) {
    console.error('Erreur:', error);
    alert('Impossible de créer la session');
  } finally {
    formLoading.value = false;
  }
};

const navigateToSession = (session) => {
  router.push(`/sessions/${session.id}`);
};

onMounted(loadSessions);
</script>