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
      <el-table :data="tableData" strip @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="id" label="序号" width="70" sortable></el-table-column>
        <el-table-column label="头像">
          <template v-slot="scope">
            <div style="display: flex; align-items: center">
              <el-image
                style="width: 40px; height: 40px; border-radius: 50%"
                v-if="scope.row.avatar"
                :src="scope.row.avatar"
                :preview-src-list="[scope.row.avatar]"
              ></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="账号"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template v-slot="scope">
            <el-button size="mini" type="primary" plain @click="handleEdit(scope.row)"
              >编辑</el-button
            >
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
      title="管理员"
      :visible.sync="fromVisible"
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            :action="$baseUrl + '/files/upload'"
            :headers="{ token: user.token }"
            list-type="picture"
            :on-success="handleAvatarSuccess"
          >
            <el-button type="primary">上传头像</el-button>
          </el-upload>
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

// 所有的数据
const tableData = ref([])
// 当前的页码
const pageNum = ref(1)
// 每页显示的个数
const pageSize = ref(10)
// 总记录数
const total = ref(0)
const username = ref(null)
const fromVisible = ref(false)
const form = reactive({})
const user = JSON.parse(localStorage.getItem('xm-user') || '{}')
const rules = reactive({
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
})
const ids = ref([])

// 生命周期钩子，相当于created
onMounted(() => {
  load(1)
})

const handleAdd = () => {
  // 新增数据
  form.value = {} // 新增数据的时候清空数据
  fromVisible.value = true // 打开弹窗
}

const handleEdit = (row) => {
  // 编辑数据
  form.value = JSON.parse(JSON.stringify(row)) // 给form对象赋值  注意要深拷贝数据
  fromVisible.value = true // 打开弹窗
}

const save = () => {
  // 保存按钮触发的逻辑  它会触发新增或者更新
  const formRef = ref(null)
  formRef.value.validate((valid) => {
    if (valid) {
      const url = form.value.id ? '/labadmin/update' : '/labadmin/add'
      const method = form.value.id ? 'PUT' : 'POST'
      request({
        url,
        method,
        data: form.value,
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
    request.delete('/labadmin/delete/' + id).then((res) => {
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
    request.delete('/labadmin/delete/batch', { data: ids.value }).then((res) => {
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

const handleAvatarSuccess = (response, file, fileList) => {
  // 把头像属性换成上传的图片的链接
  form.avatar = response.data
}
</script>

<style scoped></style>
