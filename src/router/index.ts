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
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { title: 'KingStudy' },
    },
    {
        path: '/news',
        name: 'News',
        component: () => import('../views/news/News.vue'),
        meta: { title: 'News' },
    },
    {
        path: '/news/:pathMatch(.*)*',
        name: 'NewsPreview',
        component: () => import('../views/news/Preview.vue'),
        meta: { title: 'Preview' },
    },
    {
        path: '/archives',
        name: 'Archives',
        component: () => import('../views/archives/Archives.vue'),
        meta: { title: 'Archives' },
    },
    {
        path: '/archives/:pathMatch(.*)*',
        name: 'ArchivePreview',
        component: () => import('../views/archives/Preview.vue'),
        meta: { title: 'Preview' },
    },
    {
        path: '/archives/add',
        name: 'ArchiveAdd',
        component: () => import('../views/archives/Add.vue'),
        meta: { title: 'Add New Post to Archives' },
    },
    {
        path: '/archives/edit/:pathMatch(.*)*',
        name: 'ArchiveEdit',
        component: () => import('../views/archives/Edit.vue'),
        meta: { title: 'Edit' },
    },
    {
        path: '/projects',
        name: 'Projects',
        component: () => import('../views/projects/Projects.vue'),
        meta: { title: 'Projects' },
    },
    {
        path: '/courses',
        name: 'Courses',
        component: () => import('../views/courses/Courses.vue'),
        meta: { title: 'Courses' },
    },
    {
        path: '/photos',
        name: 'Photos',
        component: () => import('../views/photos/Photos.vue'),
        meta: { title: 'Photos' },
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/about/About.vue'),
        meta: { title: 'About' },
    },
    {
        path: '/page/jsxpress',
        name: 'Jsxpress',
        component: () => import('../views/pages/JSXpress.vue'),
        meta: { title: 'JSXpress' },
    },
    {
        path: '/page/notes/:pathMatch(.*)*',
        name: 'Notes',
        component: () => import('../views/pages/Notes.vue'),
        meta: { title: 'Notes' },
    },
    {
        path: '/page/whiteboard',
        name: 'WhiteBoard',
        component: () => import('../views/pages/WhiteBoard.vue'),
        meta: { title: 'WhiteBoard' },
    },
    {
        path: '/page/tik',
        name: 'Tik',
        component: () => import('../views/pages/Tik.vue'),
        meta: { title: 'Tik' },
    },
    {
        path: '/page/chat',
        name: 'Chat',
        component: () => import('../views/pages/Chat.vue'),
        meta: { title: 'Chat' },
    },
    {
        path: '/403',
        name: '403',
        component: () => import('../views/403.vue'),
        meta: { title: '403 Forbidden' },
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
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
