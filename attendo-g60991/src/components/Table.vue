<template>
  <div class="bg-white shadow rounded-lg overflow-hidden max-w-6xl mr-auto">
    <table class="w-full text-left">
      <thead class="bg-black text-white text-sm uppercase">
        <tr>
          <th v-for="header in headers" :key="header" class="p-3">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in rows"
          :key="index"
          :class="['border-t hover:bg-gray-50 cursor-pointer', { 'bg-blue-100': row && row.present }]"
          @click="handleRowClick(row)"
        >
          <td
            v-for="key in columns"
            :key="key"
            class="p-3 text-blue-600 hover:underline"
          >
            {{ row && row[key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    headers: {
      type: Array,
      required: true
    },
    rows: {
      type: Array,
      required: true,
      default: () => []
    },
    columns: {
      type: Array,
      required: true
    }
  },
  methods: {
    handleRowClick(row) {
      if (row) {
        this.$emit('row-click', row);
      }
    }
  },
  emits: ['row-click']
}
</script>