import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MyBooksView from '../views/MyBooksView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: { name: 'Home' },
      component: HomeView
    },
    {
      path: '/UpPassChallenge/',
      name: 'Home',
      component: Home
    },
    {
      path: '/UpPassChallenge/myBooks',
      name: 'myBooks',
      component: MyBooksView
    }
  ]
})

export default router
