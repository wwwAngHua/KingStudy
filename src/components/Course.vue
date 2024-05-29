<script setup lang="ts">
import { ref } from 'vue'
import { T1YClient } from '../api/t1y.ts'

const loading = ref(true)

interface Course {
    preview: string
    title: string
    tag: string[]
    url: string
    description: string
}

const courses = ref<Array<Course>>([])
let courseUrls: string[]

const getCourses = async () => {
    T1YClient.aggregate('courses', [
        { $match: {} },
        { $sort: { createdAt: -1 } },
    ]).then((res: any) => {
        courses.value = res.data.data
        if (res.data.data != null) {
            courseUrls = courses.value.map((Course) => Course.preview)
        }
        loading.value = false
    })
}

getCourses()
</script>

<template>
    <div>
        <el-skeleton v-if="loading" :rows="5" animated />
        <el-row v-else :gutter="20">
            <el-col
                class="Course"
                :xs="24"
                :sm="12"
                :md="6"
                :lg="6"
                :xl="6"
                lazy
                v-for="(data, index) in courses"
                :key="index">
                <el-image
                    style="
                        width: auto;
                        height: auto;
                        border-radius: 15px;
                        aspect-ratio: auto 720 / 400;
                    "
                    :src="data.preview"
                    :zoom-rate="1.2"
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="courseUrls"
                    :initial-index="index"
                    fit="contain" /><el-text class="mx-1" style="color: black"
                    >{{ data.title }}<br /><el-tag
                        size="small"
                        round
                        v-for="(tag, tagIndex) in courses[index].tag"
                        :key="tagIndex"
                        style="margin-left: 5px"
                        >{{ tag }}</el-tag
                    ></el-text
                ><br /><el-text class="mx-1" size="small">{{
                    data.description
                }}</el-text
                ><br /><a :href="data.url" target="_blank"
                    ><el-text class="mx-1" size="small" style="color: #003b4f"
                        >Open link in new tab&nbsp;<el-icon
                            ><Right /></el-icon></el-text></a></el-col
        ></el-row>
    </div>
</template>

<style scoped>
.Course {
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>
