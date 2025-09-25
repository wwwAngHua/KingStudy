<script setup lang="ts">
import { ref } from 'vue'
import think from '../../assets/think.svg'
import network from '../../assets/network.svg'
import link from '../../assets/link.svg'
import send from '../../assets/send.svg'

const textarea = ref('')

const thinkType = ref('info')
const networkType = ref('info')

const onThink = () => {
    if (thinkType.value == 'info') {
        thinkType.value = 'primary'
    } else {
        thinkType.value = 'info'
    }
}

const onNetwork = () => {
    if (networkType.value == 'info') {
        networkType.value = 'primary'
    } else {
        networkType.value = 'info'
    }
}
</script>

<template>
    <div style="width: 100%; height: 85vh">
        <div
            style="
                width: 100%;
                height: 85vh;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                gap: 10px;
            ">
            <el-text class="mx-1" size="large" style="color: black"
                ><strong>我是 DeepSeek，很高兴见到你！</strong></el-text
            >
            <el-text class="mx-1"
                >我可以帮你写代码、读文件、写作各种创意内容，请把你的任务交给我吧~</el-text
            >
            <el-card
                style="
                    width: 700px;
                    background-color: #f3f5f9;
                    border-radius: 10px;
                "
                shadow="never">
                <textarea
                    v-model="textarea"
                    class="input"
                    placeholder="给 DeepSeek 发送消息" />
                <div
                    style="
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        gap: 10px;
                    ">
                    <a href="javascript:void(0);">
                        <el-tag
                            :type="thinkType"
                            round
                            @click="onThink"
                            :effect="thinkType != 'info' ? 'plain' : 'light'">
                            <div style="display: flex; justify-content: center">
                                <img :src="think" style="width: 15px" />
                                <el-text
                                    class="mx-1"
                                    size="small"
                                    style="color: black"
                                    >&nbsp;深度思考</el-text
                                >
                            </div>
                        </el-tag>
                    </a>
                    <a href="javascript:void(0);">
                        <el-tag
                            :type="networkType"
                            round
                            @click="onNetwork"
                            :effect="networkType != 'info' ? 'plain' : 'light'">
                            <div style="display: flex; justify-content: center">
                                <img :src="network" style="width: 15px" />
                                <el-text
                                    class="mx-1"
                                    size="small"
                                    style="color: black"
                                    >&nbsp;联网搜索</el-text
                                >
                            </div>
                        </el-tag>
                    </a>
                    <div
                        style="
                            margin-left: auto;
                            display: flex;
                            justify-content: center;
                            gap: 10px;
                        ">
                        <img :src="link" style="width: 13px" />
                        <el-button size="small" round
                            ><img
                                :src="send"
                                style="width: 10px"
                                :disabled="textarea == ''"
                        /></el-button>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<style scoped>
.input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    resize: none;
    overflow: hidden;
    color: inherit;
    font-family: inherit;
    font-size: 15px;
}
</style>
