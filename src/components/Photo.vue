<script setup lang="ts">
import { ref, onMounted, onActivated } from 'vue'
import { T1YClient } from '../api/t1y.ts'

const loading = ref(true)

interface Photo {
    preview: string
    title: string
    location: string
}

const photos = ref<Array<Photo>>([])
let photoUrls: string[]

const getPhotos = async () => {
    if (photos.value.length > 0) {
        loading.value = false
        return
    }
    T1YClient.aggregate('photos', [
        { $match: {} },
        { $sort: { createdAt: -1 } },
        {
            $project: {
                createdAt: 0,
                updatedAt: 0,
            },
        },
    ]).then((res: any) => {
        photos.value = res.data.data
        if (res.data.data != null) {
            photoUrls = photos.value.map((photo) => photo.preview)
        }
        loading.value = false
    })
}

onMounted(() => {
    getPhotos()
})

onActivated(() => {
    if (photos.value.length === 0) {
        getPhotos()
    }
})
</script>

<template>
    <div>
        <el-skeleton v-if="loading" :rows="5" animated />
        <el-row :gutter="50">
            <el-col
                class="photo"
                :xs="24"
                :sm="12"
                :md="6"
                :lg="6"
                :xl="6"
                lazy
                v-for="(data, index) in photos"
                :key="index">
                <el-image
                    style="
                        width: auto;
                        height: auto;
                        padding: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    "
                    :src="data.preview"
                    :zoom-rate="1.2"
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="photoUrls"
                    :initial-index="index"
                    fit="contain" /><el-text class="mx-1" size="small"
                    >{{ data.title }}&nbsp;&nbsp;<el-icon><Location /></el-icon
                    >&nbsp;&nbsp;{{ data.location }}</el-text
                ></el-col
            ></el-row
        >
    </div>
</template>

<style scoped>
.photo {
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>
