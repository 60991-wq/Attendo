<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <BaseTable
      :headers="['Sessions']"
      :items="sessions"
      :fields="['label']"
      @row-click="navigateToSession"
    >
      <!-- Cellule personnalisée : lien bleu stylisé -->
      <template #cell(label)="{ value, item }">
        <router-link 
          :to="{ name: 'session-detail', params: { id: item.id } }" 
          class="text-blue-600 hover:underline"
        >
          {{ value }}
        </router-link>
      </template>

      <!-- Slot "empty" : affichage vide propre -->
      <template #empty>
        <div class="text-center px-6 py-8">
          <p class="text-gray-500">Aucune session n'est disponible.</p>
          <p class="text-sm text-gray-400 mt-1 italic">
            Vous pouvez en créer une nouvelle avec le formulaire ci-dessous.
          </p>
        </div>
      </template>
    </BaseTable>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import BaseTable from '@/components/ui/BaseTable.vue'

defineProps({
  sessions: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['session-clicked'])
const router = useRouter()

const navigateToSession = (session) => {
  emit('session-clicked', session)
  router.push({ name: 'session-detail', params: { id: session.id } })
}
</script>
