<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import { initTheme } from './theme/theme'
initTheme()
</script>

<template>
    <div class="container">
        <el-container>
            <el-header class="header">
                <div>
                    <el-row style="padding-top: 15px">
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
                        <el-col :span="14"
                            ><div style="float: right">
                                <el-text class="mx-1"
                                    ><RouterLink to="/"
                                        >Home</RouterLink
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
                                &nbsp;&nbsp;
                                <el-text class="mx-1"
                                    ><RouterLink to="/courses"
                                        >Courses</RouterLink
                                    ></el-text
                                >
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
                    </el-row>
                </div>
            </el-header>
            <el-main>
                <router-view></router-view>
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
</style>
