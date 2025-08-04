<script setup lang="ts">
 import { useLiftStore } from '../stores/lift.ts'

const liftStore = useLiftStore();
// const { lifts } = liftStore

const { assignTask } = liftStore

</script>

<template>
  <div class="outerbox" v-for="i in 20" :key="i">
    <el-button class="small-square-button" type="primary" @click="assignTask(i)" plain><el-icon><i-ep-ArrowUpBold /></el-icon></el-button>
    <el-button class="small-square-button" type="primary" disabled>{{ i }}</el-button>
    <el-button class="small-square-button" type="primary" @click="assignTask(i)" plain><el-icon><i-ep-ArrowDownBold /></el-icon></el-button>
  </div>
</template>

<style scoped>
.small-square-button{
  margin: 0;
}

.outerbox{
  width: 94px;
  height: 33px;
  display: flex;
  justify-content: center;
  margin: 0 1px 30px 3px;
}
</style>
