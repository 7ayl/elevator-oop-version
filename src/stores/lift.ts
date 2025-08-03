import { defineStore } from 'pinia'
import { ref } from 'vue';

class Lift {
    id: number;
    doorStatus: '关' | '开';
    isMoving: boolean;
    nowFloor: number;
    targetFloors: number[]; 
    disabledButtons: number[];
    direction: 'up' | 'down' | 'idle'; 
    ringActive: boolean;

    constructor(id: number) {
        this.id = id;
        this.doorStatus = '关';
        this.isMoving = false;
        this.nowFloor = 1;
        this.targetFloors = [];
        this.disabledButtons = [];
        this.direction = 'idle';
        this.ringActive = false
    }

    // 添加目标楼层到队列
    addTarget(floor: number) {
        // 避免重复添加
        this.targetFloors.push(floor);
        this.disabledButtons.push(floor);
        this.sortTargets(); 
        if (!this.isMoving) {
            this.startMoving();
        }
        
    }

    // 根据方向排序目标楼层
    sortTargets() {
        if (this.direction === 'up') {
            this.targetFloors.sort((a, b) => a - b);
        } else if (this.direction === 'down') {
            this.targetFloors.sort((a, b) => b - a);
        } else {
            // 空闲状态，根据第一个目标楼层确定方向
            if (this.targetFloors.length > 0) {
                const nextTarget = this.targetFloors[0];
                this.direction = nextTarget > this.nowFloor ? 'up' : 'down';
                this.sortTargets();
            }
        }
    }

    // 开始移动
    startMoving() {
        if (this.targetFloors.length === 0) return;
        
        this.isMoving = true;
        this.moveToNextTarget();
    }

    // 移动到下一个目标楼层
    moveToNextTarget() {
        if (this.targetFloors.length === 0) {
            this.isMoving = false;
            this.direction = 'idle';
            return;
        }

        const nextTarget = this.targetFloors[0];
        
        // 模拟移动过程
        const moveInterval = setInterval(() => {
            if (this.nowFloor < nextTarget) {
                this.nowFloor++;
            } else if (this.nowFloor > nextTarget) {
                this.nowFloor--;
            } else {
                // 到达目标楼层
                clearInterval(moveInterval);
                this.open();
                this.targetFloors.shift(); // 移除已完成任务
                this.disabledButtons = this.disabledButtons.filter(f => f !== this.nowFloor);
                // 5秒后关门并继续移动
                setTimeout(() => {
                    this.close();
                    this.moveToNextTarget();
                }, 5000);
            }
        }, 3000); // 每层移动时间500ms
    }

    open() {
        this.doorStatus = '开';
        setTimeout(() => {
            this.close();
        }, 5000);
    }

    close() {
        this.doorStatus = '关';
    }

    flashRing() {
        if (this.ringActive) {
          this.ringActive = false;
          setTimeout(() => {
            this.ringActive = true;
          }, 50);
        } else {
            this.ringActive = true;
        }
        
        setTimeout(() => {
          this.ringActive = false;
        }, 2000);
      }

}

export const useLiftStore = defineStore('liftStore', () => {
    const lifts = ref([
        new Lift(1),
        new Lift(2),
        new Lift(3),
        new Lift(4),
        new Lift(5)
    ]);

    // 分配任务给最合适的电梯
    function assignTask(floor: number) {
        // 1. 查找空闲电梯
        const idleLifts = lifts.value.filter(lift => 
            lift.direction === 'idle' && !lift.isMoving
        );
        
        if (idleLifts.length > 0) {
            // 随机选择空闲电梯
            const randomIndex = Math.floor(Math.random() * idleLifts.length);
            idleLifts[randomIndex].addTarget(floor);
            return;
        }
        
        // 2. 如果没有空闲电梯，选择运行方向一致且路径经过该楼层的电梯
        const sameDirectionLifts = lifts.value.filter(lift => 
            (lift.direction === 'up' && lift.nowFloor <= floor) ||
            (lift.direction === 'down' && lift.nowFloor >= floor)
        );
        
        if (sameDirectionLifts.length > 0) {
            // 选择距离最近的电梯
            sameDirectionLifts.sort((a, b) => 
                Math.abs(a.nowFloor - floor) - Math.abs(b.nowFloor - floor)
            );
            sameDirectionLifts[0].addTarget(floor);
            return;
        }
        
        // 3. 所有电梯都不合适，随机分配
        const randomIndex = Math.floor(Math.random() * lifts.value.length);
        lifts.value[randomIndex].addTarget(floor);
    }

    return {
        lifts,
        assignTask
    }
});




