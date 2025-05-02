<template>
    <button
      :type="type"
      :disabled="disabled || loading"
      :class="[
        'inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        sizeClasses,
        variantClasses,
        disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:filter hover:brightness-95',
        block ? 'w-full' : '',
      ]"
      @click="$emit('click', $event)"
    >
      <!-- Icône de chargement -->
      <svg
        v-if="loading"
        class="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      
      <!-- Icône à gauche -->
      <span v-if="iconLeft && !loading" class="mr-2">{{ iconLeft }}</span>
      
      <!-- Contenu du bouton -->
      <slot></slot>
      
      <!-- Icône à droite -->
      <span v-if="iconRight" class="ml-2">{{ iconRight }}</span>
    </button>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    type: {
      type: String,
      default: 'button'
    },
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    iconLeft: {
      type: String,
      default: ''
    },
    iconRight: {
      type: String,
      default: ''
    }
  });
  
  defineEmits(['click']);
  
  // Classes de taille
  const sizeClasses = computed(() => {
    switch (props.size) {
      case 'sm': return 'px-2.5 py-1.5 text-xs';
      case 'lg': return 'px-6 py-3 text-base';
      default: return 'px-4 py-2 text-sm'; // md
    }
  });
  
  // Classes de variante
  const variantClasses = computed(() => {
    switch (props.variant) {
      case 'primary':
        return 'bg-purple-600 text-white border border-purple-600 focus:ring-purple-500';
      case 'secondary':
        return 'bg-gray-600 text-white border border-gray-600 focus:ring-gray-500';
      case 'success':
        return 'bg-green-600 text-white border border-green-600 focus:ring-green-500';
      case 'danger':
        return 'bg-red-600 text-white border border-red-600 focus:ring-red-500';
      case 'warning':
        return 'bg-yellow-500 text-white border border-yellow-500 focus:ring-yellow-400';
      case 'info':
        return 'bg-blue-500 text-white border border-blue-500 focus:ring-blue-400';
      case 'light':
        return 'bg-white text-gray-700 border border-gray-300 focus:ring-gray-400';
      case 'dark':
        return 'bg-gray-800 text-white border border-gray-800 focus:ring-gray-700';
      case 'link':
        return 'bg-transparent text-blue-600 hover:text-blue-800 border-0 focus:ring-blue-400';
      default:
        return 'bg-purple-600 text-white border border-purple-600 focus:ring-purple-500';
    }
  });
  </script>