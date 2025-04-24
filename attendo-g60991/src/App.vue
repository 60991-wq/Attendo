<script>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <!--<h1 class="bg-sky-400"> Hello, Tailwindcss</h1>-->
  <div class="min-h-screen">
    <header class="bg-black py-4">
      <h1 class="text-center text-fuchsia-600 text-3xl font-bold">Attendo</h1>
    </header>
    <nav class="flex justify-between items-center bg-gray-100 px-6 py-2 border-b">

      <div class="space-x-6 text-gray-800 text-sm">
        <RouterLink to="/" class="hover:underline">Accueil</RouterLink>
        <RouterLink to="/sessions" class="hover:underline">Sessions</RouterLink>
        <RouterLink to="/about" class="hover:underline">À propos</RouterLink>
      </div>

      <button class="border border-gray-400 text-sm px-3 py-1 rounded hover:bg-gray-200">
        Connexion avec Google
      </button>
    </nav>

    <main class="p-6">
      <RouterView />
    </main>
  </div>
</template>
