<template>
    <div class="border rounded p-3 text-center shadow w-[100px]">
      <div class="text-lg font-bold">{{ label }}</div>
      <div class="text-xs text-gray-600">{{ capacity }} places</div>
      <div class="text-sm mt-1">
        <strong>Surveillant</strong>
        <div class="text-xs">{{ supervisor || '—' }}</div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    label: String,
    capacity: Number,
    supervisor: String
  })
  </script>
  