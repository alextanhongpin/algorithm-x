const {
  DancingNode
} = require('./node')

const {
  makeHeaderLinks
} = require('./core')

let arr = [
  [0, 0, 1, 0, 1, 1, 0],
  [1, 0, 0, 1, 0, 0, 1],
  [0, 1, 1, 0, 0, 1, 0],
  [1, 0, 0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 1],
  [0, 0, 0, 1, 1, 0, 1]
]

let columns = 'ABCDEFG'.split('')

// Create the column nodes and link them all from left to right
let headerLinks = makeHeaderLinks(columns)

// Create the dancing nodes by connecting them to the column nodes from top to bottom and other nodes from left to right
arr.forEach((rows, row) => {
  let leftNode
  rows.forEach((i, colIndex) => {
    let col = columns[colIndex]
    if (i === 1) {
      let columnNode = headerLinks.toColumn(col)
      // Increment the size
      columnNode.size += 1

      // Go to the most bottom node
      columnNode = columnNode.toBottom()

      let dancingNode = new DancingNode({ col, row })
      dancingNode.linkTop(columnNode)
      if (leftNode) {
        dancingNode.linkLeft(leftNode)
      }
      leftNode = dancingNode
    }
  })
})

// Example traversing down the 'A' column nodes

columns.forEach(col => {
  let columnNode = headerLinks.toColumn(col)
  console.log('columnNode.size', columnNode.size)
  let node = columnNode.down
  while (node) {
    console.log('columnNode(row, col)', node.row, node.col)
    node = node.down
  }
  console.log()
})

let output = []
function search (k = 0) {
// Traverse to the right until
  let c = headerLinks.right
  // If R[h] = h
  while (c && c.col !== 'h') {
    // Cover column c
    let x = c
    c.left.right = c.right
    c.right.left = c.left

    let r = c.down
    while (r) {
      // o is the possible output
      let o = r
      output.push(o.col)
      let j = r.right

      while (j) {
        // cover(j)
        j = j.right
      }
      search(k + 1)
      r = r.down
      // uncover(j)
    }

    // uncover(c)
    c.left.right = x
    c.right.left = x

    c = c.right
  }
}

search()

console.log('output', new Set(output))
