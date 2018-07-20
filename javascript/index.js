const {
  DancingNode
} = require('./node')

const {
  makeHeaderLinks,
  ROOT,
  cover,
  uncover
} = require('./core')

let arr = [
  [0, 0, 1, 0, 1, 1, 0],
  [1, 0, 0, 1, 0, 0, 1],
  [0, 1, 1, 0, 0, 1, 0],
  [1, 0, 0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 1],
  [0, 0, 0, 1, 1, 0, 1]
]

let ROWS_LENGTH = arr.length
let COLUMNS_LENGTH = arr[0].length

let columns = 'ABCDEFG'.split('')

// Create the column nodes and link them all from left to right
let headerLinks = makeHeaderLinks(columns)

// Create the dancing nodes by connecting them to the column nodes from top to bottom and other nodes from left to right
arr.forEach((rows, row) => {
  let leftNode
  let leftNodes = []
  const isLastRow = row === arr.length - 1
  rows.forEach((i, colIndex) => {
    const isLastColumn = colIndex === rows.length - 1
    let col = columns[colIndex]
    if (i === 1) {
      let columnNode = headerLinks.toColumn(col)
      let c = headerLinks.toColumn(col)

      // Increment the size
      columnNode.size += 1

      // Go to the most bottom node
      columnNode = columnNode.toBottom()

      let dancingNode = new DancingNode({ col, row, c })
      dancingNode.linkTop(columnNode)
      if (leftNode) {
        dancingNode.linkLeft(leftNode)
      }
      leftNode = dancingNode
      leftNodes.push(leftNode)

      // The last row, bind whatever value back to the top
      if (isLastRow) {
        columnNode.down = columnNode.c
        columnNode.down.top = columnNode
      }
    }

    if (isLastColumn) {
      // Is the last column, bind back to the first one
      if (leftNodes.length > 1) {
        leftNode.right = leftNodes[0]
        leftNode.right.left = leftNode
      }
    }
  })
})

// Example traversing down the 'A' column nodes
columns.forEach(col => {
  let columnNode = headerLinks.toColumn(col)
  let node = columnNode.down
  let rows = []
  while (node && node !== columnNode) {
    rows.push(node.row)
    let right = node.right
    while (right && right !== node) {
      right = right.right
    }
    node = node.down
  }
  console.log('Column', columnNode.col, rows)
})

function Solutions () {
  let solutions = {}
  return {
    add (k, node) {
      console.log(k)
      if (!solutions[k]) {
        solutions[k] = []
      }
      solutions[k].push(node)
    },
    remove (k) {
      let o = solutions[k]
      delete solutions[k]
      return o
    },
    print () {
      Object.entries(solutions).forEach(([i, sols]) => {
        sols.forEach((sol) => {
          let node = sol
          let output = []
          while (node && node.col !== ROOT) {
            output.push(node.col)
            node = node.right
          }
          console.log(`sol ${i}: ${output.join(' ')} [row:col] [${sol.row + 1}:${sol.col}]`)
        })
      })
    }
  }
}

let solution = Solutions()

let c = headerLinks

function search (k = 0) {
  c = c.right
  console.log('start search', k, c.col)
  if (c.col === ROOT) {
    solution.print()
    return
  }
  cover(c)
  for (let row = c.down; row && row !== c; row = row.down) {
    console.log('k', k, row.row, row.col)
    let key = `${k}:${row.col}:${row.row}`
    solution.add(key, row)
    for (let rightNode = row.right; rightNode && rightNode !== row; rightNode = rightNode.right) {
      cover(rightNode)
    }
    search(k + 1)
    row = solution.remove(key)
    c = row.c

    for (let leftNode = row.left; leftNode && leftNode !== row; leftNode = leftNode.left) {
      uncover(leftNode)
    }
  }
  uncover(c)
}

search()
