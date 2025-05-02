<template>
  <div class="p-6 space-y-6">
    <Breadcrumb :items="breadcrumbItems" />

    <div v-if="loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
    </div>

    <template v-else-if="event">
      <h1 class="text-2xl font-bold">
        <span class="text-fuchsia-600">{{ event.label }}</span> - {{ ueId }}
      </h1>

      <!-- Liste des locaux -->
      <div class="bg-white shadow rounded-lg">
        <div class="bg-gray-900 text-white px-4 py-3">Locaux assignés</div>
        <div class="p-4 grid md:grid-cols-2 gap-4">
          <div 
            v-for="room in rooms" 
            :key="room.id"
            class="border rounded p-3 hover:bg-gray-50 cursor-pointer"
            @click="navigateToRoom(room)"
          >
            <h3>{{ room.room_info.label }}</h3>
            <p>Capacité: {{ room.room_info.capacity }}</p>
            <p>Superviseur: {{ room.supervisor || 'Non assigné' }}</p>
          </div>
          <div v-if="rooms.length === 0" class="text-center text-gray-500">
            Aucun local assigné
          </div>
        </div>
      </div>

      <!-- Ajout de local -->
      <div class="mt-4 bg-white shadow rounded-lg">
        <div class="bg-gray-100 px-4 py-3 border-b">Ajouter un local</div>
        <div class="p-4">
          <div class="flex flex-col sm:flex-row gap-3">
            <BaseSelect
              v-model="selectedRoomId"
              placeholder="Choisissez un local"
              :disabled="availableRooms.length === 0 || formLoading"
            >
              <option v-for="room in availableRooms" :key="room.id" :value="room.id">
                {{ room.label }} ({{ room.capacity }})
              </option>
            </BaseSelect>
            <BaseButton
              @click="handleAssignRoom"
              variant="light"
              :disabled="!selectedRoomId || formLoading"
            >
              {{ formLoading ? 'Ajout...' : 'Assigner' }}
            </BaseButton>
          </div>
        </div>
      </div>
    </template>
    
    <div v-else-if="error" class="bg-red-50 border rounded p-4 text-red-700">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Breadcrumb from '@/components/layout/Breadcrumb.vue';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { supabase } from '@/supabase';

const route = useRoute();
const router = useRouter();
const sessionId = route.params.sessionId;
const ueId = route.params.ueId;
const eventId = route.params.eventId;
const sessionLabel = ref('');
const event = ref(null);
const rooms = ref([]);
const availableRooms = ref([]);
const selectedRoomId = ref('');
const loading = ref(true);
const formLoading = ref(false);
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
    const { data: session } = await supabase
      .from('session')
      .select('label')
      .eq('id', sessionId)
      .single();
    sessionLabel.value = session.label;
    
    // Charger épreuve
    const { data: eventData } = await supabase
      .from('event')
      .select('*')
      .eq('id', eventId)
      .single();
    event.value = eventData;
    
    // Charger locaux assignés
    const { data: roomsData } = await supabase
      .from('examination_room')
      .select('id, room, supervisor, room_info:room (id, label, capacity)')
      .eq('event', eventId);
    rooms.value = roomsData;
    
    // Locaux disponibles
    const assignedRoomIds = rooms.value.map(r => r.room);
    const { data: availableRooms } = assignedRoomIds.length === 0 
      ? await supabase.from('room').select('*')
      : await supabase.from('room').select('*').not('id', 'in', `(${assignedRoomIds.join(',')})`);
    
    availableRooms.value = availableRooms;
  } catch (err) {
    error.value = 'Impossible de charger les données';
  } finally {
    loading.value = false;
  }
};

const handleAssignRoom = async () => {
  if (!selectedRoomId.value) return;
  formLoading.value = true;
  try {
    await supabase.from('examination_room').insert([{
      event: eventId,
      room: selectedRoomId.value,
      supervisor: null
    }]);
    selectedRoomId.value = '';
    await loadData();
  } catch {
    alert('Erreur lors de l\'assignation');
  } finally {
    formLoading.value = false;
  }
};

const navigateToRoom = (room) => {
  router.push({
    name: 'room-detail',
    params: { sessionId, ueId, eventId, roomId: room.id }
  });
};

onMounted(loadData);
</script>