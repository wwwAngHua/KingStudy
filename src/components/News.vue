<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { T1YClient } from '../api/t1y.ts'
import { useRoute } from 'vue-router'

const route = useRoute()

const baseURL = import.meta.env.VITE_APP_KOALA_OSS_BASE_URL

const loading = ref(false)
const finished = ref(false)

interface News {
    _id: string
    id: number
    image: string
    imageUrl: string
    title: string
    url: string
    koalaUrl: string
    content: string
}

const news = ref<Array<News>>([])
const onlyTwoNews = ref<Array<News>>([])

let offset = 0 // 偏移量
const pageSize = 12 // 每次加载条数

// 底部触发器
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const getNews = async () => {
    if (loading.value || finished.value) return
    loading.value = true

    // 第一次只加载 2 条
    let limit = pageSize
    if (route.fullPath === '/' && offset === 0) {
        limit = 2
    }

    const filter: any[] = [
        { $sort: { id: -1 } },
        { $skip: offset },
        { $limit: limit },
        {
            $project: {
                url: 0,
                content: 0,
                createdAt: 0,
                updatedAt: 0,
            },
        },
    ]

    const res: any = await T1YClient.aggregate('news', filter)
    const list = res.data.data.map((item: any) => ({
        ...item,
        imageUrl: `${baseURL}/${item.image}`,
        koalaUrl: 'https://koala-oss.app/news/' + item.id,
    }))

    if (list.length === 0) {
        finished.value = true
    } else {
        news.value.push(...list)
        onlyTwoNews.value = news.value.slice(0, 2)
        offset += list.length // 用真实返回数更新偏移量
    }

    loading.value = false
}

onMounted(() => {
    getNews()

    observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            getNews()
        }
    })

    if (loadMoreTrigger.value) {
        observer.observe(loadMoreTrigger.value)
    }
})

onUnmounted(() => {
    if (observer) {
        observer.disconnect()
    }
})
</script>

<template>
    <div>
        <el-skeleton v-if="loading && news.length === 0" :rows="5" animated />
        <el-row v-else :gutter="100">
            <el-col
                class="news"
                :xs="24"
                :sm="12"
                :md="6"
                :lg="6"
                :xl="6"
                lazy
                v-for="(data, index) in $route.fullPath == '/'
                    ? onlyTwoNews
                    : news"
                :key="index">
                <RouterLink :to="'/news/' + data._id">
                    <div
                        style="
                            border: solid 1px #003b4f;
                            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
                        ">
                        <img
                            :src="data.imageUrl"
                            style="
                                width: 100%;
                                height: 300px;
                                display: block;
                                object-fit: cover;
                                object-position: top;
                            " />
                        <div
                            style="
                                width: 100%;
                                padding-top: 10px;
                                padding-bottom: 10px;
                                background-color: black;
                            ">
                            <el-text
                                class="mx-1"
                                size="small"
                                style="width: 100%; height: 50px; color: white">
                                {{ data.title }}
                            </el-text>
                        </div>
                    </div>
                </RouterLink>
            </el-col>
        </el-row>

        <div style="text-align: center; padding: 20px">
            <span v-if="loading && news.length > 0">
                <el-text class="mx-1" size="small">Loading...</el-text>
            </span>
            <span v-else-if="finished">
                <el-text class="mx-1" size="small">No more!!!</el-text>
            </span>
        </div>

        <!-- 触发器 -->
        <div
            v-if="$route.fullPath != '/'"
            ref="loadMoreTrigger"
            style="height: 1px"></div>
    </div>
</template>

<style scoped>
.news {
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>
