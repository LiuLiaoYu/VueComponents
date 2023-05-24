import { Svg, Circle, Text, NumberAlias } from '@svgdotjs/svg.js'

class DiscreteRandom {
  probability: number[]

  constructor(probability: number[]) {
    let sum = probability.reduce((sum, x) => sum + x, 0), acc = 0
    this.probability = probability.map(x => acc += x / sum)
  }

  bisearch(num: number) {
    let l = 0, r = this.probability.length, mid = 0
    while (l < r) {
      mid = Math.floor((l + r) / 2)
      if (this.probability[mid] <= num) l = mid + 1
      else r = mid
    }
    return l
  }
  rand() {
    return this.bisearch(Math.random())
  }
}


class TreeNode {
  id: number
  x: number
  isEmpty: boolean = false
  // y: number
  child: TreeNode[]
  color: string = "black"
  constructor(id: number, ...child: (TreeNode | null)[]) {
    this.x = 0
    // this.y = 0
    this.id = id
    this.child = child.map(x => x === null ? TreeNode.empty() : x)
    // this.color = Math.random() < 0.1 ? "red" : "black"
  }
  static empty() {
    const a = new TreeNode(-1)
    a.isEmpty = true
    a.color = "black"
    return a
  }
}


class Tree {
  root: TreeNode | null
  min_interval: number
  num: number = 0
  justify_flag: boolean = true
  x_min: number = 0
  x_max: number = 0
  layer_interval: number = 70
  x_offset = 30
  y_offset = 30

  constructor(interval: number) {
    this.min_interval = interval
    this.root = null
  }

  move(rt: TreeNode, dx: number) {
    console.log(rt.id)
    rt.x += dx
    for (let child of rt.child) {
      if (child.color === "black") {
        this.move(child, dx)
      }
    }
  }


  _justify(rt: TreeNode, layer: number, layer_prev: number[]) {

    // for (let child of rt.child) this._justify(child, layer + 1, layer_prev)

    let child0 = rt.child[0], child1 = rt.child[1]

    if (child0 && child0.color === "red")
      this._justify(child0, layer, layer_prev)
    else if (child0)
      this._justify(child0, layer + 1, layer_prev)

    if (child1 && child1.color === "black")
      this._justify(child1, layer + 1, layer_prev)


    // for (let [idx, child] of rt.child.entries()) {
    // }

    let q = rt.child.filter(x => x.color != "red")
    if (q.length > 0) rt.x = q.reduce((sum, child) => sum + child.x, 0) / q.length

    // if (rt.child.length > 0) rt.x = rt.child.reduce((sum, child) => sum + child.x, 0) / rt.child.length
    if (rt.x - layer_prev[layer] < this.min_interval) {
      if (rt.id == 4) console.log(rt)
      this.move(rt, layer_prev[layer] + this.min_interval - rt.x)
      this.justify_flag = true
    }
    layer_prev[layer] = rt.x

    if (child1 && child1.color === "red")
      this._justify(child1, layer, layer_prev)


    this.x_min = Math.min(this.x_min, rt.x)
    this.x_max = Math.max(this.x_max, rt.x)
  }

  justify() {
    this.x_min = 1e6
    this.x_max = -1e6
    let i = 2
    do {
      this.justify_flag = false
      let layer_prev = Array(40).fill(-this.min_interval)
      this._justify(this.root as TreeNode, 0, layer_prev)
    }
    while (this.justify_flag)
  }

  _random(deepth: number, branch: number, dtb: DiscreteRandom): TreeNode | null {
    if (deepth == 0) return null
    if (dtb.rand() < deepth) {
      let num = this.num++
      let child = Array.from({ length: branch }, x => this._random(deepth - 1, branch, dtb))
      return new TreeNode(num, ...(child.some(x => x !== null) ? child : []))
      // return new TreeNode(num, ...Array.from({ length: branch }, x => this._random(deepth - 1, branch, dtb)))
    }
    return null
  }

  random(deepth: number, branch: number = 2) {
    let dtb = new DiscreteRandom(Array.from({ length: deepth }, (x, i) => 1 / (i + 1)))
    this.num = 1
    this.root = this._random(deepth, branch, dtb)
  }

  _clear(rt: TreeNode) {
    rt.x = 0
    for (let child of rt.child) {
      // if (child.color === "black")
      this._clear(child)
    }
  }

  clear() {
    this._clear(this.root as TreeNode)
  }
  _draw(root: TreeNode | null, layer: number, svg: Svg) {
    if (root === null) return

    let y_0 = layer * this.layer_interval + this.y_offset
    let y_1 = (layer + 1) * this.layer_interval + this.y_offset

    for (let [idx, child] of root.child.entries())
      if (!child.isEmpty) {
        if (child.color === "red")
          svg.line(root.x + this.x_offset, y_0, child.x + this.x_offset, y_0).stroke({ color: "black", width: 1 })
        else
          svg.line(root.x + this.x_offset, y_0, child.x + this.x_offset, y_1).stroke({ color: "black", width: 1 })
      }

    let n = new Node(root.id.toString(), root.color, 32)

    if (root.color === "black")
      n.move(root.x + this.x_offset, y_0)
    else
      n.move(root.x + this.x_offset, y_0)

    svg.add(n)

    for (let child of root.child)
      if (!child.isEmpty)
        if (child.color === "black")
          this._draw(child, layer + 1, svg)
        else
          this._draw(child, layer, svg)
  }

  genSVG() {
    let svg = new Svg()
    this._draw(this.root, 0, svg)
    svg.size(this.x_max + this.x_offset * 2, 400)
    return svg
  }
}


class Node extends Svg {
  _r: number
  constructor(txt: string, color: string = "black", r: number = 64) {
    super()
    this.size(r, r).viewbox(-r / 2 - 1, -r / 2 - 1, r + 2, r + 2)
    this.circle(r).fill(color).stroke("black").cx(0).cy(0)
    this.plain(txt).fill("white")
      .font({ size: Math.ceil(7 / 16 * r), family: "Fira Code", weight: 800 })
      .attr({ "dominant-baseline": "middle", "text-anchor": "middle", })
    this._r = r
  }
  move(x: number, y: number) {
    return super.move(x - this._r / 2, y - this._r / 2)
  }
}


export { Node }


export { TreeNode, Tree }
