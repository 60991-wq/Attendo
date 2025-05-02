<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <h2 class="text-lg font-medium">Ajouter une session</h2>
      <div class="flex items-center space-x-2">
        <BaseInput
          v-model="sessionLabel"
          placeholder="Nouvelle session"
          icon="👥"
          required
          :disabled="loading"
        />
        <BaseButton
          type="submit"
          variant="light"
          :loading="loading"
          :disabled="!sessionLabel"
        >
          Ajouter
        </BaseButton>
      </div>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import BaseInput from '@/components/ui/BaseInput.vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  
  const props = defineProps({
    loading: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['submit']);
  
  const sessionLabel = ref('');
  
  const handleSubmit = () => {
    if (!sessionLabel.value.trim()) return;
    
    emit('submit', { label: sessionLabel.value });
    sessionLabel.value = '';
  };
  </script>