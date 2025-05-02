<template>
  <BaseTable
    :headers="['Sessions']"
    :items="sessions"
    :fields="['label']"
    @row-click="goToSession"
  >
    <template #cell(label)="{ value, item }">
      <router-link
        :to="{ name: 'session-detail', params: { id: item.id } }"
        class="text-blue-600 hover:underline"
      >
        {{ value }}
      </router-link>
    </template>

    <template #empty>
      <div class="text-center text-gray-500 p-4">
        Aucune session. Créez-en une ci-dessous.
      </div>
    </template>
  </BaseTable>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BaseTable from '@/components/base/BaseTable.vue'

defineProps({ sessions: Array })
const router = useRouter()

const goToSession = session =>
  router.push({ name: 'session-detail', params: { id: session.id } })
</script>
