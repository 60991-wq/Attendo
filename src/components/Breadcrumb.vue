<template>
  <nav aria-label="Breadcrumb" class="mb-4">
    <ol class="flex items-center space-x-2 text-sm">
      <li v-for="(item, index) in items" :key="index" class="flex items-center">
        <template v-if="item.link && index < items.length - 1">
          <router-link :to="item.link" class="text-blue-500 hover:text-blue-900 hover:underline">
            {{ item.label }}
          </router-link>
        </template>
        <template v-else>
          <span class="text-gray-600">{{ item.label }}</span>
        </template>

        <svg v-if="index < items.length - 1" class="ml-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd" />
        </svg>
      </li>
    </ol>
  </nav>
</template>
<script>
export default {
  name: 'AppBreadcrumb',
  props: {
    items: {
      type: Array,
      required: true,
      validator(value) {
        return Array.isArray(value) &&
          value.every(item =>
            item &&
            typeof item === 'object' &&
            Object.prototype.hasOwnProperty.call(item, 'label')
          );
      }
    }
  }
}
</script>
