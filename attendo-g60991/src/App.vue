<template>
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

      <div class="flex items-center space-x-2 text-sm">
        <span v-if="user">{{ user.email }}</span>
        <button v-if="user" @click="signOut" class="text-red-600 underline hover:text-red-800">
          Déconnexion
        </button>
        <button v-else @click="signIn" class="border border-gray-400 px-3 py-1 rounded hover:bg-gray-200">
          Connexion avec Google
        </button>
      </div>
    </nav>

    <main class="p-6">
      <RouterView />
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'
import { user } from '@/stores/user'

export default {
  setup() {
    const router = useRouter()

    onMounted(async () => {
      const { data } = await supabase.auth.getSession()
      user.value = data.session?.user ?? null
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
      if (!session) {
        router.push('/')
      }
    })

    const signIn = async () => {
      await supabase.auth.signInWithOAuth({ provider: 'google' })
    }

    const signOut = async () => {
      await supabase.auth.signOut()
      user.value = null
      router.push('/')
    }

    return {
      user,
      signIn,
      signOut
    }
  }
}
</script>
