<template>
  <div>
    <div class="search">
      <el-select v-model="status" placeholder="请选择审核状态" style="width: 200px">
        <el-option label="待审核" value="待审核"></el-option>
        <el-option label="审核通过" value="审核通过"></el-option>
        <el-option label="审核不通过" value="审核不通过"></el-option>
      </el-select>
      <el-button type="info" plain style="margin-left: 10px" @click="load(1)">查询</el-button>
      <el-button type="warning" plain style="margin-left: 10px" @click="reset">重置</el-button>
    </div>

    <div class="table">
      <el-table :data="tableData" stripe>
        <!-- 表格列定义保持不变 -->
        <el-table-column prop="id" label="序号" width="80" sortable></el-table-column>
        <el-table-column prop="labName" label="实验室" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="labadminName"
          label="实验室管理员"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="studentName" label="预约人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="time" label="操作时间"></el-table-column>
        <el-table-column prop="start" label="使用时间段">
          <template #default="{ row }">{{ row.start }} ~ {{ row.end }}</template>
        </el-table-column>
        <el-table-column prop="status" label="预约状态"></el-table-column>
        <el-table-column prop="dostatus" label="使用状态"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="{ row }">
            <el-button
              v-if="user.role === 'TEACHER' && row.status === '待审核'"
              @click="del(row.id)"
              >取消预约</el-button
            >
            <el-button
              v-if="user.role !== 'TEACHER' && row.status === '待审核'"
              @click="changeStatus(row, '审核通过')"
              >通过</el-button
            >
            <el-button
              v-if="user.role !== 'TEACHER' && row.status === '待审核'"
              @click="changeStatus(row, '审核不通过')"
              >不通过</el-button
            >
            <el-button
              v-if="user.role !== 'TEACHER' && row.dostatus === '使用中'"
              @click="changeStatus(row, '已结束')"
              >结束使用</el-button
            >
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
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'
const tableData = ref([]) // 表格数据
const pageNum = ref(1) // 当前页码
const pageSize = ref(10) // 每页显示个数
const total = ref(0) // 数据总量
const status = ref(null) // 查询条件
const user = ref(JSON.parse(localStorage.getItem('xm-user') || '{}')) // 当前用户
const form = reactive({}) // 表单对象

// 分页加载数据
const load = (page) => {
  if (page) pageNum.value = page
  const params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    status: status.value,
  }
  // 使用请求接口获取数据
  request.get('/reserve/selectPage', { params }).then((res) => {
    tableData.value = res.data?.list || []
    total.value = res.data?.total || 0
  })
}

// 改变状态
const changeStatus = (row: any, newStatus: string) => {
  const data = { ...row }
  if (newStatus === '审核通过') {
    data.dostatus = '使用中'
    data.status = newStatus
  }
  if (newStatus === '审核不通过') {
    data.dostatus = newStatus
    data.status = newStatus
  }
  if (newStatus === '已结束') {
    data.dostatus = '已结束'
  }
  request.put('/reserve/update', data).then((res) => {
    if (res.code === '200') {
      ElMessage.success('操作成功')
      load(1)
    } else {
      ElMessage.error(res.msg)
    }
  })
}

// 删除数据
const del = (id) => {
  ElMessageBox.confirm('您确定取消预约吗？', '灵魂拷问', { type: 'warning' })
    .then(() => {
      $request.delete(`/reserve/delete/${id}`).then((res) => {
        if (res.code === '200') {
          ElMessage.success('操作成功')
          load(1)
        } else {
          ElMessage.error(res.msg)
        }
      })
    })
    .catch(() => {})
}

// 重置查询条件
const reset = () => {
  status.value = null
  load(1)
}

// 分页操作
const handleCurrentChange = (page) => {
  load(page)
}

// 初始加载
onMounted(() => {
  load(1)
})
</script>

<style scoped></style>
