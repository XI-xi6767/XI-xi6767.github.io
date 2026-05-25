import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Portfolio from '../views/Portfolio.vue'
import ProjectList from '../views/ProjectList.vue'
import ProjectExplorer from '../views/ProjectExplorer.vue'
import ProjectDetail from '../views/ProjectDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/portfolio',
    name: 'Portfolio',
    component: Portfolio
  },
  {
    path: '/projects/:category',
    name: 'ProjectExplorer',
    component: ProjectExplorer
  },
  {
    path: '/projects/:category/:pathMatch(.*)*',
    name: 'ProjectDetail',
    component: ProjectDetail
  },
  {
    path: '/projects',
    redirect: '/projects/company'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
