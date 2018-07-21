class DancingNode {
  constructor (C) {
    this.U = null // up
    this.D = null // down
    this.L = null // left
    this.R = null // right
    this.C = C // columnNode
  }
  linkLeft (leftNode) {
    this.L = leftNode
    this.L.R = this
    leftNode.R = this
    if (this.R) this.R.L = this
  }
  linkTop (topNode) {
    this.U = topNode
    this.U.D = this
    if (this.D) this.D.U = this
  }
  toBottom () {
    let node = this
    while (node && node.D) {
      node = node.D
    }
    return node
  }
}

class ColumnNode extends DancingNode {
  constructor (name) {
    super()
    this.S = 0
    this.N = name
    this.C = this
  }
  toColumn (name) {
    let node = this
    while (node.N !== name) {
      node = node.R
    }
    return node
  }
}

module.exports = {
  DancingNode,
  ColumnNode
}
