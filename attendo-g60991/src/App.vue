<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import { supabase } from './supabase.js'

const user = ref(null)

// Vérifie l'utilisateur connecté au chargement
onMounted(async () => {
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  user.value = currentUser
})

// Connexion avec Google
const signInWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({ provider: 'google' })
}

// Déconnexion
const signOut = async () => {
  await supabase.auth.signOut()
  user.value = null
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="bg-black py-4">
      <h1 class="text-center text-fuchsia-600 text-3xl font-bold">Attendo</h1>
    </header>

    <!-- Navigation -->
    <nav class="flex justify-between items-center bg-gray-100 px-6 py-2 border-b">
      <div class="space-x-6 text-gray-800 text-sm">
        <RouterLink to="/" class="hover:underline">Accueil</RouterLink>
        <RouterLink to="/sessions" class="hover:underline">Sessions</RouterLink>
        <RouterLink to="/about" class="hover:underline">À propos</RouterLink>
      </div>

      <div>
        <button
          v-if="!user"
          @click="signInWithGoogle"
          class="border border-gray-400 text-sm px-3 py-1 rounded hover:bg-gray-200"
        >
          Connexion avec Google
        </button>
        <div v-else class="text-sm flex items-center gap-2">
          <span>{{ user.email }}</span>
          <button @click="signOut" class="ml-2 text-red-600 text-xs underline">
            Déconnexion
          </button>
        </div>
      </div>
    </nav>

    <!-- Page content -->
    <main class="p-6">
      <RouterView />
    </main>
  </div>
</template>
