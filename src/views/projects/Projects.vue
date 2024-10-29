<script setup lang="ts">
import Project from '../../components/Project.vue'
</script>

<template>
    <div>
        <el-text class="mx-1" style="color: black">Projects</el-text>
        <br />
        <el-text class="mx-1" size="small"
            >The following are my main independent full-stack development projects. I hope you find them interesting.</el-text
        >
        <br />
        <a href="https://github.com/wwwAngHua" target="_blank"
            ><el-text class="mx-1" size="small" style="color: #003b4f"
                >Visit my GitHub&nbsp;<el-icon><Right /></el-icon></el-text
        ></a>
        <br /><br />
        <Project />
    </div>
</template>

<style scoped></style>
