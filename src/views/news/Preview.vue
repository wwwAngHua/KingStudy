<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { T1YClient } from '../../api/t1y.ts'

const baseURL = import.meta.env.VITE_APP_KOALA_OSS_BASE_URL

const loading = ref(true)

const objectId = useRoute().params.pathMatch[0]

interface News {
    _id: string
    id: number
    image: string
    imageUrl: string
    title: string
    tags: string[]
    url: string
    koalaUrl: string
    content: string
}

const news = ref<News>({
    _id: '',
    id: 0,
    image: '',
    imageUrl: '',
    title: '',
    tags: [],
    url: '',
    koalaUrl: '',
    content: '',
})

const getNews = async () => {
    T1YClient.findOne('news', objectId).then((res: any) => {
        let item = res.data.data
        item.imageUrl = `${baseURL}/${item.image}`
        item.koalaUrl = `https://koala-oss.app/news/${item.id}`
        news.value = item
        document.title = news.value.title + ' - KingStudy'
        loading.value = false
    })
}

const getKoalaUrl = () => {
    return `https://koala-oss.app/news/${news.value.id}`
}

getNews()
</script>

<template>
    <div>
        <el-skeleton v-if="loading" :rows="10" animated />
        <div v-else>
            <div>
                <el-text class="mx-1" size="large" style="color: black">{{
                    news.title
                }}</el-text>
                <el-tag
                    size="small"
                    round
                    v-for="(tag, tagIndex) in news.tags"
                    :key="tagIndex"
                    style="margin-left: 5px"
                    >{{ tag }}</el-tag
                >
            </div>
            <el-divider border-style="dashed" />
            <div>
                <el-row :gutter="20">
                    <el-col :span="4" :xs="24" :sm="24" :md="4">
                        <img :src="news.imageUrl" class="image" />
                    </el-col>
                    <el-col :span="20" :xs="24" :sm="24" :md="20">
                        <div class="content-col"></div>
                        <el-text class="mx-1" style="color: black">{{
                            news.content
                        }}</el-text>
                        <br /><br />
                        <el-text
                            class="mx-1"
                            style="color: black; font-weight: bold"
                            >URL&nbsp;
                            <a
                                :href="news.url"
                                target="_blank"
                                style="color: rgb(0, 59, 79)"
                                >{{ news.url }}</a
                            ></el-text
                        >
                    </el-col>
                </el-row>
            </div>
            <el-divider border-style="dashed" />
            <el-text class="mx-1" style="color: black"
                ><strong>Copyright Notice:</strong> The content is reproduced
                to:
                <a :href="getKoalaUrl()" target="_blank" style="color: #0366d6"
                    >https://koala-oss.app/news/{{ news.id }}</a
                >, for learning and communication purposes only!
            </el-text>
        </div>
    </div>
</template>

<style scoped>
.image {
    width: 100%;
    height: 300px;
    display: block;
    object-fit: cover;
    object-position: top;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}
.content-col {
    height: 0;
}
@media (max-width: 1000px) {
    .content-col {
        height: 20px;
    }
}
</style>
