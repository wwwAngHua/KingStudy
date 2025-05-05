<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { T1YClient } from '../../api/t1y.ts'
import wwwanghua from '../../assets/wwwanghua.jpg'
import { formatDate } from '../../utils/date.ts'

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
            <div style="display: flex; align-items: center">
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
            </div>
            <div style="margin-top: 5px; display: flex; align-items: center">
                <el-avatar :size="20" :src="wwwanghua" />&nbsp;
                <el-text class="mx-1" size="small">王华</el-text>&nbsp;
                <el-text class="mx-1" size="small"
                    >Created at {{ formatDate(archives.createdAt) }}</el-text
                >
            </div>
            <el-text class="mx-1" size="small"
                >Views: {{ archives.views + 1 }}</el-text
            >
            <el-divider border-style="dashed" />
            <div>
                <small>
                    <v-md-preview :text="archives.content"></v-md-preview>
                </small>
            </div>
            <el-divider border-style="dashed" />
            <el-text class="mx-1" style="color: black"
                ><strong>Copyright Notice:</strong> This article is original
                content owned by
                <a
                    href="https://www.kingstudy.vip/"
                    target="_blank"
                    style="color: #0366d6"
                    >kingstudy.vip</a
                >
                Unauthorized reproduction, citation, or commercial use is
                prohibited. For permissions or collaborations, please contact
                the author and credit the original source.</el-text
            >
        </div>
    </div>
</template>

<style scoped></style>
