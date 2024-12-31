<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Lab, LabType } from '@/type'
import request from '@/utils/request'
// 表单数据
const name = ref<string | null>(null)
const typeId = ref<number | null>(null)

// 表格数据和分页信息
const tableData = ref<Lab[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 实验室类型数据
const typeData = ref<LabType[]>([
  {
    id: 1,
    name: '计算机实验室',
  },
  {
    id: 2,
    name: '林科实验室',
  },
])

// 加载实验室数据函数
const load = async (page: number) => {
  pageNum.value = page
  try {
    const response = await request.get('labs', {
      params: {
        page: pageNum.value,
        pageSize: pageSize.value,
        name: name.value,
        typeId: typeId.value,
      },
    })
    const { data, total: totalLabs } = response.data
    tableData.value = data
    total.value = totalLabs
  } catch (error) {
    console.error('加载实验室数据失败:', error)
  }
}

// 重置搜索条件
const reset = () => {
  name.value = null
  typeId.value = null
  load(1)
}

// 分页变化时加载
const handleCurrentChange = (page: number) => {
  load(page)
}

// 预约函数
const reserve = (lab: Lab) => {
  console.log('预约实验室:', lab)
  // 在这里添加预约逻辑
}

onMounted(() => {
  load(1)
})
</script>

<template>
  <div>
    <h1>临时预约</h1>
    <div class="search">
      <el-select v-model="typeId" placeholder="请选择实验室分类" style="width: 200px">
        <el-option
          v-for="item in typeData"
          :label="item.name"
          :value="item.id"
          :key="item.id"
        ></el-option>
      </el-select>
      <el-input
        v-model="name"
        placeholder="输入实验室名称"
        style="width: 200px; margin-left: 10px"
      ></el-input>
      <el-button type="info" plain @click="load(1)">查询</el-button>
      <el-button type="warning" plain @click="reset">重置</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="实验室编号"></el-table-column>
        <el-table-column prop="descr" label="名称"></el-table-column>
        <el-table-column prop="typeName" label="类型"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="start" label="开放时间">
          <template #default="scope"> {{ scope.row.start }} - {{ scope.row.end }} </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="reserve(scope.row)">预约</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search {
  margin-bottom: 20px;
}
</style>
