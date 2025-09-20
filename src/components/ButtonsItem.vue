<script setup lang="ts">
import { useLiftStore, ELEVATOR_CONFIG } from '../stores/lift';
import { computed } from 'vue';
import type { Lift } from '../stores/lift';

const { MAX_FLOORS } = ELEVATOR_CONFIG;

// 接收电梯数据作为属性
const props = defineProps<{
  liftData: Lift;
}>();

const lift = props.liftData;

const liftStore = useLiftStore();

// 各个电梯的门状态
const doorStatus = computed(() => lift.doorStatus.value);

// 计算楼层按钮禁用状态映射
const floorDisabledMap = computed(() => {
  // 生成一个对象：{ 1: false, 2: true, ... }，键为楼层，值为是否禁用
  const map: Record<number, boolean> = {};
  for (let i = 1; i <= MAX_FLOORS; i++) {
    map[i] = lift.disabledButtons.includes(i); // 这里只判断一次，结果被缓存
  }
  return map;
});

// 添加目标楼层
const handleAddTarget = (floor: number) => {
  liftStore.addTargetToLift(lift.id, floor);
};

// 开门操作
const handleOpenDoor = () => {
  liftStore.openLiftDoor(lift.id);
};

// 关门操作
const handleCloseDoor = () => {
  liftStore.closeLiftDoor(lift.id);
};

// 触发警报
const handleTriggerRing = () => {
  liftStore.triggerLiftRing(lift.id);
};
</script>

<template>
  <div class="inner-buttons">
    <!-- 楼层按钮 -->
    <div v-for="i in MAX_FLOORS" :key="i" class="inner-button">
      <el-button
        class="small-square-button"
        @click="handleAddTarget(i)"
        type="info"
        plain
        :disabled="floorDisabledMap[i]"
      >
        <span>
          {{ i }}
        </span>
      </el-button>
    </div>
    <!-- 开门按钮 -->
    <div class="inner-button">
      <el-button
        class="small-square-button"
        @click="handleOpenDoor()"
        type="warning"
        plain
      >
        <el-icon><i-ep-CaretLeft /></el-icon>
        <el-icon><i-ep-CaretRight /></el-icon>
      </el-button>
    </div>
    <!-- 关门按钮 -->
    <div class="inner-button">
      <el-button
        class="small-square-button"
        @click="handleCloseDoor()"
        type="warning"
        plain
      >
        <el-icon><i-ep-CaretRight /></el-icon>
        <el-icon><i-ep-CaretLeft /></el-icon>
      </el-button>
    </div>
    <!-- 警报按钮 -->
    <div class="inner-button">
      <el-button
        class="small-square-button"
        @click="handleTriggerRing()"
        type="danger"
        plain
      >
        <el-icon><i-ep-BellFilled /></el-icon>
      </el-button>
    </div>
    <!-- 门状态显示 -->
    <div class="inner-button">
      <el-button class="small-square-button" type="primary" plain disabled>
        <span>{{ doorStatus === 'closed' ? '关' : '开' }}</span>
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.inner-buttons {
  display: flex;
  flex-wrap: wrap;
  width: 200px;
}

.inner-button {
  display: flex;
  margin: 0 30px 10px 33px;
}
</style>
