<script setup lang="ts">
import { ref } from 'vue';
import * as XLSX from 'xlsx';
import { ElMessage, ElNotification } from 'element-plus';

// 保存题目的数据
const currentIndex = ref(0);
const questionList = ref<any[]>([]);

// 初始化为空字符串，因为单选题需要一个单一的字符串
const userAnswer = ref<any>('');
const showAnswer = ref(false)

// 根据题目类型动态设置 userAnswer 的类型
const setUserAnswerType = (questionType: string) => {
  if (questionType === '多选题') {
    userAnswer.value = []; // 多选题用数组
  } else {
    userAnswer.value = ''; // 单选题用字符串
  }
};

const showNextButton = ref(false);
const audio = new Audio();

// 上传文件处理函数
const uploadFile = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = e.target?.result as string;
    const workbook = XLSX.read(data, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet);
    
    questionList.value = json.map((item: any) => ({
      question: item['题目'],
      options: [item['选项A'], item['选项B'], item['选项C'], item['选项D']].filter(Boolean),
      correctAnswer: item['正确答案'],
      questionType: item['题目类型']
    }));

    showNextButton.value = true;
  };
  reader.readAsBinaryString(file);
};

// 上传前钩子
const beforeUpload = (file: File) => {
  if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    ElMessage.error('只能上传 Excel 文件');
    return false;
  }
  uploadFile(file);
  return false;  // 阻止 Element Plus 默认上传
};

// 检查答案
const checkAnswer = () => {
  showAnswer.value = false;
  const question = questionList.value[currentIndex.value];
  if (question.questionType === '多选题') {
    if (Array.isArray(userAnswer.value) && userAnswer.value.sort().join(',') === question.correctAnswer.split(',').sort().join(',')) {
      playSound(true);
      //ElMessage.success('答对了！');
      nextQuestion();
    } else {
      playSound(false);
      showAnswer.value = true;
      //ElMessage.error('答错了！');
    }
  } else {
    if (userAnswer.value === question.correctAnswer) {
      playSound(true);
      //ElMessage.success('答对了！');
      nextQuestion();
    } else {
      playSound(false);
      showAnswer.value = true;
      //ElMessage.error('答错了！');
    }
  }
};

// 播放提示音
const playSound = (isCorrect: boolean) => {
  audio.src = isCorrect ? '/audio/right.mp3' : '/audio/wrong.mp3';
  audio.play();
};

// 切换到下一题
const nextQuestion = () => {
  if (currentIndex.value < questionList.value.length - 1) {
    currentIndex.value++;
    setUserAnswerType(questionList.value[currentIndex.value].questionType); // 设置正确的答案类型
  } else {
    ElNotification({
        title: '完结',
        message: '你已完成本章练习，至此我宣布你为新时代卷王！！！',
        type: 'success',
        position: 'bottom-right'
    });
    resetQuiz();
    showNextButton.value = false;
  }
};

// 切换到上一题
const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    setUserAnswerType(questionList.value[currentIndex.value].questionType); // 设置正确的答案类型
  }
};

const resetQuiz = () => {
  currentIndex.value = 0; // 从第一题开始
  setUserAnswerType(questionList.value[currentIndex.value].questionType); // 根据题目类型初始化答案类型
};

const numberToLetter = (num: number): string => {
    if (num < 0 || num > 25) {
        throw new Error("Input must be between 0 and 25.");
    }
    return String.fromCharCode(65 + num);  // 65 是 'A' 的 ASCII 码
}
</script>

<template>
    <div>
        <div>
            <el-text class="mx-1" style="color: black">Hello, I am 王华 👋</el-text>
            <br />
            <el-text class="mx-1" size="small">这里是我开发的临时刷题页面，它可以用来干嘛？自己录制题库或临时抱佛脚？🤓✌️</el-text>
        </div>
        <br />
        <el-upload v-if="!showNextButton"
            drag
            :before-upload="beforeUpload"
            accept=".xlsx">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
            <el-text class="mx-1" size="small">请选择 .xlsx 格式文件 <em>点击上传</em></el-text>
            </div>
            <template #tip>
            <div class="el-upload__tip">
                请上传一个 .xlsx 格式的题库文件，题库模版详见：<a href="/demo.xlsx" target="_blank" style="color: #003B4F;">demo.xlsx</a>
            </div>
            </template>
        </el-upload>
        <div v-if="showNextButton">
            <div v-if="questionList.length > 0">
            <div>
                <el-text class="mx-1" style="display: flex;align-items: center;"><el-tag type="primary" size="small" effect="dark">{{ questionList[currentIndex].questionType }}</el-tag>&nbsp;{{ (currentIndex + 1) + '.' + questionList[currentIndex].question }}</el-text>
                <!-- 根据题目类型动态渲染不同的组件 -->
                <div v-if="questionList[currentIndex].questionType === '单选题'">
                <el-radio-group v-model="userAnswer">
                    <div style="margin-top: 10px;margin-left: 5px;">
                        <el-radio v-for="(option, index) in questionList[currentIndex].options" :key="index" :value="String.fromCharCode(65 + index)" style="display: block;">
                            <span>{{numberToLetter(index) }}</span>.{{ option }}
                        </el-radio>
                    </div>
                </el-radio-group>
                </div>
                <div v-else-if="questionList[currentIndex].questionType === '多选题'">
                <el-checkbox-group v-model="userAnswer">
                    <div style="margin-top: 10px;margin-left: 5px;display: flex;flex-direction: column;">
                        <el-checkbox v-for="(option, index) in questionList[currentIndex].options" :key="index" :value="String.fromCharCode(65 + index)">
                            <span>{{numberToLetter(index) }}</span>.{{ option }}
                        </el-checkbox>
                    </div>
                </el-checkbox-group>
                </div>
                <div v-else-if="questionList[currentIndex].questionType === '判断题'">
                <el-radio-group v-model="userAnswer">
                    <div style="margin-top: 10px;margin-left: 5px;">
                        <el-radio value="A">A.正确</el-radio>
                        <br />
                        <el-radio value="B">B.错误</el-radio>
                    </div>
                </el-radio-group>
                </div>
                <div v-if="showAnswer" style="margin-bottom: 10px;">
                  <el-text class="mx-1" size="small" style="color: red;">答案错误！正确答案为：{{ questionList[currentIndex].correctAnswer }}</el-text>
                </div>
            </div>
            <el-button-group>
                <el-button type="primary" icon="ArrowLeft" @click="prevQuestion" :disabled="currentIndex === 0" size="small" link>上一题</el-button>
                <el-button type="primary" @click="checkAnswer" :disabled="currentIndex === questionList.length" size="small" link>
                下一题<el-icon class="el-icon--right"><ArrowRight /></el-icon>
                </el-button>
            </el-button-group>
            </div>
        </div>
    </div>
</template>  

<style scoped>
</style>
