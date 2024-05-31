<script setup lang="ts">
import { ref } from 'vue'
import { T1YClient } from '../../api/t1y.ts'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MD5 } from 'crypto-js'

const loading = ref(false)

interface Archive {
    preview: string
    views: number
    title: string
    tag: string[]
    description: string
    content: string
}

const text = ref('')
const archive = ref<Archive>({
    preview: 'https://api.t1y.net/storage/1500/photos/archives/',
    views: 0,
    title: 'Title',
    tag: [],
    description: '',
    content: '',
})

const shareArchive = async () => {
    if (text.value != '') {
        ElMessageBox.prompt(
            'Please enter the correct administrator password to share the post.',
            'Authentication',
            {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                inputPattern: /^.{6,16}$/,
                inputErrorMessage: 'Password length is 6 to 16 characters.',
            },
        )
            .then(async ({ value }) => {
                loading.value = true
                archive.value.content = text.value
                T1YClient.callFunc(
                    `share?token=${MD5(value).toString()}`,
                    archive.value,
                ).then((res: any) => {
                    if (res.code != 200) {
                        ElMessage.error(res.message)
                    } else {
                        ElMessage.success(res.message)
                    }
                    loading.value = false
                })
            })
            .catch(() => {})
    }
}
</script>

<template>
    <div>
        <el-row>
            <el-col :span="16"
                ><div>
                    <el-text class="mx-1" style="color: black"
                        >Add New Post to Archives</el-text
                    >
                    <br />
                    <el-text class="mx-1" size="small"
                        >Here you can add a new post to the archive. This
                        requires administrator privileges!</el-text
                    >
                </div></el-col
            >
            <el-col :span="8"
                ><div style="display: flex; align-items: center; float: right">
                    <el-button
                        type="primary"
                        :loading="loading"
                        @click="shareArchive"
                        >Submit</el-button
                    >
                </div></el-col
            >
        </el-row>
        <br /><br />
        <v-md-editor v-model="text" height="400px"></v-md-editor>
    </div>
</template>

<style scoped></style>
