<template>
    <div class="overflow-hidden border border-gray-200 rounded-md">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-900">
          <tr>
            <th 
              v-for="(header, index) in headers" 
              :key="index"
              class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
            >
              {{ header }}
            </th>
            <th v-if="$slots.actions" class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <template v-if="items.length">
            <tr 
              v-for="(item, itemIndex) in items" 
              :key="itemIndex"
              :class="[
                'hover:bg-gray-50 transition-colors',
                getRowClass(item)
              ]"
              @click="$emit('row-click', item)"
            >
              <td 
                v-for="(field, fieldIndex) in fields" 
                :key="fieldIndex"
                class="px-4 py-3 whitespace-nowrap"
              >
                <slot :name="`cell(${field})`" :item="item" :value="getFieldValue(item, field)">
                  {{ getFieldValue(item, field) }}
                </slot>
              </td>
              <td v-if="$slots.actions" class="px-4 py-3 whitespace-nowrap text-right">
                <slot name="actions" :item="item"></slot>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td :colspan="fields.length + ($slots.actions ? 1 : 0)" class="px-4 py-6 text-center text-gray-500">
                <slot name="empty">
                  Aucune donnée à afficher
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { useSlots } from 'vue';
  
  const slots = useSlots();
  
  defineEmits(['row-click']);
  
  const props = defineProps({
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
    },
    rowClass: {
      type: Function,
      default: () => ''
    },
    clickable: {
      type: Boolean,
      default: true
    }
  });
  
  /**
   * Obtient la valeur d'un champ, même si le champ est imbriqué (ex: "user.name")
   */
  function getFieldValue(item, field) {
    if (!item) return '';
    
    if (field.includes('.')) {
      return field.split('.').reduce((obj, key) => {
        return obj && obj[key] !== undefined ? obj[key] : '';
      }, item);
    }
    
    return item[field] !== undefined ? item[field] : '';
  }
  
  /**
   * Applique des classes CSS conditionnelles aux lignes
   */
  function getRowClass(item) {
    const classes = [];
    
    // Classe personnalisée via prop
    if (props.rowClass) {
      const customClass = props.rowClass(item);
      if (customClass) classes.push(customClass);
    }
    
    // Style de curseur selon si la ligne est cliquable
    if (props.clickable) {
      classes.push('cursor-pointer');
    }
    
    return classes.join(' ');
  }
  </script>