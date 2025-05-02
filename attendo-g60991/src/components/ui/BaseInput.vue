<template>
    <div class="input-wrapper">
      <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
        {{ label }}
      </label>
      <div class="relative">
        <input
          :id="id"
          :type="type"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          :placeholder="placeholder"
          :disabled="disabled"
          :required="required"
          class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 focus:border-fuchsia-500"
          :class="{ 
            'bg-gray-100': disabled,
            'border-red-500': error 
          }"
        />
      </div>
      <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
      <p v-if="hint && !error" class="mt-1 text-sm text-gray-500">{{ hint }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BaseInput',
    props: {
      modelValue: {
        type: [String, Number],
        default: ''
      },
      id: {
        type: String,
        default() {
          return `input-${Math.random().toString(36).substring(2, 9)}`
        }
      },
      label: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'text'
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
    },
    emits: ['update:modelValue']
  }
  </script>