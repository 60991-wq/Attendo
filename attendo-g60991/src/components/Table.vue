<template>
    <div class="bg-white shadow rounded overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-200 text-gray-700 text-sm uppercase">
          <tr>
            <th v-for="header in headers" :key="header" class="p-3">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
        v-for="(row, index) in rows"
        :key="index"
         :class="['border-t hover:bg-gray-50 cursor-pointer', { 'bg-blue-100': row.present }]"
         @click="$emit('row-click', row)"
          >

            <td
              v-for="key in columns"
              :key="key"
              class="p-3 text-fuchsia-600 hover:underline"
            >
              {{ row[key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  defineProps({
    headers: Array,   
    rows: Array,     
    columns: Array    
  })
  
  defineEmits(['row-click']) 
  </script>
  