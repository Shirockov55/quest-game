import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/shared/api/supabase'
import HomePage from '@/pages/home/HomeView.vue'
import LoginPage from '@/pages/login/LoginPage.vue'
import SignupPage from '@/pages/signup/SignupPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupPage
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const {
    data: { user }
  } = await supabase.auth.getUser()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !user) {
    next('/login')
  } else {
    next()
  }
})

export default router
