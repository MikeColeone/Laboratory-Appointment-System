<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'
</script>
<template>
  <div>
    <suspense>
      <template #default>
        <RouterView />
      </template>
      <template #fallback>
        <LoadingVue />
      </template>
    </suspense>
  </div>
</template>
