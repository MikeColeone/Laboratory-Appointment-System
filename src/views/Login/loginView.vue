<script setup lang="ts">
/*
  不提供注册功能 因为是内部系统
 */
import { ref } from 'vue'
import request from '@/utils/request.js'
import { User, Lock, Message } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
//获取路由信息
const router = useRouter()
//使用store
const store = useStore()
//表单数据以及验证规则
const data = ref({
  form: { username: '', password: '' },
  rules: {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  },
})
//绑定的表单数据
const formRef = ref()
// 提交表单
const login = async () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      console.log('Form submitted:==========', data.value.form)
      request
        .post('/api/login', data.value.form)
        .then((response) => {
          console.log('reponse', response)

          router.push('/dashboard')

          if (response.code == 401) {
            console.log('++++++++++++++++++++++++++')
            ElMessage.info('账号密码错误')
          } else {
            ElMessage.error('登陆失败', response.data)
          }
        })
        .catch((error: unknown) => {
          console.error('登录请求失败，请检查网络', error)
          ElMessage.error('登录请求失败，请检查网络')
        })
    } else {
      console.log('失败')
      ElMessage.warning('请输入完整表单')
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
