<script setup lang="ts">
import { ref } from 'vue'
import * as XLSX from 'xlsx'

// 定义表格数据
const tableData = ref([])

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

    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        v-for="(column, index) in tableData[0] || []"
        :key="index"
        :label="column"
        :prop="column"
      ></el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.upload-demo {
  margin-bottom: 20px;
}
</style>
