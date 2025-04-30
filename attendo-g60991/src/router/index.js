import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SessionsView from '../views/SessionsView.vue'
import AboutView from '../views/AboutView.vue'
import SessionDetailView from '../views/SessionDetailView.vue' // ✅ ajout

import { supabase } from '@/supabase' // ✅ Auth

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/sessions',
      name: 'sessions',
      component: SessionsView,
      meta: { requiresAuth: true } // 🔒
    },
    {
      path: '/sessions/:id',
      name: 'session-detail',
      component: SessionDetailView, // ✅ route dynamique
      meta: { requiresAuth: true } // 🔒
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    }
  ],
})

// ✅ Redirection si non connecté
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) return next('/')
  }
  next()
})

export default router
