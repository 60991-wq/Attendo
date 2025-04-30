<template>
    <nav class="text-sm text-blue-700 mb-4">
      <span v-for="(crumb, index) in items" :key="index">
        <RouterLink v-if="crumb.link" :to="crumb.link" class="hover:underline">
          {{ crumb.label }}
        </RouterLink>
        <span v-else class="font-semibold">{{ crumb.label }}</span>
        <span v-if="index < items.length - 1"> › </span>
      </span>
    </nav>
  </template>
  
  <script>
  export default {
    props: {
      items: {
        type: Array,
        required: true
      }
    }
  }
  </script>
  