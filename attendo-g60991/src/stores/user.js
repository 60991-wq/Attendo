// src/stores/user.js
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
const user = ref(null)
const isLoadingUser = ref(true)

return { user, isLoadingUser }
})
