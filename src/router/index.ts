import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'

NProgress.configure({
    easing: 'ease',
    speed: 500,
    showSpinner: false,
    trickleSpeed: 200,
    minimum: 0.3,
})

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('../views/Home.vue'),
        meta: { title: 'KingStudy' },
    },
    {
        path: '/archives',
        component: () => import('../views/archives/Archives.vue'),
        meta: { title: 'Archives' },
    },
    {
        path: '/archives/:pathMatch(.*)*',
        component: () => import('../views/archives/Preview.vue'),
        meta: { title: 'Preview' },
    },
    {
        path: '/archives/add',
        component: () => import('../views/archives/Add.vue'),
        meta: { title: 'Add New Post to Archives' },
    },
    {
        path: '/archives/edit/:pathMatch(.*)*',
        component: () => import('../views/archives/Edit.vue'),
        meta: { title: 'Edit' },
    },
    {
        path: '/projects',
        component: () => import('../views/projects/Projects.vue'),
        meta: { title: 'Projects' },
    },
    {
        path: '/courses',
        component: () => import('../views/courses/Courses.vue'),
        meta: { title: 'Courses' },
    },
    {
        path: '/photos',
        component: () => import('../views/photos/Photos.vue'),
        meta: { title: 'Photos' },
    },
    {
        path: '/about',
        component: () => import('../views/about/About.vue'),
        meta: { title: 'About' },
    },
    {
        path: '/403',
        component: () => import('../views/403.vue'),
        meta: { title: '403 Forbidden' },
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('../views/404.vue'),
        meta: { title: '404 Not Found' },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, _from, next) => {
    NProgress.start()
    if (to.meta.title) {
        document.title =
            to.meta.title === 'KingStudy' || to.meta.title === 'Home'
                ? to.meta.title
                : `${to.meta.title} - KingStudy`
    }
    next()
})

router.afterEach((_to) => {
    NProgress.done()
})

export default router
