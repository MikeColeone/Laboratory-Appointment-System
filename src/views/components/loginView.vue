<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import type { User } from '@/type'
// 表单数据和验证规则
const form = reactive({
  account: '',
  password: '',
})

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const formRef = ref(null)
const router = useRouter()

// 提交表单
const login = async () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      request
        .post('login', form)
        .then((response) => {
          console.log('form', form)
          console.log('response.headers', response.headers)
          // const token = response.headers['token']
          const token =
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIzIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzM1OTAyOTQyLCJpYXQiOjE3MzU4MTY1NDJ9.aZfblHcRH4-TmOvPYDlDgBcysmIBIdRSyo3ubCvq7ec'
          if (response.code === 200) {
            const user: User = {
              id: response.data.id,
              account: response.data.account,
              username: response.data.username,
              password: response.data.password,
              phone: response.data.phone,
              role: response.data.role,
              inset_time: response.data.inset_time,
              update_time: response.data.update_time,
            }
            localStorage.setItem('xm-user', JSON.stringify(user))
            localStorage.setItem('token', token)

            router.push('/')
            ElMessage.success('登录成功')
          } else {
            console.error(response)
            ElMessage.error(response.message)
          }
        })
        .catch((error: unknown) => {
          console.error('登录请求失败，请检查网络', error)
          ElMessage.error('登录请求失败，请检查网络')
        })
    } else {
      ElMessage.warning('请输入完整表单')
    }
  })
}
</script>

<template>
  <div class="container">
    <div style="width: 400px; padding: 30px; background-color: white; border-radius: 5px">
      <div style="text-align: center; font-size: 20px; margin-bottom: 20px; color: #333">
        欢迎登录NEFU实验室预约系统
      </div>
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="account">
          <el-input
            prefix-icon="el-icon-user"
            placeholder="请输入账号"
            v-model="form.account"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
            v-model="form.password"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            style="width: 100%; background-color: #0376bf; border-color: #0376bf; color: white"
            @click="login"
            >登 录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
  overflow: hidden;
  background-image: url('@/assets/login/login.jpg');
  background-size: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}
a {
  color: #2a60c9;
}
</style>
