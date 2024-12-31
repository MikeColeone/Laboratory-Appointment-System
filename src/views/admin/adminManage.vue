<template>
  <div>
    <div class="search">
      <el-input placeholder="请输入账号查询" style="width: 200px" v-model="username"></el-input>
      <el-button type="info" plain style="margin-left: 10px" @click="load(1)">查询</el-button>
      <el-button type="warning" plain style="margin-left: 10px" @click="reset">重置</el-button>
    </div>

    <div class="operation">
      <el-button type="primary" plain @click="handleAdd">新增</el-button>
      <el-button type="danger" plain @click="delBatch">批量删除</el-button>
    </div>

    <div class="table">
      <el-table :data="tableData" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="序号" width="70" sortable></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="account" label="账号"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template v-slot="scope">
            <el-button size="mini" type="primary" plain @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button size="mini" type="danger" plain @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog
      title="人员新增"
      v-model="fromVisible"
      width="40%"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        :model="form"
        label-width="100px"
        style="padding-right: 50px"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option label="教师" value="TEACHER"></el-option>
            <el-option label="管理员" value="ADMIN"></el-option>
            <el-option label="超级管理员" value="SUPERADMIN"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="电话"></el-input>
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

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import {
  ElMessage,
  ElMessageBox,
  ElTableColumn,
  ElTable,
  ElInput,
  ElButton,
  ElPagination,
  ElDialog,
  ElForm,
  ElFormItem,
  ElUpload,
  ElImage,
} from 'element-plus'
import request from '@/utils/request'
import * as XLSX from 'xlsx'

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
  const response = await request.get('getAllUsers')
  tableData.value = response.data
  console.log('tableData:', tableData.value)
}

const tableData = ref([])

// 当前的页码
const pageNum = ref(1)
// 每页显示的个数
const pageSize = ref(10)
// 总记录数
const total = ref(0)
const username = ref(null)
const fromVisible = ref(false)
let form = reactive({})
const user = JSON.parse(localStorage.getItem('xm-user') || '{}')
const rules = reactive({
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
})
const ids = ref([])

onMounted(() => {
  fetchData()

  load(1)
})

const handleAdd = () => {
  form = reactive({ username: '', account: '', password: '', role: '', phone: '' }) // 新增数据的时候清空数据
  fromVisible.value = true // 打开弹窗
}

const handleEdit = (row) => {
  // 编辑数据
  form = reactive(JSON.parse(JSON.stringify(row))) // 给form对象赋值  注意要深拷贝数据
  fromVisible.value = true // 打开弹窗
}

const save = () => {
  // 保存按钮触发的逻辑  它会触发新增或者更新
  formRef.value?.validate((valid) => {
    if (valid) {
      const url = form.id ? '/labadmin/update' : '/labadmin/add'
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

const del = (id) => {
  // 单个删除
  ElMessageBox.confirm('您确定删除吗？', '确认删除', { type: 'warning' }).then(() => {
    request.delete('admin/delete/' + id).then((res) => {
      if (res.code === '200') {
        // 表示操作成功
        ElMessage.success('操作成功')
        load(1)
      } else {
        ElMessage.error(res.msg) // 弹出错误的信息
      }
    })
  })
}

const handleSelectionChange = (rows) => {
  // 当前选中的所有的行数据
  ids.value = rows.map((v) => v.id)
}

const delBatch = () => {
  // 批量删除
  if (ids.value.length === 0) {
    ElMessage.warning('请选择数据')
    return
  }
  ElMessageBox.confirm('您确定批量删除这些数据吗？', '确认删除', { type: 'warning' }).then(() => {
    request.delete('labadmin/delete/batch', { data: ids.value }).then((res) => {
      if (res.code === '200') {
        // 表示操作成功
        ElMessage.success('操作成功')
        load(1)
      } else {
        ElMessage.error(res.message) // 弹出错误的信息
      }
    })
  })
}

const load = (pageNumParam) => {
  // 分页查询
  if (pageNumParam) pageNum.value = pageNumParam
  request
    .get('/labadmin/selectPage', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        username: username.value,
      },
    })
    .then((res) => {
      tableData.value = res.data?.list
      total.value = res.data?.total
    })
}

const reset = () => {
  username.value = null
  load(1)
}

const handleCurrentChange = (pageNumParam) => {
  load(pageNumParam)
}
</script>

<style scoped></style>
