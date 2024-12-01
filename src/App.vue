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
        <Loading />
      </template>
    </suspense>
  </div>
</template>

<style>
* {
  margin: 0px;
  padding: 0px;
}
</style>
