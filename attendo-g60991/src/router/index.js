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
      name: 'SessionDetail',
      component: SessionDetailView,
      meta: { requiresAuth: true }
    },
    {
      path: '/session-compo/:id/events',
      name: 'EventList',
      component: EventView,
      meta: { requiresAuth: true }
    },
    {
      path: '/event/:id/rooms',
      name: 'EventRooms',
      component: () => import('@/views/EventRoomsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/event/:eventId/room/:roomId/presence',
      name: 'PresenceView',
      component: () => import('@/views/PresenceView.vue'),
      meta: { requiresAuth: true }
    }
    
  ]
})

// ✅ Protection des routes avec authentification
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const { data } = await supabase.auth.getUser()
    if (!data.user) {
      return next('/')
    }
  }
  next()
})

export default router
