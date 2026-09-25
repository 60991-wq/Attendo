import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import SessionsView from '../views/SessionView.vue'
import SessionDetailView from '../views/SessionDetailView.vue'
import EventView from '../views/EventView.vue'
import { supabase } from '@/supabase'

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
      meta: { requiresAuth: true }
    },
    {
      path: '/sessions/:id',
      name: 'sessionDetail',
      component: SessionDetailView,
      meta: { requiresAuth: true }
    },
    {
      path: '/session-compo/:id/events',
      name: 'eventList',
      component: EventView,
      meta: { requiresAuth: true }
    },
    {
      path: '/event/:id/rooms',
      name: 'eventRooms',
      component: () => import('@/views/EventRoomsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/event/:eventId/room/:roomId/presence',
      name: 'presenceView',
      component: () => import('@/views/PresenceView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  try {
    if (to.meta.requiresAuth) {
      const result = await supabase.auth.getUser()
      if (!result.data.user) {
        console.log("Utilisateur non authentifié, redirection vers l'accueil")
        return next('/')
      }
    }
    next()
  } catch (error) {
    console.error("Erreur lors de la vérification de l'authentification:", error)
    return next('/')
  }
})

export default router
