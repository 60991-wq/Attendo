<template>
  <div class="overflow-x-auto border border-gray-200 rounded-md">
    <table class="min-w-full divide-y divide-gray-200">
      <!-- En-têtes -->
      <thead class="bg-gray-900">
        <tr>
          <th 
            v-for="(header, index) in headers" 
            :key="index"
            class="px-4 py-3 text-left text-xs font-medium text-white uppercase"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      
      <!-- Corps du tableau -->
      <tbody class="bg-white divide-y divide-gray-200">
        <!-- Affichage des données -->
        <tr 
          v-for="(item, index) in items" 
          :key="index"
          class="hover:bg-gray-50 cursor-pointer"
          @click="$emit('row-click', item)"
        >
          <td 
            v-for="(field, fieldIndex) in fields" 
            :key="fieldIndex"
            class="px-4 py-3"
          >
            {{ item[field] }}
          </td>
        </tr>
        
        <!-- Message quand aucune donnée -->
        <tr v-if="items.length === 0">
          <td :colspan="headers.length" class="px-4 py-6 text-center text-gray-500">
            Aucune donnée à afficher
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  headers: {
    type: Array,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  fields: {
    type: Array,
    required: true
  }
});

defineEmits(['row-click']);
</script>