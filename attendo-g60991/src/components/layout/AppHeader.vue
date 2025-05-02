<template>
  <header class="bg-black py-4">
    <h1 class="text-center text-fuchsia-600 text-3xl font-bold">Attendo</h1>
  </header>
</template>

<script>
import { useUserStore } from '@/stores/user';
import NavMenu from '@/components/layout/NavMenu.vue';

export default {
  components: {
    NavMenu
  },
  setup() {
    const userStore = useUserStore();
    
    const handleLogin = async () => {
      // Votre logique de connexion ici
    };
    
    return {
      userStore,
      handleLogin
    };
  }
}
</script>