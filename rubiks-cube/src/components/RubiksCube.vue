<script lang="ts" setup>


const props = defineProps<{
  animated?: boolean
}>()

const data = reactive({
  cube: new RubiksCube(),
  rotateFace: -1,
  rotation: -1
})


const rotateAction = [
  ['x -90deg', 'y -90deg', 'z 90deg', 'x 90deg', 'y 90deg', 'z -90deg'],
  ['x 90deg', 'y 90deg', 'z -90deg', 'x -90deg', 'y -90deg', 'z 90deg'],
]


const faces = ref()


function isMovingBar(face: number, j: number) {
  if (data.rotateFace == -1) return null
  let idx = [1, 2, 4, 5].map(e => (e + data.rotateFace) % 6).indexOf(face)
  if (idx != -1 && RubiksCube.rotateBar[idx][1].indexOf(j) != -1) return ''
  return null
}


function addRotateStyle(target: HTMLElement, rotateFace: number) {
  target.classList.add("rotating")
  target.setAttribute("style", `rotate: ${rotateAction[data.rotation][data.rotateFace]}`)
}
function removeRotateStyle(target: HTMLElement) {
  target.classList.remove("rotating")
  target.removeAttribute("style")
}


function rotate(face: number, dir: number) {// will changed
  // console.log(evt)
  // let r = evt.code.match(/(?:Digit|Numpad)(\d)/)

  // if (r?.[1]) {
  // let face = Number(r?.[1])


  if (face > 0 && face < 7) {
    face--
    // data.rotation = evt.shiftKey ? Rotation.anticlockwise : Rotation.clockwise
    data.rotation = dir

    if (props.animated) {
      if (data.rotateFace !== -1) {
        data.cube.rotate(data.rotateFace, data.rotation)
        removeRotateStyle(faces.value[data.rotateFace])
        data.rotateFace = -1
      }
      data.rotateFace = face
      addRotateStyle(faces.value[data.rotateFace], data.rotateFace)

      // setTimeout(() => { // fuse
      // data.cube.rotate(data.rotateFace, data.rotation)
      // if (data.rotateFace !== -1)
      // removeRotateStyle(faces.value[data.rotateFace])
      // data.rotateFace = -1
      // }, 300)

    } else {
      data.rotateFace = face
      data.cube.rotate(data.rotateFace, data.rotation)
      data.rotateFace = -1
    }
  }
  // }
}


function afterRotateAnimation(evt: TransitionEvent) {// will changed
  if (data.rotateFace != -1) {
    data.cube.rotate(data.rotateFace, data.rotation)
    removeRotateStyle(evt.target as HTMLElement)
    data.rotateFace = -1
  }
}

onMounted(() => {
  if (props.animated) {
    faces.value.forEach(
      (target: HTMLElement) => {
        target.addEventListener("transitionend", afterRotateAnimation)
      }
    )
  }
})

const bais = [[4, 5, 1, 2], [5, 4, 2, 1]]
const bar: { [propName: number]: number[] } = { 1: [0, 3, 6], 2: [0, 1, 2], 4: [2, 5, 8], 5: [6, 7, 8] }

let cellColor = (i: number, j: number, k: number) => {
  const odd = i % 2
  const faceOffset = bais[odd][j]
  const face = data.cube.state[(i + faceOffset) % 6][bar[faceOffset][odd ? k - 1 : 3 - k]]
  return colors[face - 1]
}

defineExpose({
  rotate
});

</script>

<template>
  <div class="magic-cube">

    <template v-for="(_, i) in 6">
      <Transition>
        <div class="face" ref="faces"
          :class="{ animated }">
          <!-- :style="{ rotate: i === data.rotateFace ? rotateAction[data.rotation][i] : '' }"> -->

          <template v-if="animated">
            <div class="side">
              <div v-for="(_, j) in 4"
                class="bar">
                <div v-for="k in 3"
                  :style="{ backgroundColor: cellColor(i, j, k) }" />
              </div>
            </div>
          </template>

          <div class="front"
            @click="$emit('click-at-face', i)">
            <div v-for="(_, j) in 9"
              :style="{ backgroundColor: colors[data.cube.state[i][j] - 1] }"
              :hide="animated ? isMovingBar(i, j) : null" />
          </div>
        </div>
      </Transition>
    </template>
  </div>
</template>

<style lang="scss">
@import "../styles/cube.scss"
</style>
