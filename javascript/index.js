const {
  DancingNode
} = require('./node')

const {
  makeHeaderLinks,
  ROOT,
  cover,
  uncover,
  Solutions
} = require('./core')

let data = [
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

for (let i = 0, maxRows = data.length; i < maxRows; i += 1) {
  let row = i
  let rows = data[row]
  let prevNodes = []
  let isLastRow = i === maxRows - 1

  for (let j = 0, maxCols = rows.length; j < maxCols; j += 1) {
    let column = rows[j]
    let isOne = column === 1
    let isLastColumn = j === maxCols - 1

    if (isOne) {
      let columnKey = columns[j]
      let columnNode = headerLinks.toColumn(columnKey)
      columnNode.size += 1

      let newNode = new DancingNode({
        row,
        col: columnKey,
        c: columnNode
      })

      if (prevNodes.length > 0) {
        let prevNode = prevNodes[prevNodes.length - 1]
        newNode.linkLeft(prevNode)
      }
      let bottomNode = columnNode.toBottom()
      newNode.linkTop(bottomNode)

      prevNodes.push(newNode)
    }

    if (isLastRow) {
      let columnKey = columns[j]
      let columnNode = headerLinks.toColumn(columnKey)
      let bottomNode = columnNode.toBottom()

      bottomNode.down = bottomNode.c
      bottomNode.down.top = bottomNode
    }

    if (isLastColumn) {
      let lastNode = prevNodes[prevNodes.length - 1]
      let firstNode = prevNodes[0]
      lastNode.right = firstNode
      lastNode.right.left = lastNode
    }
  }
}

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
  console.log('Column', columnNode.col, rows, columnNode.size)
})

let solution = Solutions()

function selectColumnNodeHeuristic (h) {
  let s = Infinity
  let c = h.right
  for (let j = h.right; j !== h; j = j.right) {
    if (j.size < s && j.size > 0) {
      s = j.size
      console.log(s)
      c = j
    }
  }
  return c
}

function search (k = 0, c) {
  // If R[h] = h, print the current solution (see below) and return.
  if (headerLinks.right === headerLinks) {
    return solution.print()
  }

  // Choose a column object c
  // c = selectColumnNodeHeuristic(headerLinks)
  c = c.right

  console.log()
  console.log(`[search] k=${k} col=${c.col} size=${c.size}`)

  // Cover column c
  cover(c)

  // For each r ← D[c], D[D[c]], . . . , while r != c
  for (let r = c.down; r !== c; r = r.down) {
    // set Ok ← r
    solution.add(r)

    // for each j ← R[r], R[R[r]], . . . , while j != r
    for (let j = r.right; j !== r; j = j.right) {
      // cover column j
      cover(j)
    }

    // search(k + 1);
    search(k + 1, c)

    // set r ← Ok and c ← C[r];
    r = solution.remove()
    c = r.c

    // for each j ← L[r], L[L[r]], . . . , while j != r
    for (let j = r.left; j !== r; j = j.left) {
      // uncover column j
      uncover(j)
    }
  }
  // Uncover column c and return
  return uncover(c)
}

search(0, headerLinks)
