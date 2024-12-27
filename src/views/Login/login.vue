<script setup lang="ts">
import { ref } from 'vue'
import request from '@/utils/request.js'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const data = ref({
  form: { username: '', password: '', role: '' },
  rules: {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  },
})
const formRef = ref()
const login = () => {
  console.log(formRef.value)

  router.push('/')
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      alert('登陆成功')
      request
        .post('/login', data.value.form)
        .then(
          (res: { code: string; data: { role: unknown; username: unknown }; message: unknown }) => {
            if (res.code === '200') {
              const role = res.data.role
              ElMessage.success(`欢迎，${res.data.username}!`)
            } else {
              ElMessage.error(res.message || '登录失败')
            }
          },
        )
        .catch((error: unknown) => {
          ElMessage.error('登录请求失败，请稍后重试')
          console.error('登录错误:', error)
        })
    } else {
      ElMessage.warning('请完整填写表单')
    }
  })
}
</script>

<template>
  <div class="box">
    <div class="login">
      <div
        style="
          padding: 10px;
          background-color: white;
          margin-left: 180px;
          margin-bottom: 110px;
          border-radius: 10px;
        "
      >
        <el-form
          ref="formRef"
          :model="data.form"
          :rules="data.rules"
          style="width: 400px; padding: 10px"
        >
          <div style="padding: 10px">
            <h1
              style="
                color: blue;
                align-items: center;
                text-align: center;
                font-family: Verdana, Geneva, Tahoma, sans-serif;
              "
            >
              欢迎使用实验室预约系统
            </h1>
          </div>
          <el-form-item props="username">
            <el-input
              v-model="data.form.username"
              placeholder="请输入账号"
              :prefix-icon="User"
              style="padding: 5px; height: 50px"
            ></el-input>
          </el-form-item>

          <el-form-item props="password">
            <el-input
              type="password"
              v-model="data.form.password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              style="padding: 5px; height: 50px"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="data.form.role" placeholder="请选择角色">
              <el-option label="实验室管理员" value="ADMIN"></el-option>
              <el-option label="超级管理员" value="SUPERADMIN"></el-option>
              <el-option label="教师" value="TEACHER"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="large" type="primary" @click="login" style="width: 100%"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.box {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-image: url('../../assets/login/login.jpg');
  background-size: cover;
}

.login {
  display: flex;
  align-items: center;
  position: absolute;
  right: 0;
  width: 50%;
  height: 100%;
}
</style>
