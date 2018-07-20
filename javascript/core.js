const { ColumnNode } = require('./node')

const ROOT = 'h'

function makeHeaderLinks (columns = []) {
  let h = new ColumnNode({ col: ROOT })
  let last = columns.reduce((acc, col) => {
    let node = new ColumnNode({ col, name: col })
    console.log(`[makeHeaderLinks] col=${node.col}`)
    node.linkLeft(acc)
    return node
  }, h)
  last.right = h
  last.right.left = last
  h.left = last
  h.left.right = h
  return h
}

function cover (column) {
  let c = column.c
  console.log(`[cover] column=${c.col}`)
  c.right.left = c.left
  c.left.right = c.right
  for (let i = c.down; i !== c; i = i.down) {
    for (let j = i.right; j !== i; j = j.right) {
      // console.log(j.col)
      if (j.col === 'h') return
      j.down.top = j.top
      j.top.down = j.down
      j.c.size -= 1
    }
  }
}

function uncover (column) {
  let c = column
  console.log(`[uncover] column=${c.col}`)
  for (let i = c.top; i !== c; i = i.top) {
    // let hasIncrement = false
    for (let j = i.left; j !== i; j = j.left) {
      if (j.col === 'h') return
      // if (!hasIncrement) {
      j.c.size += 1
      // hasIncrement = true
      // }
      j.down.top = j
      j.top.down = j
    }
  }
  c.right.left = c
  c.left.right = c
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
        let out = sol.c.name
        let node = sol.right
        while (node !== sol) {
          out += node.c.name
          node = node.right
        }
        console.log('output', out)
      })
    }
  }
}

module.exports = {
  ROOT,
  makeHeaderLinks,
  cover,
  uncover,
  Solutions
}
