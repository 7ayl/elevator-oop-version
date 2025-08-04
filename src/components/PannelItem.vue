<script setup lang="ts">
  const props = defineProps({
    liftData: Object
  });

  const lift = props.liftData
</script>

<template>
  <div class="pannel shadow">
    <el-icon :size="20" class="ring" :class="{ active: lift!.ringActive }"><i-ep-WarningFilled /></el-icon>
    <el-icon :class="{ active: lift!.direction === 'up'}"><i-ep-Top /></el-icon>
    <span :class="{ active: lift!.doorStatus === '开' } ">{{ lift!.nowFloor}}</span>
    <el-icon :class="{ active: lift!.direction === 'down'}"><i-ep-Bottom /></el-icon>
    <el-icon :size="20" class="ring" :class="{ active: lift!.ringActive }" ><i-ep-WarningFilled /></el-icon>
  </div>
</template>

<style scoped>

.pannel{
  width: 200px;
  height: 73px;
  background-color: azure;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.pannel .el-icon.active {
  color: crimson !important;
}

.pannel span.active {
  color: crimson !important; 
}

 .pannel .ring.active  {
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
