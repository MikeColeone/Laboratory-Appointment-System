<script setup lang="ts">
import AdminDashboard from './AdminDashboard.vue'
import AsideView from './AsideView.vue'
</script>
<template>
  <div class="common-layout">
    <el-container>
      <el-aside><AsideView /></el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main><AdminDashboard></AdminDashboard></el-main>
      </el-container>
    </el-container>
  </div>
</template>
