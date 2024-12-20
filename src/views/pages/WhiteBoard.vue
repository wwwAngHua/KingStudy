<script setup>
import { ref, onMounted } from 'vue'
import TinyWhiteboard from 'tiny-whiteboard'

const type = ref('freedraw')
const container = ref(null)
let app = null // 添加一个全局变量来保存TinyWhiteboard实例

onMounted(() => {
    app = new TinyWhiteboard({
        container: container.value,
        drawType: type.value,
        state: {
            scrollStep: 0,
        }
    })
})

const setType = (newType) => {
    type.value = newType
    if (app) { // 如果app实例存在，更新其drawType
        app.updateCurrentType(newType) // 使用updateCurrentType方法更新绘制类型
    }
}
</script>

<template>
    <div>
        <div style="text-align: center;">
            <el-button-group class="ml-4" size="small">
                <el-button @click="setType('selection')"><icon-drag-arrow />选择</el-button>
                <el-button @click="setType('rectangle')">矩形</el-button>
                <el-button @click="setType('diamond')">菱形</el-button>
                <el-button @click="setType('triangle')">三角形</el-button>
                <el-button @click="setType('circle')">圆形</el-button>
                <el-button @click="setType('line')">线段</el-button>
                <el-button @click="setType('arrow')">箭头</el-button>
                <el-button @click="setType('freedraw')">自由画笔</el-button>
                <el-button @click="setType('text')">文字</el-button>
                <el-button @click="setType('image')">图片</el-button>
            </el-button-group>
        </div>
        <div ref="container" style="position: relative; width: 100%; height: 80vh;margin-top: 10px;"></div>
    </div>
</template>

<style scoped></style>