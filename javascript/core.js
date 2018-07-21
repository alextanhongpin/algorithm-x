const { ColumnNode } = require('./node')

const ROOT = 'h'

function makeHeaderLinks (columns = []) {
  let h = new ColumnNode({ col: ROOT })
  let last = columns.reduce((acc, col) => {
    let node = new ColumnNode({ col, name: col })
    console.log(`[makeH] col=${node.col}`)
    node.linkLeft(acc)
    return node
  }, h)
  last.R = h
  last.R.L = last
  h.L = last
  h.L.R = h
  return h
}

function Solutions () {
  let output = []
  return {
    add (node) {
      output.push(node)
    },
    remove () {
      return output.pop()
    },
    print () {
      output.forEach((sol) => {
        let out = sol.C.N
        let node = sol.R
        while (node !== sol) {
          out += node.C.N
          node = node.R
        }
        console.log('[solution]', out)
      })
    }
  }
}

module.exports = {
  ROOT,
  makeHeaderLinks,
  Solutions
}
