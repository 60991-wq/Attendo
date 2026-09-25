<template>
  <form @submit.prevent="onSubmit" class="bg-white shadow rounded p-4 flex items-center space-x-4 w-full max-w-xl">

    <div class="flex items-center space-x-2 flex-grow">
      <span v-if="icon" class="text-xl">{{ icon }}</span>

      <slot>
        <input :value="modelValue" @input="updateValue($event.target.value)" :type="inputType"
          :placeholder="placeholder" class="border rounded px-3 py-1 w-full" />
      </slot>
    </div>


    <button type="submit"
      class="bg-white text-black border border-black rounded px-4 py-1 hover:bg-gray-100 whitespace-nowrap">
      {{ submitLabel }}
    </button>
  </form>
</template>

<script>
export default {
  name: 'AddForm',

  props: {
    modelValue: {
      type: [String, Object],
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Entrez un texte...'
    },
    inputType: {
      type: String,
      default: 'text'
    },
    submitLabel: {
      type: String,
      default: 'Ajouter'
    }
  },

  emits: ['update:modelValue', 'submit'],

  methods: {
    updateValue(value) {
      this.$emit('update:modelValue', value);
    },

    onSubmit() {
      this.$emit('submit', this.modelValue);
    }
  }
}
</script>
