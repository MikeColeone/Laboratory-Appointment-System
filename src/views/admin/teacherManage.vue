<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import * as XLSX from 'xlsx'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import {
  ElMessage,
  ElUpload,
  ElForm,
  ElInput,
  ElButton,
  ElSelect,
  ElOption,
  ElTable,
  ElTableColumn,
} from 'element-plus'
import request from '@/utils/request'
// 定义表格数据
const passwordVisible = ref(false)
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}
// 处理文件上传
const handleFileChange = (event: Event) => {
  const fileInput = event.target as HTMLInputElement
  const file = fileInput.files ? fileInput.files[0] : null
  if (file) {
    readExcel(file)
  }
}

// 读取 Excel 文件
const readExcel = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const data = e.target?.result
    if (typeof data === 'string') {
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0] // 读取第一个工作表
      const sheet = workbook.Sheets[sheetName]
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) // 将表格转为 JSON 数据
      tableData.value = json
    }
  }
  reader.readAsBinaryString(file)
}

const data = reactive({
  form: { username: '', account: '', password: '', role: '', department: '', phone: '' },
  rules: {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    account: [
      { required: true, message: '请输入账号', trigger: 'blur' },
      { min: 10, max: 10, message: '请输入10位学号或工号', trigger: 'blur' },
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    phone: [
      { required: true, message: '请输入电话号码', trigger: 'blur' },
      { pattern: /^[0-9]{10,11}$/, message: '请输入10到11位的电话号码', trigger: 'blur' },
    ],
  },
})

const formRef = ref()
const upload = async () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      console.log('Form submitted:==========', data.form)
      tableData.value.push({ ...data.form })
      request
        .post('login', data.form)
        .then((response) => {
          console.log('reponse', response)
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

const fetchData = async () => {
  const response = await request.get('teacher')
  tableData.value = response.data
}

const tableData = ref([
  {
    username: 'John Doe',
    account: '1234567890',
    role: 'TEACHER',
    department: 'computer_control_college',
    phone: '1234567890',
  },
  {
    username: 'Jane Smith',
    account: '0987654321',
    role: 'ADMIN',
    department: 'forestry_college',
    phone: '0987654321',
  },
  {
    username: 'Alice Johnson',
    account: '1122334455',
    role: 'SUPERADMIN',
    department: 'economics_management_college',
    phone: '1122334455',
  },
])

//刷新页面时获取数据
onMounted(() => {
  fetchData()
})

const mock = new MockAdapter(axios)
mock.onPost('login').reply(200, {
  code: 200,
  message: 'Login successful',
  data: { token: 'fake-token' },
})
mock.onGet('teacher').reply(200, {
  data: [
    {
      username: 'John Doe',
      account: '1234567890',
      role: 'TEACHER',
      department: 'computer_control_college',
      phone: '1234567890',
    },
    {
      username: 'Jane Smith',
      account: '0987654321',
      role: 'ADMIN',
      department: 'forestry_college',
      phone: '0987654321',
    },
    {
      username: 'Alice Johnson',
      account: '1122334455',
      role: 'SUPERADMIN',
      department: 'economics_management_college',
      phone: '1122334455',
    },
  ],
})
</script>

<template>
  <div>
    <el-upload
      class="upload-demo"
      action=""
      :before-upload="handleFileChange"
      :show-file-list="false"
    >
      <template v-slot:trigger>
        <el-button size="small" type="primary">上传表格</el-button>
      </template>
    </el-upload>

    <div>
      <el-form
        ref="formRef"
        :model="data.form"
        :rules="data.rules"
        style="width: 400px; padding: 10px"
      >
        <!-- 上传的教师信息 -->
        <el-form-item prop="username">
          <el-input
            v-model="data.form.username"
            placeholder="请输入用户名"
            style="padding: 5px; height: 50px"
          ></el-input>
        </el-form-item>

        <el-form-item prop="phone">
          <el-input
            v-model="data.form.phone"
            placeholder="请输入电话号码"
            style="padding: 5px; height: 50px"
          ></el-input>
        </el-form-item>
        <el-form-item prop="department">
          <el-select v-model="data.form.department" placeholder="请选择部门">
            <el-option label="计算机控制学院" value="computer_control_college"></el-option>
            <el-option label="林学院" value="forestry_college"></el-option>
            <el-option label="经管学院" value="economics_management_college"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="role">
          <el-select v-model="data.form.role" placeholder="请选择角色">
            <el-option label="教师" value="TEACHER"></el-option>
            <el-option label="管理员" value="ADMIN"></el-option>
            <el-option label="超级管理员" value="SUPERADMIN"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="account">
          <el-input
            v-model="data.form.account"
            placeholder="请输入账号"
            style="padding: 5px; height: 50px"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :type="passwordVisible ? 'text' : 'password'"
            v-model="data.form.password"
            placeholder="请输入密码"
          >
            <template #suffix>
              <el-icon @click="togglePasswordVisibility">
                <i :class="passwordVisible ? 'el-icon-view' : 'el-icon-view-off'"></i>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="large" type="primary" @click="upload" style="width: 100%"
            >上传教师信息</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="account" label="账号"></el-table-column>
      <el-table-column prop="role" label="角色"></el-table-column>
      <el-table-column prop="department" label="部门"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.upload-demo {
  margin-bottom: 20px;
}
</style>
