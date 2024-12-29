<!-- 展示课表信息和实验室使用情况 -->
<template>
  <div>
    <!-- 上传课程 唤起模态框 -->
    <el-button>上传课程</el-button>
    <!-- 上传课表文件 -->

    <div>
      <el-form :model="formData" :rules="rules" ref="courseForm">
        <el-form-item label="学年" prop="academicYear">
          <el-input v-model="formData.academicYear" placeholder="输入学年"> </el-input>
        </el-form-item>
        <!-- 学期 -->
        <el-form-item label="学期" prop="semester">
          <el-select v-model="formData.semester" placeholder="请选择学期">
            <el-option label="第一学期" value="第一学期" />
            <el-option label="第二学期" value="第二学期" />
          </el-select>
        </el-form-item>

        <!-- 上课时间 -->
        <el-form-item label="上课时间" prop="classTime">
          <el-date-picker
            v-model="formData.classTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm"
          />
        </el-form-item>

        <!-- 课程名 -->
        <el-form-item label="课程名" prop="courseName">
          <el-input v-model="formData.courseName" placeholder="请输入课程名称" />
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitForm">上传课程</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button>上传课表</el-button>
    </div>
    <!-- 展示课表 -->
    <div class="schedule">
      <el-table :data="schedule" border style="width: 100%">
        <el-table-column prop="time" label="时间段" width="150" />
        <el-table-column prop="monday" label="星期一" />
        <el-table-column prop="tuesday" label="星期二" />
        <el-table-column prop="wedneday" label="星期三" />
        <el-table-column prop="Thursday" label="星期四" />
        <el-table-column prop="Friday" label="星期五" />
        <el-table-column prop="Saturday" label="星期六" />
        <el-table-column prop="sunday" label="星期日" />
      </el-table>
    </div>

    <!-- 展示实验室使用情况拿到所有实验室 -->
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

//模拟课程数据
const schedule = reactive([])
const courseForm = ref()
const formData = ref({
  academicYear: '', // 学年
  semester: '', // 学期
  classTime: [], // 上课时间（时间范围）
  courseName: '', // 课程名
  hours: '', //学时
  experimentalHours: '', //实验学时
})

//表单规则
const rules = {
  academicYear: [{ required: true, message: '请输入学年', trigger: 'blur' }],
  semester: [{ required: true, message: '请选择学期', trigger: 'change' }],
  classTime: [{ required: true, message: '请选择上课时间', trigger: 'change' }],
  courseName: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
}

const submitForm = () => {
  courseForm.value.validate((valid: boolean) => {
    if (valid) {
      axios
        .post('http://localhost/api/submit-course', formData.value)
        .then((response) => {
          console.log('服务器响应：', response.data)
          ElMessage.success('课程上传成功！')
        })
        .catch((error) => {
          console.error('提交失败：', error)
          ElMessage.error('提交失败，请重试！')
        })
    } else {
      ElMessage.error('表单验证未通过！')
    }
  })
}

const resetForm = () => {
  courseForm.value.resetFields()
}
</script>

<style scoped>
.schedule {
  padding: 20px;
}
</style>
