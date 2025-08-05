<script setup lang="ts">
import { useLiftStore, ELEVATOR_CONFIG } from '../stores/lift'

const { MAX_FLOORS } = ELEVATOR_CONFIG; 

const liftStore = useLiftStore();

const handleAssignTask = (floor: number, direction: 'up' | 'down') => {
  liftStore.assignTask(floor, direction);
};
</script>

<template>
  <div class="outerbox" v-for="i in MAX_FLOORS" :key="i">
    <el-button 
      class="small-square-button" 
      type="primary" @click="handleAssignTask(i, 'up')" 
      plain
      :disabled="i === ELEVATOR_CONFIG.MAX_FLOORS"
    ><el-icon><i-ep-ArrowUpBold /></el-icon></el-button>
    <el-button class="small-square-button" type="primary" disabled>{{ i }}</el-button>
    <el-button 
      class="small-square-button" 
      type="primary" 
      @click="handleAssignTask(i, 'down')" 
      plain
       :disabled="i === ELEVATOR_CONFIG.MIN_FLOORS"
      ><el-icon><i-ep-ArrowDownBold /></el-icon></el-button>
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
