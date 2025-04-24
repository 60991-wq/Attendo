import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SessionsView from '../views/SessionsView.vue'
import AboutView from '../views/AboutView.vue'
import { supabase } from '@/supabase' // ✅ ajoute ça

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
      meta: { requiresAuth: true } // ✅ protection ici
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
  ],
})

// ✅ Redirection si l'utilisateur n'est pas connecté
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
