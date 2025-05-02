<template>
  <header class="bg-gray-900 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-2xl font-bold text-purple-400">Attendo</h1>
      <div class="flex items-center space-x-4">
        <NavMenu />
        <div v-if="userStore.user">
          <BaseButton 
            @click="handleLogout" 
            icon="→" 
            variant="outline"
          >Déconnexion</BaseButton>
        </div>
        <div v-else>
          <BaseButton 
            @click="handleLogin" 
            variant="outline"
          >Connexion avec Google</BaseButton>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import NavMenu from '@/components/layout/NavMenu.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

const userStore = useUserStore();

const handleLogin = async () => {
  // Remplacez par votre méthode de connexion réelle
  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  });
};

const handleLogout = async () => {
  // Remplacez par votre méthode de déconnexion réelle
  await supabase.auth.signOut();
  userStore.user = null;
};
</script>