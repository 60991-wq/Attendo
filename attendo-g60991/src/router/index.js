import { createRouter, createWebHistory } from 'vue-router'

// Vues
import HomeView from '../views/HomeView.vue'
import SessionsView from '../views/SessionsView.vue'
import AboutView from '../views/AboutView.vue'
import SessionDetailView from '../views/SessionDetailView.vue'
import UeEventsView from '../views/UeEventsView.vue'
import EventDetailView from '../views/EventDetailView.vue'

// Supabase pour l'authentification
import { supabase } from '@/supabase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/sessions',
      name: 'sessions',
      component: SessionsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/sessions/:id',
      name: 'session-detail',
      component: SessionDetailView,
      meta: { requiresAuth: true }
    },
    {
      path: '/sessions/:sessionId/ue/:ueId',
      name: 'ue-detail',
      component: UeEventsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/sessions/:sessionId/ue/:ueId/event/:eventId',
      name: 'event-detail',
      component: EventDetailView,
      meta: { requiresAuth: true }
    }
  ]
})

// 🔒 Redirection si l'utilisateur n'est pas connecté
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) {
      return next('/')
    }
  }
  next()
})

export default router
