<script setup lang="ts">
import { ref, onMounted, onActivated } from 'vue'
import { T1YClient } from '../api/t1y.ts'
import { useRoute } from 'vue-router'

const route = useRoute()

const baseURL = import.meta.env.VITE_APP_KOALA_OSS_BASE_URL

const loading = ref(true)

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

let filter: Array<any> = [
    { $match: {} },
    { $sort: { id: -1 } },
    {
        $project: {
            url: 0,
            content: 0,
            createdAt: 0,
            updatedAt: 0,
        },
    },
]

const getNews = async () => {
    if (news.value.length > 0) {
        loading.value = false
        return
    }
    if (route.fullPath == '/') {
        filter.push({ $limit: 3 })
    }
    T1YClient.aggregate('news', filter).then((res: any) => {
        news.value = res.data.data.map((item: any) => ({
            ...item,
            imageUrl: `${baseURL}/${item.image}`,
            koalaUrl: 'https://koala-oss.app/news/' + item.id,
        }))
        loading.value = false
    })
}

onMounted(() => {
    getNews()
})

onActivated(() => {
    if (news.value.length === 0) {
        getNews()
    }
})
</script>

<template>
    <div>
        <el-skeleton v-if="loading" :rows="5" animated />
        <el-row v-else :gutter="100">
            <el-col
                class="news"
                :xs="24"
                :sm="12"
                :md="6"
                :lg="6"
                :xl="6"
                lazy
                v-for="(data, index) in news"
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
                                {{ data.title }}</el-text
                            >
                        </div>
                    </div>
                </RouterLink>
            </el-col>
        </el-row>
    </div>
</template>

<style scoped>
.news {
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>
