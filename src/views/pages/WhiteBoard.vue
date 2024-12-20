<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import TinyWhiteboard from 'tiny-whiteboard'

const type = ref('freedraw')
const container = ref(null)
let app = null // 添加一个全局变量来保存TinyWhiteboard实例
const activeElement = ref(null) // 用于存储当前激活的元素
const selectedElements = ref([]) // 用于存储当前选中的元素
const showStyleEditor = ref(false) // 控制样式编辑器的显示

onMounted(() => {
    app = new TinyWhiteboard({
        container: container.value,
        drawType: type.value,
        state: {
            scrollStep: 0,
        }
    })
    app.on('activeElementChange', element => {
        activeElement.value = element
        if (element) {
            showStyleEditor.value = true
        } else {
            showStyleEditor.value = false
        }
    })
    app.on('multiSelectChange', elements => {
        selectedElements.value = elements
        if (elements.length > 0) {
            showStyleEditor.value = true
        } else {
            showStyleEditor.value = false
        }
    })
})

const setType = (newType) => {
    type.value = newType
    if (app) {
        app.updateCurrentType(newType)
    }
    if (newType === 'selection' && selectedElements.value.length > 0) {
        showStyleEditor.value = true
    } else {
        showStyleEditor.value = false
    }
}

// 样式状态
const style = reactive({
    strokeStyle: '#000000',
    fillStyle: '#FFFFFF',
    lineWidth: 2,
    lineDash: [0],
    globalAlpha: 1
})

const updateStyle = (key, value) => {
    const elements = selectedElements.value.concat(activeElement.value ? [activeElement.value] : [])
    elements.forEach(element => {
        element.style[key] = value
        //app.updateActiveElementStyle(element)
    })
    showStyleEditor.value = true
}
</script>

<template>
    <div>
        <div style="text-align: left;">
            <el-button-group class="ml-4" size="small">
                <el-button link type="primary" @click="setType('selection')"><em>选择</em></el-button>
                <el-button link type="primary" @click="setType('rectangle')"><em>矩形</em></el-button>
                <el-button link type="primary" @click="setType('diamond')"><em>菱形</em></el-button>
                <el-button link type="primary" @click="setType('triangle')"><em>三角形</em></el-button>
                <el-button link type="primary" @click="setType('circle')"><em>圆形</em></el-button>
                <el-button link type="primary" @click="setType('line')"><em>线段</em></el-button>
                <el-button link type="primary" @click="setType('arrow')"><em>箭头</em></el-button>
                <el-button link type="primary" @click="setType('freedraw')"><em>自由画笔</em></el-button>
                <el-button link type="primary" @click="setType('text')"><em>文字</em></el-button>
                <el-button link type="primary" @click="setType('image')" disabled><em>图片</em></el-button>
            </el-button-group>
        </div>
        <div ref="container" style="position: relative; width: 100%; height: 80vh;margin-top: 10px;"></div>
        <el-card v-if="showStyleEditor" shadow="never" style="position: absolute;top: 0;left: 0;margin-top: 130px;margin-left: 20px;">
            <div>
                <div class="color-block">
                    <el-text class="mx-1" size="small">描边颜色：</el-text>
                    <el-color-picker v-model="style.strokeStyle" size="small" @change="(value) => updateStyle('strokeStyle', value)"/>
                </div>
                <div class="color-block">
                    <el-text class="mx-1" size="small">填充颜色：</el-text>
                    <el-color-picker v-model="style.fillStyle" size="small" @change="(value) => updateStyle('fillStyle', value)"/>
                </div>
            </div>
            <div>
                <el-slider v-model="style.lineWidth" size="small" @change="(value) => updateStyle('lineWidth', value)" :min="1" :max="10"/>
            </div>
            <div>
                <el-slider v-model="style.globalAlpha" size="small" @change="(value) => updateStyle('globalAlpha', value)" :min="0" :max="1" :step="0.1"/>
            </div>
        </el-card>
    </div>
</template>

<style scoped>
.color-block {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
</style>