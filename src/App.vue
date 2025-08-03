<script setup lang="ts">
import Pannel from './components/PannelItem.vue';
import Buttons from './components/ButtonsItem.vue'
import { useLiftStore } from './stores/lift'

const liftStore = useLiftStore();

const lifts = computed(() => liftStore.lifts)

</script>

<template>
  <div class="app">
    <tr>
      <td v-for="lift in lifts" :key="lift.id">
        <div class="oneLift">
          <div class="liftInner shadow">
            <Pannel :liftData="lift"/>
            <Buttons :liftData="lift"/>
          </div>
        </div>
      </td>
      <td>
        <div class="sumCon shadow">
          <OutButtons/>
        </div>
      </td>
    </tr>
  </div>
</template>

<style src="./assets/main.css" scoped>

/* @media (min-width: 1024px) {
  
} */
</style>
