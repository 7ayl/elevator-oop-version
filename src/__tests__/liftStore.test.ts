import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useLiftStore } from '../stores/lift';

describe('useLiftStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('应该初始化5部电梯', () => {
    const store = useLiftStore();
    console.log('测试中 store.lifts:', store.lifts); // 应输出 Ref 对象
    console.log('测试中 store.lifts.value:', store.lifts.value); // 应输出电梯数组（长度 5）
    expect(store.getLifts().length).toBe(5);
    expect(store.getLifts()[0].id).toBe(1);
    expect(store.getLifts()[4].id).toBe(5);
  });

  it('应该通过id找到电梯', () => {
    const store = useLiftStore();
    const lift = store.getLiftById(3);
    expect(lift?.id).toBe(3);
  });

  it('应该给指定电梯添加目标楼层', () => {
    const store = useLiftStore();
    store.addTargetToLift(2, 5);
    const lift = store.getLiftById(2);
    expect(lift?.targetFloors).toContain(5);
  });

  it('应该打开指定电梯门', () => {
    const store = useLiftStore();
    store.openLiftDoor(1);
    const lift = store.getLiftById(1);
    expect(lift?.doorStatus.value).toBe('open');
  });

  it('移动中不能开门', () => {
    const store = useLiftStore();
    const lift = store.getLiftById(1);
    if (lift) {
      lift.isMoving.value = true;
      store.openLiftDoor(1);
      // 门状态应该仍然是关闭的
      expect(lift.doorStatus.value).toBe('closed');
    }
  });

  it('应该关闭指定电梯门', () => {
    const store = useLiftStore();
    const lift = store.getLiftById(1);
    if (lift) {
      lift.doorStatus.value = 'open';
      store.closeLiftDoor(1);
      expect(lift.doorStatus.value).toBe('closed');
    }
  });

  it('应该触发指定电梯警报', () => {
    const store = useLiftStore();
    store.triggerLiftRing(1);
    const lift = store.getLiftById(1);
    expect(lift?.ringActive.value).toBe(true);
  });

  describe('任务分配算法', () => {
    it('应该优先分配给空闲电梯', () => {
      const store = useLiftStore();
      // 设置第一部电梯空闲
      store.getLifts()[0].direction.value = 'idle';
      store.getLifts()[0].nowFloor.value = 1;

      store.assignTask(5, 'up');

      // 应该分配给第一部电梯
      expect(store.getLifts()[0].targetFloors).toContain(5);
    });

    it('应该选择运行方向一致且未过目标楼层的电梯', () => {
      const store = useLiftStore();
      // 设置第一部电梯正在上行，当前在3楼
      store.getLifts()[0].direction.value = 'up';
      store.getLifts()[0].nowFloor.value = 3;
      // 设置第二部电梯正在下行，当前在8楼
      store.getLifts()[1].direction.value = 'down';
      store.getLifts()[1].nowFloor.value = 8;
      // 设置第三部电梯正在下行，当前在8楼
      store.getLifts()[2].direction.value = 'down';
      store.getLifts()[2].nowFloor.value = 15;
      // 设置第四部电梯正在下行，当前在8楼
      store.getLifts()[3].direction.value = 'down';
      store.getLifts()[3].nowFloor.value = 6;
      // 设置第五部电梯正在下行，当前在8楼
      store.getLifts()[4].direction.value = 'down';
      store.getLifts()[4].nowFloor.value = 2;

      // 分配一个上行任务到5楼
      store.assignTask(5, 'up');

      // 应该分配给第一部电梯，因为它在上行且未超过5楼
      expect(store.getLifts()[0].targetFloors).toContain(5);
      // 第二部电梯不应该收到这个任务
      expect(store.getLifts()[1].targetFloors).not.toContain(5);
    });

    it('所有电梯都不合适时应该随机分配', () => {
      const store = useLiftStore();
      // 设置所有电梯都在反向运行或已过目标楼层
      store.getLifts().forEach((lift) => {
        lift.direction.value = 'down';
        lift.nowFloor.value = 1; // 都在1楼，但用户要下楼
      });

      // 分配一个下行任务到B1楼（假设有地下楼层）
      store.assignTask(-1, 'down');

      // 应该至少有一部电梯收到了任务
      const hasTask = store
        .getLifts()
        .some((lift) => lift.targetFloors.includes(-1));
      expect(hasTask).toBe(true);
    });
  });
});
