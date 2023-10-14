<script lang="ts" setup>
import { onMounted } from 'vue'
import { Tree } from './Tree'

onMounted(() => { svg.addTo('#box') })

let tr = new Tree(40)
tr.random(6)
tr.clear()
tr.justify()
let svg = tr.genSVG()



</script>
<template>
  <div w-1200px m-auto>
    <div text-6xl>Random Tree</div>
    <div flex p-3rem justify-center items-center>
      <div border-1 border-dashed p-0 id="box"></div>
    </div>
  </div>
</template>

<style lang="scss">
svg {
  user-select: "none"
}
</style>

