<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Lab, LabType } from '@/type'

// 表单数据
const name = ref<string | null>(null)
const typeId = ref<number | null>(null)

// 表格数据和分页信息
const tableData = ref<Lab[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 实验室类型数据
const typeData = ref<LabType[]>([{ id: 1, name: '计算机实验室' }])

// 模拟实验室数据
const allData: Lab[] = [
  {
    id: 1,
    name: '实验室A',
    descr: '计算机实验室',
    typeName: '计算机实验室',
    status: '空闲中',
    start: '08:00',
    end: '18:00',
  },
]

// 加载实验室数据函数
const load = async (page: number) => {
  pageNum.value = page
  // 模拟过滤数据
  const filteredData = allData.filter((item) => {
    return (
      !typeId.value ||
      item.typeName.includes(typeData.value.find((type) => type.id === typeId.value)?.name || '')
    )
  })

  total.value = filteredData.length // 总数
  tableData.value = filteredData.slice((page - 1) * pageSize.value, page * pageSize.value) // 分页显示
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
      <el-button type="info" plain @click="load(1)">查询</el-button>
      <el-button type="warning" plain @click="reset">重置</el-button>
    </div>
    <div class="table">
      <el-row :gutter="20">
        <el-col :span="8" v-for="item in tableData" :key="item.id">
          <div class="card">
            <div>
              <strong>实验室编号：</strong>
              <span>{{ item.name }}</span>
            </div>
            <div><strong>名称：</strong>{{ item.descr }}</div>
            <div><strong>类型：</strong>{{ item.typeName }}</div>
            <div style="margin-top: 5px">
              <strong>状态：</strong>
              <span>
                {{ item.status }}
              </span>
            </div>
            <div><strong>开放时间：</strong>{{ item.start }} - {{ item.end }}</div>
            <div>
              <el-button>预约</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
      <div>
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

<style scoped></style>
