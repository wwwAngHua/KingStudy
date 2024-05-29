<script setup lang="ts">
import Photo from '../../components/Photo.vue'
</script>

<template>
    <div>
        <el-text class="mx-1" style="color: black">Photos</el-text>
        <br />
        <el-text class="mx-1" size="small"
            >Below is a selection of my photography.
            <span style="color: #003b4f"
                >They are free and you can use them however you want!</span
            ></el-text
        >
        <br /><br />
        <Photo />
    </div>
</template>

<style scoped></style>
