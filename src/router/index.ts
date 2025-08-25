import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import TaskCreateView from '@/views/TaskCreateView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Task Schedule'
      }
    },
    {
      path: '/create',
      name: 'task-create',
      component: TaskCreateView,
      meta: {
        title: 'Nova Tarefa'
      }
    }
  ]
})

// Atualizar título da página
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - Task Schedule`
  }
  next()
})

export default router
