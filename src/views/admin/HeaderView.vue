<script setup lang="ts">
// 定义接收的 props 参数
import { defineProps } from 'vue'

// 定义参数类型
const props = defineProps({
  title: { type: String, default: '图书馆预约' },
})
</script>

<template>
  <div>
    <h2>{{ title }}</h2>
  </div>
</template>

<style scoped></style>
