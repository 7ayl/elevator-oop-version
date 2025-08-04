<script setup lang="ts">
import Pannel from './components/PannelItem.vue';
import Buttons from './components/ButtonsItem.vue';
import OutButtons from './components/OutButtons.vue';
import { computed } from 'vue'; 
import { useLiftStore } from './stores/lift'

const liftStore = useLiftStore();

const lifts = computed(() => liftStore.lifts)

</script>

<template>
  <div class="app">
    <table>
      <tbody>
        <tr>
          <td v-for="lift in lifts" :key="lift.id">
            <div class="oneLift">
              <div class="liftInner shadow">
                <Pannel :liftData="lift" />
                <Buttons :liftData="lift" />
              </div>
            </div>
          </td>
          <td>
            <div class="sumCon shadow">
              <OutButtons />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.app{
  margin-top: 60px;
  display: flex;
}

tr{
  display: flex;
}

td {
  width: 255px;
  height: 640px;
  padding: 1px;
}

.oneLift,.sumCon {
  width: 242px;
  height: 638px;
  text-align: center;
}

.liftInner,.sumCon{
  width: 202px;
  height: 599px;
  padding: 20px;
}

.sumCon {
  display: flex;
  flex-wrap: wrap;
}

</style>
