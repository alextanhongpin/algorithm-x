const { ColumnNode } = require('./node')

function makeHeaderLinks (columns = []) {
  let h = new ColumnNode({ col: 'h' })
  let last = columns.reduce((acc, col) => {
    let node = new ColumnNode({ col })
    node.linkLeft(acc)
    return node
  }, h)
  h.linkLeft(last)
  return last.right
}

module.exports = {
  makeHeaderLinks
}
