<script lang="ts" setup>

const cube1 = ref(), cube2 = ref()
const btns = ref()

onMounted(() => {
  btns.value.forEach((target: HTMLElement, i: number) => {
    target.addEventListener("click", (evt: MouseEvent) => {
      cube1.value.rotate(i + 1, evt.shiftKey ? Rotation.anticlockwise : Rotation.clockwise)
      cube2.value.rotate(i + 1, evt.shiftKey ? Rotation.anticlockwise : Rotation.clockwise)
    })
  })
})

</script>

<template>
  <div flex justify-evenly items-center h-60vh>
    <RubiksCube ref="cube1" style="transform: rotateX(155deg) rotateZ(180deg) rotateY(-45deg);" animated />
    <RubiksCube ref="cube2" style="transform: rotateX(-155deg) rotateZ(180deg) rotateY(135deg);" animated />
  </div>

  <div flex justify-center>
    <button @click="toggleDark()" btn>toggleTheme</button>
  </div>

  <div flex justify-center gap-x-2em>
    <div v-for="(_, i) in 6"
      flex justify-center items-center
      h-60px w-60px border="1 sliod black" select-none text-2em
      :style="{ backgroundColor: colors[i] }"
      ref="btns">
      {{ i + 1 }}
    </div>
  </div>

  <div style="text-align: center; margin:2em">
    <div>input:</div>
    <div>
      1. Keyboard Number 0-5, rotate corresponding face clockwise, anti-clockwise with Shift;
    </div>
    <div>
      2. Click at color square below, same operation as Keyboard.
    </div>
  </div>
</template>

<style lang="scss"></style>
