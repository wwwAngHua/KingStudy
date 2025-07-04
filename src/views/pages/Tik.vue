<script setup lang="ts">
import { ref } from 'vue'
// 打乱单选题选项顺序开关，默认开启
const shuffleSingleChoice = ref(true)

// Fisher-Yates 洗牌算法
function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}
import * as XLSX from 'xlsx'
import { ElMessage, ElNotification } from 'element-plus'
import { T1YClient } from '../../api/t1y.ts'

// Gamepad 支持
import { onMounted, onUnmounted } from 'vue'

// 手柄相关状态
const gamepadIndex = ref<number | null>(null)
let gamepadRafId: number | null = null
let lastButtonStates: boolean[] = []

// 选项聚焦索引
const focusedOption = ref(0)

// 是否有手柄连接
const isGamepadConnected = ref(false)

// 监听 gamepad 连接
const onGamepadConnected = (e: GamepadEvent) => {
    gamepadIndex.value = e.gamepad.index
    isGamepadConnected.value = true
    startGamepadPolling()
}
const onGamepadDisconnected = (e: GamepadEvent) => {
    if (gamepadIndex.value === e.gamepad.index) {
        gamepadIndex.value = null
        isGamepadConnected.value = false
        stopGamepadPolling()
    }
}

function startGamepadPolling() {
    if (gamepadRafId !== null) return
    const poll = () => {
        const gamepads = navigator.getGamepads()
        const gp =
            gamepadIndex.value !== null ? gamepads[gamepadIndex.value] : null
        if (gp) {
            handleGamepadInput(gp)
        }
        gamepadRafId = requestAnimationFrame(poll)
    }
    poll()
}
function stopGamepadPolling() {
    if (gamepadRafId !== null) {
        cancelAnimationFrame(gamepadRafId)
        gamepadRafId = null
    }
}

// Switch Pro 手柄按键映射
// 0: B（确认/确定），1: A（返回/上一题），2: Y（AI 解析），3: X（确认/确定）
function handleGamepadInput(gp: Gamepad) {
    const btns = gp.buttons.map((b) => b.pressed)
    if (!lastButtonStates.length) lastButtonStates = btns.slice()

    // 选项切换（上下/左右）
    if (
        (btns[12] && !lastButtonStates[12]) ||
        (btns[14] && !lastButtonStates[14])
    ) {
        moveFocus(-1)
    }
    if (
        (btns[13] && !lastButtonStates[13]) ||
        (btns[15] && !lastButtonStates[15])
    ) {
        moveFocus(1)
    }
    // B(0) 或 X(3)：选择/下一题
    if (
        (btns[0] && !lastButtonStates[0]) ||
        (btns[3] && !lastButtonStates[3])
    ) {
        selectFocusedOption()
    }
    // A(1)：上一题
    if (btns[1] && !lastButtonStates[1]) {
        prevQuestion()
    }
    // Y(2)：AI 解析
    if (btns[2] && !lastButtonStates[2]) {
        aiAnalysis()
    }
    lastButtonStates = btns.slice()
}

function moveFocus(delta: number) {
    if (!showNextButton.value || !questionList.value.length) return
    const q = questionList.value[currentIndex.value]
    if (q.questionType === '单选题' || q.questionType === '多选题') {
        const optLen = q.options.length
        focusedOption.value = (focusedOption.value + delta + optLen) % optLen
    }
}

function selectFocusedOption() {
    if (!showNextButton.value || !questionList.value.length) return
    const q = questionList.value[currentIndex.value]
    if (q.questionType === '单选题') {
        userAnswer.value = String.fromCharCode(65 + focusedOption.value)
        checkAnswer()
    } else if (q.questionType === '多选题') {
        const letter = String.fromCharCode(65 + focusedOption.value)
        const idx = userAnswer.value.indexOf(letter)
        if (idx === -1) {
            userAnswer.value.push(letter)
        } else {
            userAnswer.value.splice(idx, 1)
        }
    } else if (q.questionType === '判断题') {
        // 0:A(正确), 1:B(错误)
        userAnswer.value = focusedOption.value === 0 ? 'A' : 'B'
        checkAnswer()
    }
}

// 题目切换时重置聚焦
function resetFocus() {
    focusedOption.value = 0
}

