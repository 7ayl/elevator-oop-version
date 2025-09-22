<script setup lang="ts">
import type { Lift } from '../stores/lift';
const props = defineProps<{
  liftData: Lift;
}>();

const lift = props.liftData;
</script>

<template>
  <div class="pannel shadow">
    <el-icon :size="20" class="ring" :class="{ active: lift?.ringActive.value }"
      ><i-ep-WarningFilled
    /></el-icon>
    <el-icon :class="{ active: lift?.direction.value === 'up' }"
      ><i-ep-Top
    /></el-icon>
    <span :class="{ active: lift?.doorStatus.value === 'open' }">{{
      lift?.nowFloor
    }}</span>
    <el-icon :class="{ active: lift?.direction.value === 'down' }"
      ><i-ep-Bottom
    /></el-icon>
    <el-icon :size="20" class="ring" :class="{ active: lift?.ringActive.value }"
      ><i-ep-WarningFilled
    /></el-icon>
  </div>
</template>

<style scoped>
.pannel {
  width: 200px;
  height: 73px;
  background-color: #909399b0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.pannel .el-icon.active {
  color: rgb(255, 52, 52);
}

.pannel span.active {
  color: rgb(255, 58, 58);
}

.pannel .ring.active {
  animation: flash 2s ease;
}

@keyframes flash {
  0% {
    color: crimson;
    transform: rotate(0deg) scale(1);
  }
  50% {
    color: crimson;
    transform: rotate(180deg) scale(1.15);
  }
  100% {
    color: crimson;
    transform: rotate(360deg) scale(1);
  }
}
</style>
