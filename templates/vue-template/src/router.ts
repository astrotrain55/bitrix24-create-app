import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from './views/HomePage.vue';

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home-page',
      component: HomePage,
    },
    {
      path: '/placement',
      name: 'placement-page',
      component: () => import('./views/PlacementPage.vue'),
    },
    {
      path: '/example',
      name: 'example-page',
      component: () => import('./views/ExamplePage.vue'),
    },
  ],
});
