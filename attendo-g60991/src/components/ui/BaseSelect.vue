<template>
    <div class="w-full">
      <label 
        v-if="label" 
        :for="id" 
        class="block text-sm font-medium text-gray-700 mb-1"
      >
        {{ label }}
      </label>
      <select
        :id="id"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :class="[
          'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
          'py-2 px-3',
          disabled ? 'bg-gray-100 cursor-not-allowed' : '',
          error ? 'border-red-500' : 'border',
          'transition duration-150 ease-in-out'
        ]"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <slot></slot>
      </select>
      <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
      <p v-else-if="hint" class="mt-1 text-sm text-gray-500">{{ hint }}</p>
    </div>
  </template>
  
  <script setup>
  defineEmits(['update:modelValue']);
  
  defineProps({
    modelValue: {
      type: [String, Number],
      default: ''
    },
    id: {
      type: String,
      default: () => `select-${Math.random().toString(36).substring(2, 9)}`
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    hint: {
      type: String,
      default: ''
    }
  });
  </script>