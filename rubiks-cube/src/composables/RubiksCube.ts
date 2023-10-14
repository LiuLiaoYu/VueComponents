export enum Rotation {
  clockwise = 1,
  anticlockwise = 0,
}

export class RubiksCube {
  state: number[][]
  static rrot90 = [6, 3, 0, 7, 4, 1, 8, 5, 2]
  static lrot90 = [2, 5, 8, 1, 4, 7, 0, 3, 6]
  static rotateBar: [number, number[]][] = [[1, [0, 3, 6]], [2, [0, 1, 2]], [4, [2, 5, 8]], [5, [6, 7, 8]]]

  constructor() {
    this.state = [1, 2, 3, 4, 5, 6].map(v => Array(9).fill(v))
    // this.colors = ["white", 'blue', 'orange', "yellow", "green", 'red']
  }

  rotate(face: number, dir: Rotation) {
    const offset = ((face & 1) ^ dir) * 2 - 1 // value is -1 or 1

    const tempBarState = RubiksCube.rotateBar.map(([f, bar]) => bar.map(j => this.state[(f + face) % 6][j]))

    RubiksCube.rotateBar.forEach(
      ([f, bar], i) =>
        bar.forEach((j, k) =>
          this.state[(f + face) % 6][j] = tempBarState[(i + offset + 4) % 4][k]))

    this.state[face] = (offset > 0 ? RubiksCube.rrot90 : RubiksCube.lrot90).map(j => this.state[face][j])
  }

  restore() {
    this.state = [1, 2, 3, 4, 5, 6].map(v => Array(9).fill(v))
  }
}

export const colors = ['white', 'blue', 'orange', 'yellow', 'green', 'red']

// export const cube = new RubiksCube()
// export const data = reactive({
// cube,
// rotateFace: -1,
// rotation: -1,
// })

//  example
//
// let cube = new RubiksCube()
// cube.rotate(0, Rotation.clockwise)
// cube.rotate(1, Rotation.clockwise)
// cube.rotate(2, Rotation.clockwise)
// for (let i of cube.state) console.log(i)
