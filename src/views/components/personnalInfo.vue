<template>
  <div style="display: flex; justify-content: center; align-items: center; height: 100%">
    <el-card style="width: 50%; padding: 20px; margin: 120px; height: 75%">
      <el-form :model="user" label-width="100px" style="padding-right: 50px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" placeholder="用户名" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="user.username" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="user.phone" placeholder="电话"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="user.password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <div style="text-align: center; margin-bottom: 20px">
          <el-button type="primary" @click="update">保 存</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const user = reactive(JSON.parse(localStorage.getItem('xm-user') || '{}'))

const update = async () => {
  try {
    const response = await axios.put(`/student/update`, user)
    if (response.data.code === '200') {
      ElMessage.success('保存成功')

      localStorage.setItem('xm-user', JSON.stringify(user))

      // 触发父级的数据更新
      // 注意：需要通过 props 或 emit 提供对父级组件的更新支持
    } else {
      ElMessage.error(response.data.msg)
    }
  } catch (error) {
    ElMessage.error('请求失败，请稍后重试！')
    console.error(error)
  }
}
</script>

<style scoped></style>
