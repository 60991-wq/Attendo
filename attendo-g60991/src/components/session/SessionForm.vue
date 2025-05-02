<template>
  <form @submit.prevent="handleSubmit" class="flex items-center gap-3">
    <div class="flex items-center bg-gray-100 px-3 py-2 rounded-md flex-1">
      <span class="text-sm text-gray-500 mr-2">Nouvelle session</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM4 13a4 4 0 014-4h4a4 4 0 014 4v1H4v-1z" />
      </svg>
      <BaseInput
        v-model="sessionLabel"
        placeholder="juin"
        class="bg-gray-100 focus:outline-none border-0 p-0 text-sm flex-1 text-gray-700 placeholder-gray-400"
        :disabled="loading"
        required
        no-border
      />
    </div>

    <BaseButton
      type="submit"
      variant="light"
      :loading="loading"
      :disabled="!sessionLabel.trim()"
      class="text-sm px-4 py-2"
    >
      Ajouter
    </BaseButton>
  </form>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

const props = defineProps({
  loading: Boolean,
  modelValue: String
});

const emit = defineEmits(['update:modelValue', 'submit']);

const sessionLabel = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
  sessionLabel.value = val;
});

const handleSubmit = () => {
  if (!sessionLabel.value.trim()) return;
  emit('submit', { label: sessionLabel.value });
  sessionLabel.value = '';
};
</script>
