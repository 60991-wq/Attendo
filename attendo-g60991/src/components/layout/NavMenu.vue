<template>
    <nav>
      <ul class="flex space-x-6">
        <li>
          <router-link 
            to="/" 
            class="hover:text-purple-300 transition-colors"
            :class="{ 'text-purple-300': isActiveRoute('/') }"
          >
            Accueil
          </router-link>
        </li>
        <li>
          <router-link 
            to="/sessions" 
            class="hover:text-purple-300 transition-colors"
            :class="{ 'text-purple-300': isActiveRoute('/sessions') }"
          >
            Sessions
          </router-link>
        </li>
        <li>
          <router-link 
            to="/about" 
            class="hover:text-purple-300 transition-colors"
            :class="{ 'text-purple-300': isActiveRoute('/about') }"
          >
            À propos
          </router-link>
        </li>
      </ul>
    </nav>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router';
  import { computed } from 'vue';
  
  const route = useRoute();
  
  const isActiveRoute = (path) => {
    if (path === '/') {
      return route.path === '/';
    }
    return route.path.startsWith(path);
  };
  </script>