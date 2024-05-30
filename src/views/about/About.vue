<script setup lang="ts">
import avatar from '../../assets/wwwanghua.jpg'
import qrCode from '../../assets/qr_code.png'
</script>

<template>
    <div>
        <el-text class="mx-1" style="color: black">About</el-text>
        <br />
        <el-text class="mx-1" size="small"
            >Hello 👋, I am Wang Hua (王华), here you can see all the
            information about me and this website.</el-text
        >
        <br />
        <el-text class="mx-1" size="small"
            >KingStudy is built with
            <a
                href="https://www.t1y.net/"
                target="_blank"
                style="color: #003b4f"
                >T1 backend cloud (T1后端云)</a
            >
            ! (
            <a href="https://vuejs.org/" target="_blank" style="color: #003b4f"
                >Vue3</a
            >
            /
            <a href="https://vitejs.dev/" target="_blank" style="color: #003b4f"
                >Vite5</a
            >
            /
            <a
                href="https://www.typescriptlang.org/"
                target="_blank"
                style="color: #003b4f"
                >TypeScript</a
            >
            /
            <a
                href="https://www.mongodb.com/"
                target="_blank"
                style="color: #003b4f"
                >MongoDB</a
            >
            /
            <a
                href="https://element-plus.org/"
                target="_blank"
                style="color: #003b4f"
                >Element Plus</a
            >
            )</el-text
        >
        <br /><br />
        <div style="display: flex; align-items: center">
            <el-avatar :size="50" src="/favicon.png" />
            &nbsp;
            <el-text class="mx-1" style="color: black"
                ><strong>KingStudy</strong></el-text
            >
        </div>
        <br />
        <div style="display: flex; align-items: center">
            <el-avatar :size="50" :src="avatar" />
            &nbsp;
            <el-text class="mx-1" style="color: black"
                ><strong>Wang Hua (王华)</strong></el-text
            >
        </div>
        <br />
        <el-text>
            <el-icon>
                <Link />
            </el-icon>
            <a
                href="https://www.github.com/wwwAngHua/KingStudy"
                target="_blank"
                style="color: #003b4f">
                Source</a
            >
        </el-text>
        <br /><br />
        <el-text class="mx-1" style="color: black">Buy me a coffee</el-text>
        <br /><br />
        <el-image :src="qrCode" fit="contain" style="height: 70px" />
        <br /><br />
        <el-text class="mx-1" style="color: black">About me</el-text>
        <br />
        <ul>
            <li>
                <el-text class="mx-1" size="small" style="color: black"
                    ><el-icon><Message /></el-icon
                    >&nbsp;wwwanghua@outlook.com</el-text
                >
            </li>
            <li>
                <el-text class="mx-1" size="small" style="color: black"
                    ><el-icon><MapLocation /></el-icon>&nbsp;Yunnan</el-text
                >
            </li>
            <li>
                <el-text class="mx-1" size="small" style="color: black"
                    ><el-icon><Timer /></el-icon>&nbsp;AM 7:30 - PM
                    17:30</el-text
                >
            </li>
        </ul>
    </div>
</template>

<style scoped></style>
