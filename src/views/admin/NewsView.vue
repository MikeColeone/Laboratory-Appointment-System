<script setup lang="ts">
import HeaderView from './HeaderView.vue'

const details = {
  title: '周末图书馆预约',
}
</script>
<template>
  <div>
    <HeaderView :title="details.title"></HeaderView>
  </div>
</template>
