<template>
  <div>
    <!-- 上传课程 唤起模态框 -->
    <el-button @click="showUploadModal">上传课程</el-button>
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
        <!-- 课程名称 -->
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="formData.courseName" placeholder="输入课程名称"> </el-input>
        </el-form-item>
        <!-- 课程类型 -->
        <el-form-item label="课程类型" prop="courseType">
          <el-select v-model="formData.courseType" placeholder="请选择课程类型">
            <el-option label="理论课" value="理论课" />
            <el-option label="实验课" value="实验课" />
          </el-select>
        </el-form-item>
        <!-- 实验学时 -->
        <el-form-item label="实验学时" prop="labHours">
          <el-input v-model="formData.labHours" placeholder="输入实验学时"> </el-input>
        </el-form-item>
        <!-- 上课时间 -->
        <el-form-item label="上课时间" prop="classTime">
          <el-date-picker
            v-model="formData.classTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <!-- 上传按钮 -->
        <el-form-item>
          <el-button type="primary" @click="uploadCourse">上传</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 课表展示 -->
    <el-table :data="timetable" style="width: 100%">
      <el-table-column prop="academicYear" label="学年"></el-table-column>
      <el-table-column prop="semester" label="学期"></el-table-column>
      <el-table-column prop="courseName" label="课程名称"></el-table-column>
      <el-table-column prop="courseType" label="课程类型"></el-table-column>
      <el-table-column prop="labHours" label="实验学时"></el-table-column>
      <el-table-column prop="classTime" label="上课时间"></el-table-column>
    </el-table>

    <div style="margin-top: 20px">
      <h3>实验室使用情况</h3>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="usage-card">
            <h4>计算机实验室</h4>
            <el-progress :percentage="labUsage.lab1" status="success"></el-progress>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="usage-card">
            <h4>实验室2</h4>
            <el-progress :percentage="labUsage.lab2" status="warning"></el-progress>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="usage-card">
            <h4>实验室3</h4>
            <el-progress :percentage="labUsage.lab3" status="exception"></el-progress>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const formData = reactive({
  academicYear: '',
  semester: '',
  courseName: '',
  courseType: '',
  labHours: '',
  classTime: [],
})

const rules = {
  academicYear: [{ required: true, message: '请输入学年', trigger: 'blur' }],
  semester: [{ required: true, message: '请选择学期', trigger: 'change' }],
  courseName: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  courseType: [{ required: true, message: '请选择课程类型', trigger: 'change' }],
  labHours: [{ required: true, message: '请输入实验学时', trigger: 'blur' }],
  classTime: [{ required: true, message: '请选择上课时间', trigger: 'change' }],
}

const timetable = ref([])

const labUsage = reactive({
  lab1: 70,
  lab2: 50,
  lab3: 30,
})

const courseForm = ref(null)

const showUploadModal = () => {
  // Logic to show modal (if needed)
}

const uploadCourse = () => {
  courseForm.value?.validate((valid: boolean) => {
    if (valid) {
      timetable.value.push({ ...formData })
      ElMessage.success('课程上传成功')
      // Clear form data
      formData.academicYear = ''
      formData.semester = ''
      formData.courseName = ''
      formData.courseType = ''
      formData.labHours = ''
      formData.classTime = []
    } else {
      ElMessage.error('请填写完整的课程信息')
    }
  })
}
</script>

<style scoped>
.upload-demo {
  margin-bottom: 20px;
}
.usage-card {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}
</style>
