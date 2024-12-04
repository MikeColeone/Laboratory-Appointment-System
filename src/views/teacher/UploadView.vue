<template>
  <el-upload
    v-model:file-list="fileList"
    class="upload-demo"
    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    multiple
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :limit="1"
    :on-exceed="handleExceed"
  >
    <el-button type="primary">只能上传Excel文件</el-button>
    <template #tip>
      <div class="el-upload__tip">.xls/.xlsx文件</div>
    </template>
  </el-upload>

  <el-dialog v-model="dialogVisible" title="确认删除">
    <span>确定要删除该文件 {{ currentFile?.name }} 吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelRemove">取消</el-button>
        <el-button type="primary" @click="confirmRemove">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadInstance, UploadProps, UploadUserFile } from 'element-plus'

const upload = ref<UploadInstance>()

const fileList = ref<UploadUserFile[]>([
  {
    name: 'element-plus-logo.svg',
    url: 'https://element-plus.org/images/element-plus-logo.svg',
  },
  {
    name: 'element-plus-logo2.svg',
    url: 'https://element-plus.org/images/element-plus-logo.svg',
  },
])

const dialogVisible = ref(false) // 控制弹窗显示
const currentFile = ref<UploadUserFile | null>(null) // 保存当前要删除的文件

// 删除文件
const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

// 预览文件
const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile)
}

// 超出文件限制处理
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  console.log('文件超出限制！')
}

// 自定义删除确认弹窗逻辑
const beforeRemove: UploadProps['beforeRemove'] = (uploadFile) => {
  currentFile.value = uploadFile // 保存当前要删除的文件
  dialogVisible.value = true // 显示弹窗
  return false // 阻止默认删除操作，等待用户确认
}

// 确认删除逻辑
const confirmRemove = () => {
  const index = fileList.value.findIndex((file) => file.name === currentFile.value!.name)
  if (index !== -1) {
    fileList.value.splice(index, 1) // 从文件列表中移除文件
    ElMessage.success('文件已删除')
  }
  dialogVisible.value = false // 关闭弹窗
}

// 取消删除逻辑
const cancelRemove = () => {
  dialogVisible.value = false // 关闭弹窗
}
</script>
