<script setup lang="ts">
import { ref } from 'vue'
import { T1YClient } from '../../api/t1y.ts'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MD5 } from 'crypto-js'
import wwwanghua from '../../assets/wwwanghua.jpg'
import { useRoute } from 'vue-router'
const route = useRoute()

const param = route.params.pathMatch[0]

const loading = ref(false)
const vLoading = ref(true)
const editing = ref(false)

const text = ref('')

const getTempNotes = async () => {
    T1YClient.get_temp_notes(param).then((res: any) => {
        text.value = res
        vLoading.value = false
        editing.value = res == ''
    })
}

const saveNote = async () => {
    if (editing.value) {
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
                    T1YClient.callFunc(`note?token=${MD5(value).toString()}`, {
                        name: param,
                        content: text.value,
                    }).then((res: any) => {
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
    } else {
        editing.value = true
    }
}

getTempNotes()
</script>

<template>
    <div>
        <el-row>
            <el-col :span="16"
                ><div>
                    <el-text class="mx-1" style="color: black"
                        >Hello, I am 王华 👋</el-text
                    >
                    <br />
                    <el-text class="mx-1" size="small"
                        >这里是我的临时笔记存放处，用于临时记录某些东西，例如：课堂学习笔记。</el-text
                    >
                </div></el-col
            >
            <el-col :span="8"
                ><div style="display: flex; align-items: center; float: right">
                    <el-avatar :size="30" :src="wwwanghua" />
                    &nbsp;&nbsp;&nbsp;
                    <el-button
                        type="primary"
                        :loading="loading"
                        @click="saveNote"
                        >{{ editing ? 'Save' : 'Edit' }}</el-button
                    >
                </div></el-col
            >
        </el-row>
        <el-divider border-style="dashed" />
        <el-skeleton v-if="vLoading" :rows="10" animated />
        <div v-if="!editing">
            <small>
                <v-md-preview :text="text"></v-md-preview>
            </small>
        </div>
        <div v-if="editing">
            <v-md-editor v-model="text" height="400px"></v-md-editor>
        </div>
        <el-divider border-style="dashed" />
        <el-text class="mx-1" style="color: black;"><strong>Copyright Notice:</strong> This article is original content owned by <a href="https://www.kingstudy.vip/" target="_blank" style="color: #0366D6;">kingstudy.vip</a> Unauthorized reproduction, citation, or commercial use is prohibited. For permissions or collaborations, please contact the author and credit the original source.</el-text>
    </div>
</template>

<style scoped></style>
