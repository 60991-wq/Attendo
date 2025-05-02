import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SessionsView from '../views/SessionsView.vue'
import AboutView from '../views/AboutView.vue'
import SessionDetailView from '../views/SessionDetailView.vue'
import UeView from '../views/UeView.vue'
import EventView from '../views/EventView.vue'

import { supabase } from '@/supabase' // Utilisez votre chemin d'import existant

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
      component: SessionDetailView,
      meta: { requiresAuth: true } // 🔒
    },
    {
      path: '/sessions/:sessionId/ue/:ueId',
      name: 'ue-detail',
      component: UeView,
      meta: { requiresAuth: true } // 🔒
    },
    {
      path: '/sessions/:sessionId/ue/:ueId/event/:eventId',
      name: 'event-detail',
      component: EventView,
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