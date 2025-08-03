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
/* .active {
  color: crimson;
} */
</style>
