<script setup lang="ts">
import { ref } from 'vue'
import * as XLSX from 'xlsx'

// 课表数据
const scheduleData = ref([])
// 表格列名
const columns = ref<string[]>([])

// 处理文件上传
const handleUpload = (file: File) => {
  const reader = new FileReader()

  reader.onload = (e) => {
    const data = new Uint8Array(e.target?.result as ArrayBuffer)
    const workbook = XLSX.read(data, { type: 'array' })
    const sheetName = workbook.SheetNames[0] // 读取第一个工作表
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet) // 转换为 JSON 格式

    // 提取列名和数据
    if (jsonData.length > 0) {
      columns.value = Object.keys(jsonData[0])
      scheduleData.value = jsonData
    }
  }

  reader.readAsArrayBuffer(file)
  return false // 阻止默认上传行为
}
</script>
<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>
            <el-icon><Box /><Box /></el-icon>
            实验室预约
          </h2>
        </div>
      </template>
    </el-card>
    <div>
      <!-- 上传 Excel 文件 -->
      <el-upload
        action=""
        :show-file-list="false"
        :before-upload="handleUpload"
        accept=".xlsx, .xls"
      >
        <el-button type="primary">上传课表文件</el-button>
      </el-upload>

      <!-- 课表显示区域 -->
      <el-table :data="scheduleData" border style="margin-top: 20px">
        <el-table-column
          v-for="(column, index) in columns"
          :key="index"
          :prop="column"
          :label="column"
        />
      </el-table>
    </div>
  </div>
</template>

<style scoped></style>
