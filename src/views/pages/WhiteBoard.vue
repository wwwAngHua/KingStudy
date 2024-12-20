<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import TinyWhiteboard from 'tiny-whiteboard'

// 定义工具类型
const type = ref<'freedraw' | 'selection' | 'rectangle' | 'diamond' | 'triangle' | 'circle' | 'line' | 'arrow' | 'text' | 'image'>('freedraw')
const container = ref<HTMLElement | null>(null)
let app: InstanceType<typeof TinyWhiteboard> | null = null // 用 InstanceType 获取 TinyWhiteboard 的实例类型

// 用于存储当前激活的元素和选中的元素
const activeElement = ref<any | null>(null)
const selectedElements = ref<any[]>([])

// 控制样式编辑器的显示
const showStyleEditor = ref<boolean>(false)

onMounted(() => {
    app = new TinyWhiteboard({
        container: container.value as HTMLElement, // 强制类型转换为 HTMLElement
        drawType: type.value,
        state: {
            scrollStep: 0,
        }
    })

    // 设置 activeElementChange 事件的监听
    app.on('activeElementChange', (element: any) => {
        activeElement.value = element
        showStyleEditor.value = !!element
    })

    // 设置 multiSelectChange 事件的监听
    app.on('multiSelectChange', (elements: any[]) => {
        selectedElements.value = elements
        showStyleEditor.value = elements.length > 0
    })
})

// 更新画板工具类型
const setType = (newType: 'freedraw' | 'selection' | 'rectangle' | 'diamond' | 'triangle' | 'circle' | 'line' | 'arrow' | 'text' | 'image'): void => {
    type.value = newType
    if (app) {
        app.updateCurrentType(newType)
    }
    showStyleEditor.value = (newType === 'selection' && selectedElements.value.length > 0)
}

// 样式状态
const style = reactive({
    strokeStyle: '#000000',
    fillStyle: '#FFFFFF',
    lineWidth: 2,
    lineDash: [0],
    globalAlpha: 1
})

// 更新选中元素的样式
const updateStyle = (key: keyof typeof style, value: string | number | (string | number)[]): void => {
    const elements = selectedElements.value.concat(activeElement.value ? [activeElement.value] : [])
    elements.forEach(element => {
        element.style[key] = value
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
                    <el-color-picker v-model="style.strokeStyle" size="small" @change="(value: string) => updateStyle('strokeStyle', value)"/>
                </div>
                <div class="color-block">
                    <el-text class="mx-1" size="small">填充颜色：</el-text>
                    <el-color-picker v-model="style.fillStyle" size="small" @change="(value: string) => updateStyle('fillStyle', value)"/>
                </div>
            </div>
            <div>
                <el-slider v-model="style.lineWidth" size="small" @change="(value: number) => updateStyle('lineWidth', value)" :min="1" :max="10"/>
            </div>
            <div>
                <el-slider v-model="style.globalAlpha" size="small" @change="(value: number) => updateStyle('globalAlpha', value)" :min="0" :max="1" :step="0.1"/>
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