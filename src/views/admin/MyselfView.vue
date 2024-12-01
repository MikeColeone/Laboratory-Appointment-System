<template>
  <div>
    <el-card style="width: 50%">
      <el-form :model="user" label-width="100px" style="padding-right: 50px">
        <div style="margin: 15px; text-align: center">
          <el-upload
            class="avatar-uploader"
            :action="baseUrl + '/files/upload'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="user.avatar" :src="user.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="user.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="user.phone" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="user.password" placeholder="密码"></el-input>
        </el-form-item>
        <div style="text-align: center; margin-bottom: 20px">
          <el-button type="info" @click="updatePassword">更新密码</el-button>
          <el-button type="primary" @click="updateDetail">保 存</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import axios from 'axios'

// 初始化用户数据
const user = ref(JSON.parse(localStorage.getItem('xm-user') || '{}'))
const updatePassword = async () => {}
// 保存更新用户信息
const updateDetail = async () => {
  try {
    const response = await axios.put(`/student/update`, user.value)
    if (response.data.code === '200') {
      ElMessage.success('保存成功')
      // 更新本地存储中的用户信息
      localStorage.setItem('xm-user', JSON.stringify(user.value))
    } else {
      ElMessage.error(response.data.msg)
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    ElMessage.error('更新失败，请稍后重试')
  }
}

// 头像上传成功处理
const handleAvatarSuccess = (response: any) => {
  if (response.code === '200') {
    user.value.avatar = response.data.url // 假设返回的 URL 在 response.data.url
    ElMessage.success('头像上传成功')
  } else {
    ElMessage.error(response.msg || '上传失败')
  }
}
</script>

<style scoped></style>
