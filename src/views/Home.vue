<script lang="ts" setup>
import avatar from '../assets/wwwanghua.jpg'
import Archives from './archives/Archives.vue'
import Projects from './projects/Projects.vue'
import Courses from './courses/Courses.vue'
import Photos from './photos/Photos.vue'
import About from './about/About.vue'
</script>

<template>
    <div style="display: flex; align-items: center; display: none">
        <el-avatar :size="50" :src="avatar" />
        &nbsp;&nbsp;
        <div style="display: flex; flex-direction: column">
            <el-text class="mx-1" style="color: black">王华</el-text>
            <el-text class="mx-1" size="small"
                ><small>全栈工程师 / 数字工匠</small></el-text
            >
        </div>
    </div>
    <div>
        <Archives />
        <br /><br />
        <Projects />
        <br /><br />
        <Courses />
        <br /><br />
        <Photos />
        <br /><br />
        <About />
    </div>
    <div style="margin-top: 10px; text-align: center">
        <el-text class="mx-1" size="small"
            >Copyright © 2024-{{ new Date().getFullYear() }} KingStudy<br />
            <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                style="color: #606266"
                >滇ICP备19011988号-3</a
            ></el-text
        >
    </div>
</template>

<style></style>
