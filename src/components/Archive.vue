<script setup lang="ts">
import { ref } from 'vue'
import { T1YClient } from '../api/t1y.ts'
import { useRoute } from 'vue-router'

const route = useRoute()

const loading = ref(true)

interface Archive {
    _id: string
    preview: string
    title: string
    description: string
}

const archives = ref<Array<Archive>>([])
let archiveUrls: string[]

let filter: Array<any> = [
    { $match: {} },
    { $sort: { createdAt: route.fullPath == '/' ? 1 : -1 } },
    {
        $project: {
            content: 0,
            tag: 0,
            views: 0,
            createdAt: 0,
            updatedAt: 0,
        },
    },
]

const getArchives = async () => {
    if (route.fullPath == '/') {
        filter.push({ $limit: 1 })
    }
    T1YClient.aggregate('archives', filter).then((res: any) => {
        archives.value = res.data.data
        if (res.data.data != null) {
            archiveUrls = archives.value.map((archive) => archive.preview)
        }
        loading.value = false
    })
}

const getBackgroundImage = (index: number) => {
    const randomNum = Math.floor(Math.random() * 10) + 1
    return {
        backgroundImage: archiveUrls[index] === 'https://api.t1y.net/storage/1500/photos/archives/draft.png'
          ? `url(https://api.t1y.net/storage/1500/photos/random/${randomNum}.png)`
          : `url(${archiveUrls[index]})`
    }
}

getArchives()
</script>

<template>
    <div>
        <el-skeleton v-if="loading" :rows="5" animated />
        <el-row v-else>
            <el-col
                class="archive"
                :span="24"
                lazy
                v-for="(data, index) in archives"
                :key="index">
                <RouterLink :to="'/archives/' + data._id"
                    ><div class="archive-item">
                        <div
                            :style="getBackgroundImage(index)"
                            style="
                                width: 70px;
                                height: 70px;
                                display: inline-block;
                                background-size: cover;
                                background-repeat: no-repeat;
                                background-position: 50% 50%;
                                position: relative;
                            ">
                            <div
                                style="
                                    position: absolute;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    margin-left: 80px;
                                    max-width: 350%;
                                ">
                                <el-text
                                    class="mx-1"
                                    size="small"
                                    style="color: black"
                                    truncated
                                    >{{ data.title }}</el-text
                                >
                                <br />
                                <el-text class="mx-1" size="small" truncated
                                    ><small>{{
                                        data.description
                                    }}</small></el-text
                                >
                            </div>
                        </div>
                    </div></RouterLink
                >
            </el-col></el-row
        >
    </div>
</template>

<style scoped>
.archive {
    margin-top: 10px;
    margin-bottom: 10px;
}
.archive-item {
    width: 100%;
    height: 70px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}
.archive-item:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.13);
}
</style>
