<script setup lang="ts">
  const props = defineProps({
    liftData: Object
  });

  const lift = props.liftData
</script>

<template>
  <div class="buttons">
    <div v-for="i in 20" :key="i" class="button">
      <el-button @click="lift!.addTarget(i)" type="info" plain :disabled="lift!.disabledButtons.includes(i)">
        <span>
          {{ i }}
        </span>
      </el-button>
    </div>
    <div class="button">
      <el-button @click="lift!.open()" type="warning" plain>
        <el-icon><i-ep-CaretLeft /></el-icon>
        <el-icon><i-ep-CaretRight /></el-icon>
      </el-button>
    </div>
    <div class="button">
      <el-button @click="lift!.close()" type="warning" plain>
        <el-icon><i-ep-CaretRight /></el-icon>
        <el-icon><i-ep-CaretLeft /></el-icon>
      </el-button>
    </div>
    <div class="button">
      <el-button @click="lift!.flashRing()" type="danger" plain>
        <el-icon><i-ep-BellFilled /></el-icon>
      </el-button>
    </div>
    <div class="button">
      <el-button type="primary" plain disabled>
        <span>{{ lift!.doorStatus }}</span>
      </el-button>
    </div>
  </div>
</template>

<style scoped>
  
</style>
