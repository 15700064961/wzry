<script setup lang="ts">
import { storeToRefs } from "pinia";

import PartCollect from "../../common/PartCollect/index.vue";

import { YibaoStore } from "@/store";
import { YIBAO_PART } from "@/config";
import { vMouseTip } from "@/directives";
import { usePlayAudio } from "@/hooks";

const $yibaoStore = YibaoStore();
const { part_type } = storeToRefs($yibaoStore);
const { setPartType } = $yibaoStore;

const { playAudio } = usePlayAudio();
</script>

<template>
  <div class="personalized-menu">
    <div
      v-for="(item, index) in YIBAO_PART.PART_KEY_LIST"
      :key="index"
      v-mouse-tip
      class="menu-item"
      @click="playAudio(), setPartType(item)"
    >
      <div
        class="part"
        :class="{
          active: part_type === item,
        }"
      >
        <PartCollect :rate="0.75" :part-key="item" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import url("./index.less");
</style>
