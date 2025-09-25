<script setup lang="ts">
import { T1YClient } from '../../api/t1y.ts'
import { ElMessage } from 'element-plus'
import News from '../../components/News.vue'

const syncNews = async () => {
    T1YClient.callFunc('news', {}).then(() => {
        ElMessage.success('synced')
    })
}
</script>

<template>
    <div>
        <el-text class="mx-1" style="color: black"
            >News&nbsp;<el-icon @click="syncNews" style="cursor: pointer"
                ><Refresh /></el-icon
        ></el-text>
        <br />
        <el-text class="mx-1" size="small"
            >Here you can see various open source projects on Hacker News.
            Thanks to Koala OSS Club for providing data. Data source:
            <a
                href="https://koala-oss.app/"
                target="_blank"
                style="color: rgb(0, 59, 79)"
                >koala-oss.app</a
            ></el-text
        >
        <br /><br />
        <News />
    </div>
</template>

<style scoped></style>
