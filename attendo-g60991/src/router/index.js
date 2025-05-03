// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import SessionsView from '../views/SessionView.vue' // N'oublie pas cet import !

import { supabase } from '@/supabase' // ou '@/services/SupabaseClient' selon ton projet

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/sessions',
      name: 'sessions',
      component: SessionsView,
      meta: { requiresAuth: true } // optionnel si tu veux protéger cette route
    }
  ]
})

// ✅ Redirection si l’utilisateur n’est pas connecté
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) return next('/')
  }
  next()
})

export default router
