import { defineStore } from 'pinia';
import { shallowRef, ref, reactive, markRaw } from 'vue';
import type { LiftData } from '../types/type';
import type { ShallowRef } from 'vue';

// 电梯配置常量
export const ELEVATOR_CONFIG = {
  MAX_FLOORS: 20,
  MIN_FLOORS: 1,
  MOVE_INTERVAL: 3000,
  RING_OPEN_INTERVAL: 2000,
  RING_CLOSE_INTERVAL: 20,
  DOOR_OPEN_DURATION: 5000,
} as const;

// 电梯类实现
export class Lift implements LiftData {
  id: number;
  doorStatus = ref<'closed' | 'open'>('closed');
  isMoving = ref(false);
  nowFloor = ref(1);
  targetFloors = reactive<number[]>([]);
  disabledButtons = reactive<number[]>([]);
  direction = ref<'up' | 'down' | 'idle'>('idle');
  ringActive = ref(false);

  // 定时器管理
  private timers: Set<NodeJS.Timeout> = new Set();
  private intervals: Set<NodeJS.Timeout> = new Set();

  constructor(id: number) {
    this.id = id;
    this.doorStatus.value = 'closed';
    this.isMoving.value = false;
    this.nowFloor.value = 1;
    this.direction.value = 'idle';
    this.ringActive.value = false;
  }

  // 添加目标楼层到队列（修复去重逻辑）
  addTarget(floor: number) {
    console.log('添加目标楼层:', floor, '当前状态:', this);
    // 避免重复添加目标楼层
    if (!this.targetFloors.includes(floor)) {
      this.targetFloors.push(floor);
    }
    // 避免重复禁用按钮
    if (!this.disabledButtons.includes(floor)) {
      this.disabledButtons.push(floor);
    }
    this.sortTargets();
    if (!this.isMoving.value) {
      this.startMoving();
    }
  }

  // 根据方向排序目标楼层
  private sortTargets() {
    if (this.direction.value === 'up') {
      this.targetFloors.sort((a, b) => a - b);
    } else if (this.direction.value === 'down') {
      this.targetFloors.sort((a, b) => b - a);
    } else {
      // 空闲状态，根据第一个目标楼层确定方向
      if (this.targetFloors.length > 0) {
        const nextTarget = this.targetFloors[0];
        this.direction.value = nextTarget > this.nowFloor.value ? 'up' : 'down';
        this.sortTargets();
      }
    }
  }

  // 开始移动
  private startMoving() {
    if (this.targetFloors.length === 0) return;

    this.isMoving.value = true;
    this.moveToNextTarget();
  }

  // 移动到下一个目标楼层
  private moveToNextTarget() {
    if (this.targetFloors.length === 0) {
      this.isMoving.value = false;
      this.direction.value = 'idle';
      return;
    }

    const nextTarget = this.targetFloors[0];

    // 模拟移动过程
    const moveInterval = setInterval(() => {
      if (this.nowFloor.value < nextTarget) {
        this.nowFloor.value++;
      } else if (this.nowFloor.value > nextTarget) {
        this.nowFloor.value--;
      } else {
        // 到达目标楼层
        clearInterval(moveInterval);
        this.intervals.delete(moveInterval);
        this.targetFloors.shift(); // 移除已完成任务
        const filtered = this.disabledButtons.filter(
          (f) => f !== this.nowFloor.value,
        );
        this.disabledButtons.splice(0, this.disabledButtons.length); // 清空原数组
        this.disabledButtons.push(...filtered); // 批量添加过滤后的元素
        this.open();
      }
    }, ELEVATOR_CONFIG.MOVE_INTERVAL); // 每层移动时间3000ms

    this.intervals.add(moveInterval);
  }

  // 开门操作
  open() {
    this.doorStatus.value = 'open';

    const doorTimer = setTimeout(() => {
      this.close();
      if (this.targetFloors.length > 0) {
        this.moveToNextTarget();
      } else {
        this.isMoving.value = false;
        this.direction.value = 'idle';
      }
    }, ELEVATOR_CONFIG.DOOR_OPEN_DURATION);

    this.timers.add(doorTimer);
  }

  // 关门操作
  close() {
    this.doorStatus.value = 'closed';
  }

