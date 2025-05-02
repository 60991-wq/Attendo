<template>
  <div>
    <BaseTable
      :headers="['UE associées à cette session']"
      :items="ues"
      :fields="['ue']"
      @row-click="handleUeClick"
    >
      <template #cell(ue)="{ value }">
        <span class="text-blue-600 hover:underline">{{ value }}</span>
      </template>

      <template #empty>
        <div class="text-center p-4">
          <p class="text-gray-500">Aucune UE n'est associée à cette session.</p>
          <p class="text-sm text-gray-400 mt-1">Utilisez le formulaire ci-dessous pour ajouter des UE.</p>
        </div>
      </template>
    </BaseTable>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import BaseTable from '@/components/ui/BaseTable.vue'

const props = defineProps({
  ues: {
    type: Array,
    required: true
  },
  sessionId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['ue-clicked'])

const handleUeClick = (ue) => {
  emit('ue-clicked', ue.ue)
}
</script>
