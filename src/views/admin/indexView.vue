<script setup lang="ts">
import AdminDashboard from './adminDashboard.vue'
import AsideView from '../../components/asideView.vue'
import MyselfView from '../components/personnalInfo.vue'
import UploadView from '../teacher/uploadView.vue'
import AppointmentView from '../teacher/appointmentView.vue'
</script>
<template>
  <div class="common-layout">
    <el-container>
      <el-aside><AsideView /></el-aside>
      <el-container>
        <el-header>Header</el-header>
        <!-- <el-main><AdminDashboard></AdminDashboard></el-main> -->
        <!-- <el-main><MyselfView></MyselfView></el-main> -->
        <el-main><UploadView></UploadView></el-main>
        <!-- <AppointmentView></AppointmentView> -->
      </el-container>
    </el-container>
  </div>
</template>

<style lang="less" scoped>
* {
  margin: 0px;
}
</style>
