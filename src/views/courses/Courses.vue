<script setup lang="ts">
import Course from '../../components/Course.vue'
</script>

<template>
    <div>
        <el-text class="mx-1" style="color: black">Courses</el-text>
        <br />
        <el-text class="mx-1" size="small"
            >Here are some of my video courses where you can learn what
            interests you.</el-text
        >
        <br />
        <a
            href="https://www.youtube.com/channel/UCXN62bNhJeweaziQWjl7aAw"
            target="_blank"
            ><el-text class="mx-1" size="small" style="color: #003b4f"
                >Visit my YouTuBe&nbsp;<el-icon><Right /></el-icon></el-text
        ></a>
        <br />
        <a
            href="https://space.bilibili.com/1075868096?spm_id_from=333.1007.0.0"
            target="_blank"
            ><el-text class="mx-1" size="small" style="color: #003b4f"
                >Visit my BiLiBiLi&nbsp;<el-icon><Right /></el-icon></el-text
        ></a>
        <br />
        <a
            href="https://www.douyin.com/user/MS4wLjABAAAAUecLMOJWk7f6YP81E37Bc6kYZ9cpPzs9Ut7gb4P0sSg"
            target="_blank"
            ><el-text class="mx-1" size="small" style="color: #003b4f"
                >Visit my TikTok (China)&nbsp;<el-icon
                    ><Right /></el-icon></el-text
        ></a>
        <br /><br />
        <Course />
    </div>
</template>

<style scoped></style>
