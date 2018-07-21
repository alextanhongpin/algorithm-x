class DancingNode {
  constructor ({col, row, c}) {
    this.col = col
    this.row = row
    this.U = null // up
    this.D = null // down
    this.L = null // left
    this.R = null // right
    this.C = c
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
  constructor ({col, row, c, name}) {
    super({col, row, c})
    this.S = 0
    this.N = name
    this.C = this
  }
  toColumn (col) {
    let node = this
    while (node.col !== col) {
      node = node.R
    }
    return node
  }
}

module.exports = {
  DancingNode,
  ColumnNode
}
