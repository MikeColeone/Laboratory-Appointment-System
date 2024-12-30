<template>
  <div>
    <!-- 搜索 -->
    <div class="search">
      <el-input placeholder="请输入标题查询" style="width: 200px" v-model="title"></el-input>
      <el-button type="info" plain style="margin-left: 10px" @click="load(1)">查询</el-button>
      <el-button type="warning" plain style="margin-left: 10px" @click="reset">重置</el-button>
    </div>

    <!-- 操作 -->
    <div class="operation">
      <el-button plain @click="handleAdd">新增</el-button>
      <el-button plain @click="delBatch">批量删除</el-button>
    </div>

    <div class="table">
      <el-table :data="tableData" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="序号" width="80" sortable></el-table-column>
        <el-table-column prop="title" label="标题" show-overflow-tooltip></el-table-column>
        <el-table-column prop="content" label="内容" show-overflow-tooltip></el-table-column>
        <el-table-column prop="time" label="创建时间"></el-table-column>
        <el-table-column prop="user" label="创建人"></el-table-column>

        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <el-button plain type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button plain type="danger" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[5, 10, 20, 25]"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog title="信息" :close-on-click-modal="true" destroy-on-close>
      <el-form
        label-width="100px"
        style="padding-right: 50px"
        :model="form"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item prop="title" label="标题">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="content" label="内容">
          <el-input type="textarea" :rows="5" v-model="form.content" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="fromVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  ElMessage,
  ElMessageBox,
  ElTableColumn,
  ElTable,
  ElPagination,
  ElInput,
  ElButton,
  ElForm,
  ElFormItem,
  ElDialog,
} from 'element-plus'
import request from '@/utils/request'

// 响应式数据声明
const tableData = ref([]) // 所有的数据
const pageNum = ref(1) // 当前的页码
const pageSize = ref(10) // 每页显示的个数
const total = ref(0)
const title = ref(null)
const fromVisible = ref(false)
const form = reactive({})
const rules = reactive({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
})
const ids = ref([])

onMounted(() => {
  load(1)
})

// 新增数据方法
const handleAdd = () => {
  form = {} // 新增数据的时候清空数据
  fromVisible.value = true // 打开弹窗
}

// 编辑数据方法
const handleEdit = (row) => {
  form = JSON.parse(JSON.stringify(row)) // 给form对象赋值  注意要深拷贝数据
  fromVisible.value = true // 打开弹窗
}

// 保存数据方法（新增或更新）
const save = () => {
  const formRef = ref(null)
  formRef.value?.validate((valid) => {
    if (valid) {
      const url = form.id ? '/notice/update' : '/notice/add'
      const method = form.id ? 'PUT' : 'POST'
      request({
        url,
        method,
        data: form,
      }).then((res) => {
        if (res.code === '200') {
          // 表示成功保存
          ElMessage.success('保存成功')
          load(1)
          fromVisible.value = false
        } else {
          ElMessage.error(res.msg) // 弹出错误的信息
        }
      })
    }
  })
}

// 单个删除方法
const del = (id) => {
  ElMessageBox.confirm('您确定删除吗？', '确认删除', { type: 'warning' })
    .then(() => {
      request.delete('/notice/delete/' + id).then((res) => {
        if (res.code === '200') {
          // 表示操作成功
          ElMessage.success('操作成功')
          load(1)
        } else {
          ElMessage.error(res.msg) // 弹出错误的信息
        }
      })
    })
    .catch(() => {})
}

// 处理选中行变化的方法
const handleSelectionChange = (rows) => {
  ids.value = rows.map((v) => v.id)
}

// 批量删除方法
const delBatch = () => {
  if (!ids.value.length) {
    ElMessage.warning('请选择数据')
    return
  }
  ElMessageBox.confirm('您确定批量删除这些数据吗？', '确认删除', { type: 'warning' })
    .then(() => {
      request.delete('/notice/delete/batch', { data: ids.value }).then((res) => {
        if (res.code === '200') {
          // 表示操作成功
          ElMessage.success('操作成功')
          load(1)
        } else {
          ElMessage.error(res.msg) // 弹出错误的信息
        }
      })
    })
    .catch(() => {})
}

// 分页查询方法
const load = (pageNumParam) => {
  if (pageNumParam) pageNum.value = pageNumParam
  request
    .get('/notice/selectPage', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        title: title.value,
      },
    })
    .then((res) => {
      tableData.value = res.data?.list
      total.value = res.data?.total
    })
}

// 重置查询条件并重新查询方法
const reset = () => {
  title.value = null
  load(1)
}

// 处理页码变化的方法
const handleCurrentChange = (pageNumParam) => {
  load(pageNumParam)
}
</script>

<style scoped></style>