onMounted(() => {
    window.addEventListener('gamepadconnected', onGamepadConnected)
    window.addEventListener('gamepaddisconnected', onGamepadDisconnected)
    // 检查页面加载时是否已连接手柄
    const pads = navigator.getGamepads()
    if (pads && Array.from(pads).some((p) => p)) {
        isGamepadConnected.value = true
    }
})
onUnmounted(() => {
    window.removeEventListener('gamepadconnected', onGamepadConnected)
    window.removeEventListener('gamepaddisconnected', onGamepadDisconnected)
    stopGamepadPolling()
})

const drawer = ref(false)
const loading = ref(true)

const aiAnalysisText = ref('')

// 保存题目的数据
const currentIndex = ref(0)
const questionList = ref<any[]>([])

// 初始化为空字符串，因为单选题需要一个单一的字符串
const userAnswer = ref<any>('')
const showAnswer = ref(false)

// 根据题目类型动态设置 userAnswer 的类型
const setUserAnswerType = (questionType: string) => {
    if (questionType === '多选题') {
        userAnswer.value = [] // 多选题用数组
    } else {
        userAnswer.value = '' // 单选题用字符串
    }
}

const showNextButton = ref(false)
const audio = new Audio()

// 上传文件处理函数
const uploadFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
        const data = e.target?.result as string
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(worksheet)

        questionList.value = json.map((item: any) => {
            let options = [
                item['选项A'],
                item['选项B'],
                item['选项C'],
                item['选项D'],
            ].filter(Boolean)
            let correctAnswer = item['正确答案']
            // 只对单选题打乱
            if (item['题目类型'] === '单选题' && shuffleSingleChoice.value) {
                // 记录原始选项和字母
                const optionWithLetter = options.map((opt, idx) => ({
                    letter: String.fromCharCode(65 + idx),
                    value: opt,
                }))
                // 找到正确答案的原始字母
                const correctLetter = correctAnswer.trim()
                // 取出正确答案内容
                const correctOption = optionWithLetter.find(
                    (o) => o.letter === correctLetter,
                )
                // 打乱
                const shuffled = shuffleArray([...optionWithLetter])
                // 新的options
                options = shuffled.map((o) => o.value)
                // 新的正确答案字母
                const newIndex = shuffled.findIndex(
                    (o) => o.value === correctOption?.value,
                )
                correctAnswer = String.fromCharCode(65 + newIndex)
            }
            return {
                question: item['题目'],
                options,
                correctAnswer,
                questionType: item['题目类型'],
            }
        })

        showNextButton.value = true
    }
    reader.readAsBinaryString(file)
}

// 上传前钩子
const beforeUpload = (file: File) => {
    if (
        file.type !==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
        ElMessage.error('只能上传 Excel 文件')
        return false
    }
    uploadFile(file)
    return false // 阻止 Element Plus 默认上传
}

// 检查答案
const checkAnswer = () => {
    showAnswer.value = false
    const question = questionList.value[currentIndex.value]
    if (question.questionType === '多选题') {
        if (
            Array.isArray(userAnswer.value) &&
            userAnswer.value.sort().join(',') ===
                question.correctAnswer.split(',').sort().join(',')
        ) {
            playSound(true)
            //ElMessage.success('答对了！');
            nextQuestion()
        } else {
            playSound(false)
            showAnswer.value = true
            //ElMessage.error('答错了！');
        }
    } else {
        if (userAnswer.value === question.correctAnswer) {
            playSound(true)
            //ElMessage.success('答对了！');
            nextQuestion()
        } else {
            playSound(false)
            showAnswer.value = true
            //ElMessage.error('答错了！');
        }
    }
}

// 播放提示音
const playSound = (isCorrect: boolean) => {
    audio.src = isCorrect ? '/audio/right.mp3' : '/audio/wrong.mp3'
    audio.play()
}

// 切换到下一题
const nextQuestion = () => {
    aiAnalysisText.value = ''
    loading.value = true
    if (currentIndex.value < questionList.value.length - 1) {
        currentIndex.value++
        setUserAnswerType(questionList.value[currentIndex.value].questionType) // 设置正确的答案类型
        resetFocus()
    } else {
        ElNotification({
            title: '完结',
            message: '你已完成本章练习，至此我宣布你为新时代卷王！！！',
            type: 'success',
            position: 'bottom-right',
        })
        resetQuiz()
        showNextButton.value = false
    }
}

