<template>
    <header class="bg-gray-900 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold text-purple-400">Attendo</h1>
        <div class="flex items-center space-x-4">
          <NavMenu />
          <div v-if="authStore.user">
            <button @click="handleLogout" class="px-3 py-1 border border-white rounded hover:bg-gray-800">
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </span>
            </button>
          </div>
          <div v-else>
            <button @click="handleLogin" class="px-3 py-1 border border-white rounded hover:bg-gray-800">
              Connexion avec Google
            </button>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
  import { useAuthStore } from '@/stores/auth';
  import NavMenu from '@/components/layout/NavMenu.vue';
  
  const authStore = useAuthStore();
  
  const handleLogin = async () => {
    await authStore.login();
  };
  
  const handleLogout = async () => {
    await authStore.signOut();
  };
  </script>