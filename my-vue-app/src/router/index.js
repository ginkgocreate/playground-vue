import { createRouter, createWebHistory } from 'vue-router';

// ルート設定
const routes = [
    // {
    //     path: '/',
    //     name: 'Home',
    //     component: () => import('../views/Home.vue'), // 動的インポート
    // },
    {
        path: '/HelloWorld',
        name: 'HelloWorld',
        component: () => import('../components/HelloWorld.vue'),
    },
    {
        path: '/Login',
        name: 'Login',
        component: () => import('../components/Login/Login.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(), // HTML5の履歴モードを使用
    routes,
});

export default router;
