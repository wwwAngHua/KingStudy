<script setup lang="ts">
import { ref } from 'vue'
import { T1YClient } from '../../api/t1y'
import { ElMessage, ElMessageBox } from 'element-plus'

const code = ref('')
const loading = ref(false)

const getAuthTokenStatus = async () => {
    if (code.value.length != 32) {
        ElMessage.info('请输入有效的 AUTH_TOKEN！')
    } else {
        loading.value = true
        T1YClient.get_auth_token_status(code.value).then((res: any) => {
            loading.value = false
            ElMessageBox.alert(res, '查询结果', {
                confirmButtonText: 'OK',
            })
        })
    }
}
</script>

<template>
    <div>
        <el-text class="mx-1" style="color: black">JSXpress</el-text>
        <br />
        <el-text class="mx-1" size="small"
            >这是一个从 T1 后端云云函数独立出来的 Web 服务器系统（类似
            Nginx、Apache）。采用 Go 语言开发，系统镜像仅
            <span style="color: white; background-color: black">34.54 MB</span>
            ！<br />
            它能完美的运行在任何配置&操作系统的计算机中，例如：树莓派、服务器、个人计算机。它不仅仅拥有普通
            Web 服务器的功能，更重要的是您可以使用它来创建无数个和 T1
            后端云一样的云函数运行环境！</el-text
        >
        <br />
        <el-text class="mx-1" size="small"
            >注意：该系统镜像需获得授权，详细文档请跳转至&nbsp;</el-text
        >
        <a href="https://hub.docker.com/r/wwwanghua/jsxpress" target="_blank"
            ><el-text class="mx-1" size="small" style="color: #003b4f"
                >Docker Hub&nbsp;<el-icon><Right /></el-icon></el-text
        ></a>
        <br /><br />
        <el-input
            v-model="code"
            size="small"
            placeholder="YOUR_AUTH_TOKEN"
            style="width: 240px" />
        &nbsp;
        <el-button
            type="primary"
            size="small"
            :loading="loading"
            @click="getAuthTokenStatus"
            >查询</el-button
        >
        <br /><br />
        <pre>
<span style="color: green;">~ docker</span> pull wwwanghua/jsxpress
<span style="color: green;">~ docker</span> run --rm -p 8080:8080 -e AUTH_TOKEN=&lt;your_auth_token&gt; wwwanghua/jsxpress
<span style="color: green;">
      _  _______   _______                   
     | |/ ____\ \ / /  __ \                  
     | | (___  \ V /| |__) | __ ___  ___ ___ 
 _   | |\___ \  > < |  ___/ '__/ _ \/ __/ __| 私有云
| |__| |____) |/ . \| |   | | |  __/\__ \__ \ www.t1y.net
 \____/|_____//_/ \_\_|   |_|  \___||___/___/ v1.0.0（授权联系QQ：422584084）
</span>
<span style="color: green;">[JSXpress]</span> <span style="color: blue;">2024/09/13 00:52:23</span> <span style="color: blueviolet;">172.17.0.1</span> <span style="color: green;">GET</span> <span style="color: aquamarine;">/</span>
this is a console message.
<span style="color: green;">Done, Status Code: 200, Latency: 17.765217ms.</span>
<span style="color: green;">[JSXpress]</span> <span style="color: blue;">2024/09/13 00:52:23</span> <span style="color: blueviolet;">172.17.0.1</span> <span style="color: blue;">POST</span> <span style="color: aquamarine;">/login.jsx</span>
username: admin, password: 123456, login successful!
<span style="color: green;">Done, Status Code: 200, Latency: 17.765217ms.</span>
<span style="color: green;">[JSXpress]</span> <span style="color: blue;">2024/09/13 00:52:23</span> <span style="color: blueviolet;">172.17.0.1</span> <span style="color: green;">GET</span> <span style="color: aquamarine;">/user_info.jsx</span>
<span style="color: green;">Done, Status Code: 200, Latency: 17.765217ms.</span>
        </pre>
    </div>
</template>

<style scoped></style>