  // 触发警报
  flashRing() {
    if (this.ringActive.value) {
      this.ringActive.value = false;
      setTimeout(() => {
        this.ringActive.value = true;
      }, ELEVATOR_CONFIG.RING_CLOSE_INTERVAL);
    } else {
      this.ringActive.value = true;
    }

    setTimeout(() => {
      this.ringActive.value = false;
    }, ELEVATOR_CONFIG.RING_OPEN_INTERVAL);
  }

  destroy() {
    // 清理所有定时器
    this.timers.forEach((timer) => clearTimeout(timer));
    this.intervals.forEach((interval) => clearInterval(interval));
    this.timers.clear();
    this.intervals.clear();
  }
}

export const useLiftStore = defineStore('liftStore', () => {
  // 创建5部电梯
  const lifts: ShallowRef<Lift[]> = shallowRef([
    markRaw(new Lift(1)),
    markRaw(new Lift(2)),
    markRaw(new Lift(3)),
    markRaw(new Lift(4)),
    markRaw(new Lift(5)),
  ]);

  console.log('初始化的电梯数组：', lifts.value);
  console.log('电梯数量：', lifts.value.length); // 正常应为 5

  const getLifts = () => lifts.value;

  // 通过id查找电梯
  const getLiftById = (id: number) => {
    return lifts.value.find((lift) => lift.id === id);
  };

  // 1. 给指定电梯添加目标楼层
  const addTargetToLift = (liftId: number, floor: number) => {
    const lift = getLiftById(liftId);
    if (lift) {
      lift.addTarget(floor);
    }
  };

  // 2. 打开指定电梯门
  const openLiftDoor = (liftId: number) => {
    const lift = getLiftById(liftId);
    if (lift && !lift.isMoving.value) {
      // 移动中不能开门
      lift.open();
    }
  };

  // 3. 关闭指定电梯门
  const closeLiftDoor = (liftId: number) => {
    const lift = getLiftById(liftId);
    if (lift) {
      lift.close();
    }
  };

  // 4. 触发指定电梯响铃
  const triggerLiftRing = (liftId: number) => {
    const lift = getLiftById(liftId);
    if (lift) {
      lift.flashRing();
    }
  };

  // 分配任务给最合适的电梯
  function assignTask(floor: number, direction: 'up' | 'down') {
    console.log('分配任务：楼层', floor, '方向', direction);
    // 1. 查找空闲电梯
    const idleLifts = lifts.value.filter(
      (lift) => lift.direction.value === 'idle' && !lift.isMoving.value,
    );

    if (idleLifts.length > 0) {
      console.log('分配给空闲电梯:', idleLifts[0].id); // 新增
      // 选择距离最近的空闲电梯
      idleLifts.sort(
        (a, b) =>
          Math.abs(a.nowFloor.value - floor) -
          Math.abs(b.nowFloor.value - floor),
      );
      idleLifts[0].addTarget(floor);
      return;
    }

    // 2. 如果没有空闲电梯，选择运行方向一致且路径经过该楼层的电梯
    const sameDirectionLifts = lifts.value.filter((lift) => {
      // 逻辑：用户要上楼时，只选正在上行且未过目标楼层的电梯；下楼同理
      if (direction === 'up') {
        // 用户上行：电梯必须上行，且当前楼层≤目标楼层（还没超过）
        return lift.direction.value === 'up' && lift.nowFloor.value <= floor;
      } else {
        // 用户下行：电梯必须下行，且当前楼层≥目标楼层（还没低于）
        return lift.direction.value === 'down' && lift.nowFloor.value >= floor;
      }
    });

    if (sameDirectionLifts.length > 0) {
      // 选择距离最近的电梯
      sameDirectionLifts.sort(
        (a, b) =>
          Math.abs(a.nowFloor.value - floor) -
          Math.abs(b.nowFloor.value - floor),
      );
      sameDirectionLifts[0].addTarget(floor);
      return;
    }

    // 3. 所有电梯都不合适，随机分配
    const randomIndex = Math.floor(Math.random() * lifts.value.length);
    lifts.value[randomIndex].addTarget(floor);
  }

  // 组件卸载时清理资源
  onScopeDispose(() => {
    lifts.value.forEach((lift) => lift.destroy());
  });

  return {
    lifts,
    getLifts,
    getLiftById,
    addTargetToLift,
    openLiftDoor,
    closeLiftDoor,
    triggerLiftRing,
    assignTask,
  };
});
