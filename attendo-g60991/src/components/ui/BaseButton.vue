<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'px-4 py-2 rounded-md text-white font-medium',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      'bg-fuchsia-600 hover:bg-fuchsia-700 transition-colors'
    ]"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);
</script>