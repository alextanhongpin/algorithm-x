class DancingNode {
  constructor ({col, row, c}) {
    this.col = col
    this.row = row
    this.top = null
    this.down = null
    this.left = null
    this.right = null
    this.c = c
  }

  linkLeft (leftNode) {
    this.left = leftNode
    this.left.right = this
    if (this.right) this.right.left = this
  }
  linkTop (topNode) {
    this.top = topNode
    this.top.down = this
    if (this.down) this.down.top = this
  }
  toBottom () {
    let node = this
    while (node && node.down) {
      node = node.down
    }
    return node
  }
  getColumnNode () {
    return this.c
  }
}

class ColumnNode extends DancingNode {
  constructor (props) {
    super(props)
    this.size = 0
    // this.name = ''
    this.c = this
  }
  toColumn (col) {
    let node = this
    while (node.col !== col) {
      node = node.right
    }
    return node
  }
}

module.exports = {
  DancingNode,
  ColumnNode
}