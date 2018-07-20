class DancingNode {
  constructor ({col, row}) {
    this.col = col
    this.row = row
    this.top = null
    this.down = null
    this.left = null
    this.right = null
  }
  linkLeft (leftNode) {
    this.left = leftNode
    this.left.right = this
  }
  linkTop (topNode) {
    this.top = topNode
    this.top.down = this
  }
  unlinkLeft () {
    this.left.right = this.right
  }
  unlinkTop () {
    if (this.top) {
      this.top.down = this.down
    }
  }
  toBottom () {
    let node = this
    while (node && node.down) {
      node = node.down
    }
    return node
  }
}

class ColumnNode extends DancingNode {
  constructor (props) {
    super(props)
    this.size = 0
    // this.name = ''
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
