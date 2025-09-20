<script setup lang="ts">
import Pannel from './components/PanelItem.vue';
import Buttons from './components/ButtonsItem.vue';
import OutButtons from './components/OutButtons.vue';
import { useLiftStore } from './stores/lift';

// 获取电梯store和电梯列表
const liftStore = useLiftStore();
const lifts = liftStore.lifts;
</script>

<template>
  <main class="app">
    <div class="elevator-system">
      <section class="elevators-container" aria-labelledby="elevators-heading">
        <h2 id="elevators-heading" class="visually-hidden">电梯控制面板</h2>

        <!-- 循环渲染每个电梯 -->
        <article
          v-for="lift in lifts"
          :key="lift.id"
          class="elevator"
          :aria-labelledby="`elevator-${lift.id}-heading`"
        >
          <h3 :id="`elevator-${lift.id}-heading`" class="visually-hidden">
            电梯 {{ lift.id }} 控制面板
          </h3>
          <div class="liftInner shadow">
            <!-- 电梯状态面板 -->
            <Pannel :liftData="lift" />
            <!-- 电梯内部按钮 -->
            <Buttons :liftData="lift" />
          </div>
        </article>
      </section>

      <aside
        class="external-controls"
        aria-labelledby="external-controls-heading"
      >
        <h2 id="external-controls-heading" class="visually-hidden">
          楼层呼叫面板
        </h2>
        <div class="sumCon shadow">
          <!-- 外部呼叫按钮 -->
          <OutButtons />
        </div>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.app {
  margin-top: 60px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.elevator-system {
  display: flex;
  flex-direction: row; /* 确保水平排列 */
  flex-wrap: nowrap; /* 防止换行 */
  gap: 20px;
  justify-content: center;
  align-items: flex-start; /* 顶部对齐 */
  max-width: 100%;
  overflow-x: auto; /* 添加水平滚动以防内容过多 */
  padding: 10px;
}

.elevators-container {
  display: flex;
  flex-direction: row; /* 水平排列电梯 */
  flex-wrap: nowrap; /* 防止电梯换行 */
  gap: 20px;
}

.elevator {
  width: 255px;
  height: 640px;
  flex-shrink: 0; /* 防止电梯被压缩 */
}

.liftInner,
.sumCon {
  width: 202px;
  height: 599px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.sumCon {
  display: flex;
  flex-wrap: wrap;
  height: 638px;
  flex-shrink: 0; /* 防止外部控制面板被压缩 */
}

/* 视觉隐藏但保持语义的标题 */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .elevator-system {
    flex-wrap: wrap; /* 在较小屏幕上允许换行 */
    justify-content: center;
  }

  .external-controls {
    margin-top: 30px;
  }
}

@media (max-width: 768px) {
  .elevator {
    width: 100%;
    max-width: 300px;
  }

  .liftInner,
  .sumCon {
    width: 100%;
    max-width: 280px;
  }

  .elevators-container {
    flex-wrap: wrap; /* 在移动设备上允许电梯换行 */
    justify-content: center;
  }
}
</style>
