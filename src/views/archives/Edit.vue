<script setup lang="ts">
import { ref } from 'vue'
import { T1YClient } from '../../api/t1y.ts'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MD5 } from 'crypto-js'
import { useRoute } from 'vue-router'
import aiSvg from '../../assets/ai_write.svg'

const loading = ref(true)

const objectId = useRoute().params.pathMatch[0]

const text = ref('')

interface Archive {
    _id: string
    preview: string
    views: number
    title: string
    tag: string[]
    description: string
    content: string
    createdAt: string
}

const archives = ref<Archive>({
    _id: objectId,
    preview: '',
    views: 0,
    title: '',
    tag: [],
    description: '',
    content: '',
    createdAt: '',
})

const getPost = async () => {
    T1YClient.findOne('archives', objectId).then((res: any) => {
        archives.value = res.data.data
        document.title = archives.value.title + ' - KingStudy'
        text.value = archives.value.content
        loading.value = false
    })
}

const editArchive = async () => {
    if (text.value != '') {
        ElMessageBox.prompt(
            'Please enter the administrator password to modify the post.',
            'Authentication',
            {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                inputPattern: /^.{6,16}$/,
                inputErrorMessage: 'Password length is 6 to 16 characters.',
            },
        )
            .then(async ({ value }) => {
                T1YClient.callFunc(
                    `edit?id=${objectId}&token=${MD5(value).toString()}`,
                    {
                        content: text.value,
                    },
                ).then((res: any) => {
                    if (res.code != 200) {
                        ElMessage.error(res.message)
                    } else {
                        ElMessage.success(res.message)
                    }
                })
            })
            .catch(() => {})
    }
}

const aiWrite = async () => {
    ElMessageBox.prompt(
        'Please enter the article title and let AI help you complete the article.',
        'AI writing',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            async beforeClose(action, instance, done) {
                if (action === 'confirm') {
                    instance.confirmButtonLoading = true
                    instance.confirmButtonText = 'Writing...'
                    try {
                        const value = instance.inputValue as string
                        const res = (await T1YClient.callFunc('ai_write', {
                            title: value,
                        })) as {
                            code: number
                            message: string
                            data: { content: string }
                        }
                        if (res.code !== 200) {
                            ElMessage.error(res.message)
                            instance.confirmButtonLoading = false
                            instance.confirmButtonText = 'OK'
                        } else {
                            text.value = res.data.content
                            ElMessage.success(res.message)
                            done()
                        }
                    } catch (error) {
                        ElMessage.error('Request failed')
                        instance.confirmButtonLoading = false
                        instance.confirmButtonText = 'OK'
                    }
                } else {
                    done()
                }
            },
        },
    ).catch(() => {})
}

getPost()
</script>

<template>
    <div>
        <el-skeleton v-if="loading" :rows="10" animated />
        <div v-else>
            <el-row>
                <el-col :span="16"
                    ><div>
                        <el-text class="mx-1" style="color: black"
                            >Modify Post</el-text
                        >
                        <br />
                        <el-text class="mx-1" size="small"
                            >Here you can edit the content of this post. This
                            requires administrator privileges!</el-text
                        >
                    </div></el-col
                >
                <el-col :span="8"
                    ><div
                        style="
                            display: flex;
                            align-items: center;
                            float: right;
                        ">
                        <el-button type="primary" @click="aiWrite"
                            ><img :src="aiSvg"
                        /></el-button>
                        <el-button type="primary" @click="editArchive"
                            >Submit</el-button
                        >
                    </div></el-col
                >
            </el-row>
            <br /><br />
            <v-md-editor v-model="text" height="400px"></v-md-editor>
        </div>
    </div>
</template>

<style scoped></style>
