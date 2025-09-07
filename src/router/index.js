import { createRouter, createWebHistory } from 'vue-router';
const routes_404 = {
    path: '/:pathMatch(.*)*',
    hidden: true,
    component: () => () => {},
};
const routes = [
    { path: '/', redirect: '/chat' },
    { path: '/chat', component: () => import('@/views/chat.vue') },
    { path: '/image', component: () => import('@/views/buildImage.vue') },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
router.addRoute(routes_404);

export default router;
