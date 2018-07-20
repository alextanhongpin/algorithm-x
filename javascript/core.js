const { ColumnNode } = require('./node')

const ROOT = 'h'

function makeHeaderLinks (columns = []) {
  let h = new ColumnNode({ col: ROOT })
  let last = columns.reduce((acc, col) => {
    let node = new ColumnNode({ col })
    node.linkLeft(acc)
    return node
  }, h)
  h.linkLeft(last)
  return last.right
}

function cover (column) {
  let c = column.getColumnNode()
  c.left.right = c.right
  c.right.left = c.left
  for (let i = c.down; i && i !== c; i = i.down) {
    for (let j = i.right; j && j !== i; j = j.right) {
      if (j.down) j.down.top = j.top
      if (j.top) j.top.down = j.down
    }
  }
}

function uncover (column) {
  let c = column
  if (!c) return
  for (let i = c.top; i && i !== c; i = i.top) {
    for (let j = i.left; j && j !== i; j = j.left) {
      j.c.size += 1
      j.down.top = j
      j.top.down = j
    }
  }
  c.right.left = c
  c.left.right = c
}

module.exports = {
  ROOT,
  makeHeaderLinks,
  cover,
  uncover
}
