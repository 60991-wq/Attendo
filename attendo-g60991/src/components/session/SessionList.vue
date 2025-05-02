<template>
    <div>
      <BaseTable
        :headers="['Sessions']"
        :items="sessions"
        :fields="['label']"
        @row-click="navigateToSession"
      >
        <template #cell(label)="{ value, item }">
          <router-link 
            :to="{ name: 'session-detail', params: { id: item.id }}" 
            class="text-blue-600 hover:underline"
          >
            {{ value }}
          </router-link>
        </template>
        
        <template #empty>
          <div class="text-center p-4">
            <p class="text-gray-500">Aucune session n'est disponible.</p>
            <p class="text-sm text-gray-400 mt-1">Vous pouvez en créer une nouvelle avec le formulaire ci-dessous.</p>
          </div>
        </template>
      </BaseTable>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  import BaseTable from '@/components/ui/BaseTable.vue';
  import { useRouter } from 'vue-router';
  
  defineProps({
    sessions: {
      type: Array,
      required: true
    }
  });
  
  const emit = defineEmits(['session-clicked']);
  const router = useRouter();
  
  const navigateToSession = (session) => {
    emit('session-clicked', session);
    router.push({ name: 'session-detail', params: { id: session.id }});
  };
  </script>