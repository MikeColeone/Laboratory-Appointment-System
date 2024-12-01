<script setup lang="ts">
import { ref } from 'vue'
import { ElButton } from 'element-plus'

//初始dialog不可视
const isVisible = ref(false)
const tableData = ref([])
//删除
const handleDelete = (row) => {}
//编辑
const handleEdit = (index) => {}
const visible = (isVisible: { value: boolean }) => {
  isVisible.value = !isVisible.value
}
const form = ref()
const data = ref({
  form: { username: '', password: '' },
  //表单验证规则
  rules: {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  },
})
</script>
<template>
  <div>
    <!-- 搜索栏 -->
    <div class="searchBox">
      <el-input aria-placeholder="请输入账号查询"></el-input>
      <el-button>查询</el-button>
      <el-button>重置</el-button>
    </div>

    <!-- 功能框 添加 删除 -->
    <div class="item">
      <el-button>新增</el-button>
      <el-button>删除</el-button>
    </div>

    <div class="table">
      <el-table :data="tableData">
        <el-table-column prop="index" lable="序号"></el-table-column>
        <el-table-column prop="username" lable="账号"></el-table-column>
        <el-table-column prop="name" lable="姓名"></el-table-column>
        <el-table-column prop="phone" lable="电话"></el-table-column>
        <el-table-column prop="email" lable="邮箱"></el-table-column>
        <el-table-column prop="role" lable="身份"></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template v-slot="scope">
            <el-button size="small" type="primary" plain @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button size="small" type="danger" plain @click="handleDelete(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination></el-pagination>
      </div>

      <!-- 弹出的对话框 -->
      <el-dialog title="管理员" :close-on-click-modal="true" destroy-on-close>
        <el-form :model="form" :rules="data.rules" ref="formRef">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="form.phone" placeholder="电话"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="邮箱"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="visible">取 消</el-button>
            <el-button @click="save">确 定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
