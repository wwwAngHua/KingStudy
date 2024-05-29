<script setup lang="ts">
import { ref } from 'vue'
import { T1YClient } from '../api/t1y.ts'

const loading = ref(true)

interface Archive {
    _id: string
    preview: string
    title: string
    tag: string[]
    description: string
    content: string
}

const archives = ref<Array<Archive>>([])
let archiveUrls: string[]

const getArchives = async () => {
    T1YClient.aggregate('archives', [
        { $match: {} },
        { $sort: { createdAt: -1 } },
    ]).then((res: any) => {
        archives.value = res.data.data
        if (res.data.data != null) {
            archiveUrls = archives.value.map((archive) => archive.preview)
        }
        loading.value = false
    })
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
                            class="background-image"
                            :style="{
                                backgroundImage:
                                    'url(' + archiveUrls[index] + ')',
                            }"
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
                                class="content-container"
                                style="
                                    position: absolute;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    margin-left: 80px;
                                ">
                                <el-text
                                    class="mx-1"
                                    size="small"
                                    style="color: black"
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
