<script setup lang="ts">
import { Location, Menu, Document } from '@element-plus/icons-vue'

const handleClose = () => {
  console.log('Submenu closed')
}

const handleOpen = () => {
  console.log('Submenu opened')
}
</script>

<template>
  <div style="height: 100vh; display: flex; flex-direction: column" class="asideBox">
    <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="el-menu-vertical-demo"
      default-active="2"
      style="height: 100%; width: 250px; overflow: auto; align-items: center"
    >
      <h1 style="margin-left: 30px; padding-top: 20px">实验室预约系统</h1>

      <el-menu-item index="1">
        <el-icon><Location /></el-icon>
        <span>首页</span>
      </el-menu-item>

      <el-sub-menu index="2" @open="handleOpen" @close="handleClose">
        <template #title>
          <el-icon><Menu /></el-icon>
          <span>信息管理</span>
        </template>
        <el-menu-item index="2-1">公告信息</el-menu-item>
        <el-menu-item index="2-2">预约信息</el-menu-item>
        <el-menu-item index="2-3">实验室分类</el-menu-item>
        <el-menu-item index="3-3">实验室详情</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="3" @open="handleOpen" @close="handleClose">
        <template #title>
          <el-icon><Document /></el-icon>
          <span>人员管理</span>
        </template>
        <!-- 实现添加教师进来 -->
        <el-menu-item index="3-1">教师管理</el-menu-item>
        <el-menu-item index="3-2">管理员管理</el-menu-item>
        <el-menu-item index="3-3">个人中心 </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>
<style scoped>
* {
  margin: 0px;
  color: aliceblue;
}
</style>
