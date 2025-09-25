<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import { initTheme } from './theme/theme'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { T1YClient } from './api/t1y'
initTheme()

const router = useRouter()

const menuDisplay = ref(false)

const musicId = ref(0)
const musicDisplay = ref(false)

const getMusicId = async () => {
    T1YClient.callFunc('music', {}).then((res: any) => {
        musicId.value = res.data.link
    })
}

const goToPage = (path: string) => {
    menuDisplay.value = false
    router.push(path)
}

getMusicId()
</script>

<template>
    <div class="container">
        <el-container>
            <el-header class="header fixed-top">
                <div style="padding-top: 15px">
                    <el-row>
                        <el-col :span="10"
                            ><div>
                                <el-text class="mx-1"
                                    ><strong
                                        ><em style="letter-spacing: 0.5px"
                                            ><RouterLink to="/"
                                                >KingStudy</RouterLink
                                            ></em
                                        ></strong
                                    ></el-text
                                >
                            </div></el-col
                        >
                        <el-col
                            id="menuCol"
                            :xs="0"
                            :sm="14"
                            :md="14"
                            :lg="14"
                            :xl="14"
                            ><div style="float: right">
                                <el-text class="mx-1"
                                    ><RouterLink to="/"
                                        >Home</RouterLink
                                    ></el-text
                                >
                                &nbsp;&nbsp;
                                <el-text class="mx-1"
                                    ><RouterLink to="/news"
                                        >News</RouterLink
                                    ></el-text
                                >
                                &nbsp;&nbsp;
                                <el-text class="mx-1"
                                    ><RouterLink to="/archives"
                                        >Archives</RouterLink
                                    ></el-text
                                >
                                &nbsp;&nbsp;
                                <el-text class="mx-1"
                                    ><RouterLink to="/projects"
                                        >Projects</RouterLink
                                    ></el-text
                                >
                                <!--&nbsp;&nbsp;
                                <el-text class="mx-1"
                                    ><RouterLink to="/courses"
                                        >Courses</RouterLink
                                    ></el-text
                                >-->
                                &nbsp;&nbsp;
                                <el-text class="mx-1"
                                    ><RouterLink to="/photos"
                                        >Photos</RouterLink
                                    ></el-text
                                >
                                &nbsp;&nbsp;
                                <el-text class="mx-1"
                                    ><RouterLink to="/about"
                                        >About</RouterLink
                                    ></el-text
                                >
                            </div></el-col
                        >
                        <el-col
                            id="menuBtn"
                            :xs="14"
                            :sm="0"
                            :md="0"
                            :lg="0"
                            :xl="0"
                            ><div style="float: right">
                                <el-button
                                    type="primary"
                                    @click="menuDisplay = !menuDisplay"
                                    >Menu</el-button
                                >
                            </div></el-col
                        >
                    </el-row>
                </div>
            </el-header>
            <el-main style="padding: 0px; margin-top: 50px">
                <transition name="slide"
                    ><div v-if="menuDisplay" class="menu">
                        <el-text class="mx-1"
                            ><a @click="goToPage('/')">Home</a></el-text
                        >
                        <br />
                        <div class="box" />
                        <el-text class="mx-1"
                            ><a @click="goToPage('/news')">News</a></el-text
                        >
                        <br />
                        <div class="box" />
                        <el-text class="mx-1"
                            ><a @click="goToPage('/archives')"
                                >Archives</a
                            ></el-text
                        >
                        <br />
                        <div class="box" />
                        <el-text class="mx-1"
                            ><a @click="goToPage('/projects')"
                                >Projects</a
                            ></el-text
                        >
                        <!--<br />
                        <div class="box" />
                        <el-text class="mx-1"
                            ><a @click="goToPage('/courses')"
                                >Courses</a
                            ></el-text
                        >-->
                        <br />
                        <div class="box" />
                        <el-text class="mx-1"
                            ><a @click="goToPage('/photos')">Photos</a></el-text
                        >
                        <br />
                        <div class="box" />
                        <el-text class="mx-1"
                            ><a @click="goToPage('/about')">About</a></el-text
                        >
                    </div></transition
                >
                <div
                    v-if="musicDisplay"
                    style="margin-left: 10px; margin-right: 10px">
                    <iframe
                        auto="1"
                        frameborder="no"
                        width="100%"
                        height="79"
                        :src="`https://music.163.com/outchain/player?type=2&id=${musicId}&auto=1&height=66`"></iframe>
                    <a
                        href="javascript:void(0)"
                        style="margin-left: 10px"
                        @click="musicDisplay = false"
                        ><el-text
                            class="mx-1"
                            size="small"
                            style="color: #003b4f"
                            ><el-icon><CircleCloseFilled /></el-icon
                            >&nbsp;Close</el-text
                        ></a
                    >
                </div>
                <div style="padding: 20px">
                    <router-view v-slot="{ Component }">
                        <keep-alive
                            include="Home,News,Archives,Projects,Photos">
                            <component :is="Component" />
                        </keep-alive>
                    </router-view>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
}
.header {
    background: linear-gradient(to right, #02364b, #044054, #021f31);
    box-shadow: 0px 0px 3px 0.1px rgba(0, 0, 0, 0.5);
}
.slide-enter-active,
.slide-leave-active {
    transition: all 0.15s ease;
}
.slide-enter-from,
.slide-leave-to {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
}
.slide-enter-to,
.slide-leave-from {
    opacity: 1;
}
.menu {
    width: 100%;
    padding: 20px;
    background: #044054;
    overflow: hidden;
}
.box {
    height: 5px;
}
@media print {
    #menuCol {
        margin-top: -19px;
    }
    #menuBtn {
        display: none !important;
    }
}
.fixed-top {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
}
</style>
