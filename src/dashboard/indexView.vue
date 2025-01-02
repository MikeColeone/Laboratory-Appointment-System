<template>
  <div>
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
            <h4>林学院实验室</h4>
            <el-progress :percentage="labUsage.lab2" status="warning"></el-progress>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 上传课程 唤起模态框 -->
    <el-button type="primary" @click="showUploadModal">上传课程</el-button>

    <!-- 上传课程对话框 -->
    <el-dialog
      title="上传课程"
      v-model="uploadDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
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
          <div>
            <el-button
              v-for="week in weeks"
              :key="week"
              :type="formData.classTime.includes(week) ? 'primary' : 'default'"
              @click="toggleWeek(week)"
            >
              第{{ week }}周
            </el-button>
          </div>
        </el-form-item>

        <!-- 上传按钮 -->
        <el-form-item>
          <el-button type="primary" @click="uploadCourse">上传</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 课表展示 -->
    <el-table :data="timetable" style="width: 100%">
      <el-table-column prop="academicYear" label="学年"></el-table-column>
      <el-table-column prop="semester" label="学期"></el-table-column>
      <el-table-column prop="courseName" label="课程名称"></el-table-column>
      <el-table-column prop="courseType" label="课程类型"></el-table-column>
      <el-table-column prop="labHours" label="实验学时"></el-table-column>
      <el-table-column label="上课周数">
        <template #default="scope">
          {{ simplify(scope.row.classTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="scope">
          <el-button plain type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button plain type="danger" @click="del(scope.row.id)">删除</el-button>
          <el-button plain type="success" @click="selectCourse(scope.row)">选课</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

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
  classTime: [{ required: true, message: '请选择上课周数', trigger: 'change' }],
}

const timetable = ref([])

//计算使用情况
const labUsage = reactive({
  lab1: 100,
  lab2: 50,
})

const simplify = (nums) => {
  if (nums.length === 0) return ''
  nums.sort((a, b) => a - b) // 对数组进行排序
  const result = []
  let l = 0 // 左指针指向区间起始
  let r = 0 // 右指针用于扩展区间

  while (r < nums.length) {
    if (!(r + 1 < nums.length) || nums[r] + 1 !== nums[r + 1]) {
      result.push(specification(nums[l], nums[r]))
      l = r + 1
    }
    r++
  }

  return result.join(', ')
}

const specification = (l: number, r: number) => {
  return l === r ? `${l}` : `${l}-${r}`
}

const courseForm = ref(null)
const uploadDialogVisible = ref(false)
const weeks = Array.from({ length: 20 }, (_, i) => i + 1) // 假设有20周

const showUploadModal = () => {
  uploadDialogVisible.value = true
}

const fetchLabsData = () => {
  request.get('teacher/labs').then((response) => {
    console.log('Labs data:', response.data)
  })
}

//拿到所有实验室
onMounted(() => {
  fetchLabsData()
})

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
      uploadDialogVisible.value = false // 关闭对话框
    } else {
      ElMessage.error('请填写完整的课程信息')
    }
  })
}

const selectCourse = (row) => {
  request
    .post('/student/selectCourse', row)
    .then((response) => {
      if (response.data.success) {
        ElMessage.success('选课成功')
      } else {
        ElMessage.error('选课失败')
      }
    })
    .catch((error) => {
      console.error('选课请求失败，请检查网络', error)
      ElMessage.error('选课请求失败，请检查网络')
    })
}

const handleEdit = (row) => {
  // 编辑逻辑
}

const del = (id) => {
  // 删除逻辑
}

const toggleWeek = (week) => {
  const index = formData.classTime.indexOf(week)
  if (index === -1) {
    formData.classTime.push(week)
  } else {
    formData.classTime.splice(index, 1)
  }
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
