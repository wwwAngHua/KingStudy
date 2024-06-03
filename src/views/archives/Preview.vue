<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { T1YClient } from '../../api/t1y.ts'

const loading = ref(true)

const objectId = useRoute().params.pathMatch[0]

interface Archive {
    _id: string
    preview: string
    views: number
    title: string
    tag: string[]
    description: string
    content: string
    createdAt: string
}

const archives = ref<Archive>({
    _id: objectId,
    preview: '',
    views: 0,
    title: '',
    tag: [],
    description: '',
    content: '',
    createdAt: '',
})

const getPost = async () => {
    T1YClient.findOne('archives', objectId).then((res: any) => {
        archives.value = res.data.data
        document.title = archives.value.title + ' - KingStudy'
        updateViews()
        loading.value = false
    })
}

const updateViews = async () => {
    T1YClient.updateOne('archives', objectId, { $inc: { views: 1 } })
}

getPost()
</script>

<template>
    <div>
        <el-skeleton v-if="loading" :rows="10" animated />
        <div v-else>
            <el-text class="mx-1" size="large" style="color: black">{{
                archives.title
            }}</el-text>
            <el-tag
                size="small"
                round
                v-for="(tag, tagIndex) in archives.tag"
                :key="tagIndex"
                style="margin-left: 5px"
                >{{ tag }}</el-tag
            >
            <br />
            <el-text class="mx-1" size="small">{{
                archives.createdAt
            }}</el-text>
            <br />
            <el-text class="mx-1" size="small"
                >Views: {{ archives.views }}</el-text
            >
            <el-divider border-style="dashed" />
            <div>
                <small>
                    <v-md-preview :text="archives.content"></v-md-preview>
                </small>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
