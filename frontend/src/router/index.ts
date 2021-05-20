import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import store from '../store/index';

Vue.use(VueRouter);

const isLoggedIn = (to: any, from: any, next: any) => {
    store.dispatch('auth/authenticate')
        .then(() => {
            next();
        })
        .catch(() => {
            next('/login');
        });
};

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Dashboard',
        component: () => import('../views/SimpleDashboard.vue'),
        meta: {
            breadcrumbs: [
                {
                    to: '/',
                    text: 'Dashboard',
                },
            ],
        },
        beforeEnter: isLoggedIn,
    },
    {
        path: '/Pro',
        name: 'Pro Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: {
            breadcrumbs: [
                {
                    to: '/',
                    text: 'Dashboard',
                },
            ],
        },
        beforeEnter: isLoggedIn,
    },
    {
        path: '/Simulations',
        name: 'Simulations',
        component: () => import('../views/Simulations.vue'),
        meta: {
            breadcrumbs: [
                {
                    to: '/',
                    text: 'Dashboard',
                },
                {
                    to: '/simulations',
                    text: 'Simulations',
                },
            ],
        },
        beforeEnter: isLoggedIn,
    },
    {
        path: '/hubs',
        name: 'Hubs',
        component: () => import('../views/Hubs.vue'),
        meta: {
            breadcrumbs: [
                {
                    to: '/',
                    text: 'Dashboard',
                },
                {
                    to: '/hubs',
                    text: 'Hubs',
                },
            ],
        },
        beforeEnter: isLoggedIn,
    },
    {
        path: '/sensors',
        name: 'Sensors',
        component: () => import('../views/Sensors.vue'),
        meta: {
            breadcrumbs: [
                {
                    to: '/',
                    text: 'Dashboard',
                },
                {
                    to: '/sensors',
                    text: 'Sensors',
                },
            ],
        },
        beforeEnter: isLoggedIn,
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
        meta: {
            breadcrumbs: [
                {
                    to: '/',
                    text: 'Dashboard',
                },
                {
                    to: '/profile',
                    text: 'Profile',
                },
            ],
        },
        beforeEnter: isLoggedIn,
    },
    {
        path: '/users',
        name: 'Users',
        component: () => import('../views/Users.vue'),
        meta: {
            breadcrumbs: [
                {
                    to: '/',
                    text: 'Dashboard',
                },
                {
                    to: '/users',
                    text: 'Users',
                },
            ],
        },
        beforeEnter: isLoggedIn,
    },
    {
        path: '/Storage',
        name: 'Storage',
        component: () => import('../views/Storage.vue'),
        meta: {
            breadcrumbs: [
                {
                    to: '/',
                    text: 'Dashboard',
                },
                {
                    to: '/Storage',
                    text: 'Storage',
                },
            ],
        },
        beforeEnter: isLoggedIn,
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
