import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Lift, ELEVATOR_CONFIG } from '../stores/lift';

describe('Lift', () => {
  let lift: Lift;

  beforeEach(() => {
    vi.useFakeTimers(); // 使用假定时器
    lift = new Lift(1);
  });

  afterEach(() => {
    vi.useRealTimers(); // 恢复真实定时器
    lift.destroy(); // 清理资源
  });

  it('应该正确初始化', () => {
    expect(lift.id).toBe(1);
    expect(lift.nowFloor.value).toBe(1);
    expect(lift.direction.value).toBe('idle');
    expect(lift.isMoving.value).toBe(false);
    expect(lift.doorStatus.value).toBe('closed');
    expect(lift.targetFloors).toEqual([]);
    expect(lift.disabledButtons).toEqual([]);
  });

  it('应该添加目标楼层', () => {
    lift.addTarget(5);
    expect(lift.targetFloors).toContain(5);
    expect(lift.disabledButtons).toContain(5);
  });

  it('不应该添加重复的目标楼层', () => {
    lift.addTarget(5);
    lift.addTarget(5);
    // 检查只有一个5
    expect(lift.targetFloors.filter((f) => f === 5).length).toBe(1);
  });

  it('应该在上行时按升序排序目标楼层', () => {
    lift.direction.value = 'up';
    lift.addTarget(5);
    lift.addTarget(3);
    lift.addTarget(7);
    expect(lift.targetFloors).toEqual([3, 5, 7]);
  });

  it('应该在下行时按降序排序目标楼层', () => {
    lift.direction.value = 'down';
    lift.addTarget(5);
    lift.addTarget(3);
    lift.addTarget(7);
    expect(lift.targetFloors).toEqual([7, 5, 3]);
  });

  it('空闲时应根据第一个目标楼层确定方向并排序', () => {
    lift.addTarget(5); // 当前在1楼，所以方向应为上行
    expect(lift.direction.value).toBe('up');
    expect(lift.targetFloors).toEqual([5]);

    lift.addTarget(3); // 上行过程中添加3楼，应该排在5之前
    expect(lift.targetFloors).toEqual([3, 5]);
  });

  it('应该移动到目标楼层', () => {
    lift.addTarget(3);

    // 前进时间，模拟移动
    vi.advanceTimersByTime(ELEVATOR_CONFIG.MOVE_INTERVAL * 3);

    expect(lift.nowFloor.value).toBe(3);
    expect(lift.targetFloors).not.toContain(3);
  });

  it('到达目标楼层后应该开门', () => {
    lift.addTarget(2);

    // 前进时间，模拟移动和开门
    vi.advanceTimersByTime(ELEVATOR_CONFIG.MOVE_INTERVAL * 2 + 100);

    expect(lift.doorStatus.value).toBe('open');
  });

  it('开门后应该在指定时间后关门', () => {
    lift.addTarget(2);

    // 前进时间，模拟移动、开门和关门
    vi.advanceTimersByTime(
      ELEVATOR_CONFIG.MOVE_INTERVAL * 2 +
        ELEVATOR_CONFIG.DOOR_OPEN_DURATION +
        100,
    );

    expect(lift.doorStatus.value).toBe('closed');
  });

  it('应该触发警报', () => {
    lift.flashRing();
    expect(lift.ringActive.value).toBe(true);

    // 前进时间超过警报持续时间
    vi.advanceTimersByTime(ELEVATOR_CONFIG.RING_OPEN_INTERVAL + 100);
    expect(lift.ringActive.value).toBe(false);
  });
});
