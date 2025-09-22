// type.ts
import type { Ref } from 'vue';

export interface LiftData {
  id: number;
  doorStatus: Ref<'closed' | 'open'>;
  isMoving: Ref<boolean>;
  nowFloor: Ref<number>;
  targetFloors: number[];
  disabledButtons: number[];
  direction: Ref<'up' | 'down' | 'idle'>;
  ringActive: Ref<boolean>;
}
