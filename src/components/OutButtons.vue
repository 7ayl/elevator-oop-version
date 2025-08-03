<script setup lang="ts">
 import { useLiftStore } from '../stores/lift.ts'

const liftStore = useLiftStore();
// const { lifts } = liftStore

const { assignTask } = liftStore

</script>

<template>
  <div class="outerbox" v-for="i in 20" :key="i">
    <el-button type="primary" @click="assignTask(i)" plain><el-icon><i-ep-ArrowUpBold /></el-icon></el-button>
    <el-button type="primary" disabled>{{ i }}</el-button>
    <el-button type="primary" @click="assignTask(i)" plain><el-icon><i-ep-ArrowDownBold /></el-icon></el-button>
  </div>
</template>

<style scoped>
.el-button{
  margin: 0;
}
</style>