// 切换到上一题
const prevQuestion = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--
        setUserAnswerType(questionList.value[currentIndex.value].questionType) // 设置正确的答案类型
        resetFocus()
    }
}

const resetQuiz = () => {
    currentIndex.value = 0 // 从第一题开始
    setUserAnswerType(questionList.value[currentIndex.value].questionType) // 根据题目类型初始化答案类型
    resetFocus()
}

const numberToLetter = (num: number): string => {
    if (num < 0 || num > 25) {
        throw new Error('Input must be between 0 and 25.')
    }
    return String.fromCharCode(65 + num) // 65 是 'A' 的 ASCII 码
}

const aiAnalysis = () => {
    drawer.value = true
    if (aiAnalysisText.value == '') {
        T1YClient.callFunc(
            'ai_analysis',
            questionList.value[currentIndex.value],
        ).then((res: any) => {
            if (res.code == 200) {
                aiAnalysisText.value = res.data.content
            }
            loading.value = false
        })
    }
}
</script>

<template>
    <div>
        <div>
            <el-text class="mx-1" style="color: black"
                >Hello, I am 王华 👋</el-text
            >
            <br />
            <el-text class="mx-1" size="small"
                >这里是我开发的临时刷题页面，它可以用来干嘛？自己录制题库或临时抱佛脚？🤓✌️</el-text
            >
        </div>
        <div v-if="!showNextButton">
            <el-switch
                v-model="shuffleSingleChoice"
                active-text="😭"
                inactive-text="😁"
                style="margin-bottom: 10px" />
            <br />
            <el-upload drag :before-upload="beforeUpload" accept=".xlsx">
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                    <el-text class="mx-1" size="small"
                        >请选择 .xlsx 格式文件 <em>点击上传</em></el-text
                    >
                </div>
                <template #tip>
                    <div class="el-upload__tip">
                        请上传一个 .xlsx 格式的题库文件，题库模版详见：<a
                            href="/demo.xlsx"
                            target="_blank"
                            style="color: #003b4f"
                            >demo.xlsx</a
                        >
                    </div>
                </template>
            </el-upload>
        </div>
        <div v-if="showNextButton">
            <div v-if="questionList.length > 0">
                <div>
                    <el-divider border-style="dashed" />
                    <el-text
                        class="mx-1"
                        style="display: flex; align-items: center"
                        :size="isGamepadConnected ? 'large' : 'default'">
                        <el-tag
                            type="primary"
                            :size="isGamepadConnected ? 'large' : 'small'"
                            effect="dark">
                            {{ questionList[currentIndex].questionType }}
                        </el-tag>
                        &nbsp;{{ currentIndex + 1 + '.' }}
                        <span
                            v-html="questionList[currentIndex].question"></span>
                    </el-text>
                    <!-- 根据题目类型动态渲染不同的组件 -->
                    <div
                        v-if="
                            questionList[currentIndex].questionType === '单选题'
                        ">
                        <el-radio-group v-model="userAnswer">
                            <div style="margin-top: 10px; margin-left: 5px">
                                <el-radio
                                    v-for="(option, index) in questionList[
                                        currentIndex
                                    ].options"
                                    :key="index"
                                    :value="String.fromCharCode(65 + index)"
                                    style="display: block"
                                    :class="{
                                        'gamepad-focused':
                                            isGamepadConnected &&
                                            focusedOption === index,
                                    }"
                                    :size="
                                        isGamepadConnected ? 'large' : undefined
                                    ">
                                    <span>{{ numberToLetter(index) }}</span
                                    >.<span v-html="option"></span>
                                    <span
                                        v-if="
                                            isGamepadConnected &&
                                            focusedOption === index
                                        "
                                        style="
                                            color: #409eff;
                                            margin-left: 8px;
                                            font-size: 12px;
                                        "
                                        >🎮</span
                                    >
                                </el-radio>
                            </div>
                        </el-radio-group>
                    </div>
                    <div
                        v-else-if="
                            questionList[currentIndex].questionType === '多选题'
                        ">
                        <el-checkbox-group v-model="userAnswer">
                            <div
                                style="
                                    margin-top: 10px;
                                    margin-left: 5px;
                                    display: flex;
                                    flex-direction: column;
                                ">
                                <el-checkbox
                                    v-for="(option, index) in questionList[
                                        currentIndex
                                    ].options"
                                    :key="index"
                                    :value="String.fromCharCode(65 + index)"
                                    :class="{
                                        'gamepad-focused':
                                            isGamepadConnected &&
                                            focusedOption === index,
                                    }"
                                    :size="
                                        isGamepadConnected ? 'large' : undefined
                                    ">
                                    <span>{{ numberToLetter(index) }}</span
                                    >.<span v-html="option"></span>
                                    <span
                                        v-if="
                                            isGamepadConnected &&
                                            focusedOption === index
                                        "
                                        style="
                                            color: #409eff;
                                            margin-left: 8px;
                                            font-size: 12px;
                                        "
                                        >🎮</span
                                    >
                                </el-checkbox>
                            </div>
                        </el-checkbox-group>
                    </div>
                    <div
                        v-else-if="
                            questionList[currentIndex].questionType === '判断题'
                        ">
                        <el-radio-group v-model="userAnswer">
                            <div style="margin-top: 10px; margin-left: 5px">
                                <el-radio
                                    value="A"
                                    :class="{
                                        'gamepad-focused':
                                            isGamepadConnected &&
                                            focusedOption === 0,
                                    }"
                                    :size="
                                        isGamepadConnected ? 'large' : undefined
                                    ">
                                    A.正确
                                    <span
                                        v-if="
                                            isGamepadConnected &&
                                            focusedOption === 0
                                        "
                                        style="
                                            color: #409eff;
                                            margin-left: 8px;
                                            font-size: 12px;
                                        "
                                        >🎮</span
                                    >
                                </el-radio>
                                <br />
                                <el-radio
                                    value="B"
                                    :class="{
                                        'gamepad-focused':
                                            isGamepadConnected &&
                                            focusedOption === 1,
                                    }"
                                    :size="
                                        isGamepadConnected ? 'large' : undefined
                                    ">
                                    B.错误
                                    <span
                                        v-if="
                                            isGamepadConnected &&
                                            focusedOption === 1
                                        "
                                        style="
                                            color: #409eff;
                                            margin-left: 8px;
                                            font-size: 12px;
                                        "
                                        >🎮</span
                                    >
                                </el-radio>
                            </div>
                        </el-radio-group>
                    </div>
                    <div v-if="showAnswer" style="margin-bottom: 10px">
                        <el-text
                            class="mx-1"
                            :size="isGamepadConnected ? 'large' : 'small'"
                            style="color: red">
                            答案错误！正确答案为：{{
                                questionList[currentIndex].correctAnswer
                            }}
                        </el-text>
                    </div>
                </div>
                <el-button-group>
                    <el-button
                        type="primary"
                        icon="ArrowLeft"
                        @click="prevQuestion"
                        :disabled="currentIndex === 0"
                        link
                        :size="isGamepadConnected ? 'large' : undefined"
                        >上一题</el-button
                    >
                    <el-button
                        type="primary"
                        link
                        @click="aiAnalysis"
                        :size="isGamepadConnected ? 'large' : undefined"
                        >AI 解析</el-button
                    >
                    <el-button
                        type="primary"
                        @click="checkAnswer"
                        :disabled="currentIndex === questionList.length"
                        link
                        :size="isGamepadConnected ? 'large' : undefined">
                        下一题<el-icon class="el-icon--right"
                            ><ArrowRight
                        /></el-icon>
                    </el-button>
                </el-button-group>
            </div>
        </div>
        <el-drawer v-model="drawer" title="AI 解析" direction="btt" size="50%">
            <el-skeleton v-if="loading" :rows="3" animated />
            <small v-if="!loading">
                <v-md-preview :text="aiAnalysisText"></v-md-preview>
            </small>
        </el-drawer>
    </div>
</template>

<style scoped></style>

<style scoped>
.gamepad-focused {
    background: #e6f7ff !important;
    border-radius: 6px;
    transition: background 0.2s;
}
</style>
