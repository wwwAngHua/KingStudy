<script lang="ts" setup>
import News from './news/News.vue'
import Archives from './archives/Archives.vue'
import Projects from './projects/Projects.vue'
</script>

<template>
    <div>
        <Archives />
        <br /><br />
        <News />
        <br /><br />
        <Projects />
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
