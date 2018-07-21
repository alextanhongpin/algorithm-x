const {
  DancingNode
} = require('./node')

const {
  makeHeaderLinks,
  Solutions
} = require('./core')

let data = [
  [0, 0, 1, 0, 1, 1, 0],
  [1, 0, 0, 1, 0, 0, 1],
  [0, 1, 1, 0, 0, 1, 0],
  [1, 0, 0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 1],
  [0, 0, 0, 1, 1, 0, 1]]

let columns = 'ABCDEFG'.split('')

// Create the column nodes and link them all from left to right
let h = makeHeaderLinks(columns)

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
      let columnNode = h.toColumn(columnKey)
      columnNode.S += 1

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
      let columnNode = h.toColumn(columnKey)
      let bottomNode = columnNode.toBottom()

      bottomNode.D = bottomNode.C
      bottomNode.D.U = bottomNode
    }

    if (isLastColumn) {
      let lastNode = prevNodes[prevNodes.length - 1]
      let firstNode = prevNodes[0]
      lastNode.R = firstNode
      lastNode.R.L = lastNode
    }
  }
}

// Example traversing down the 'A' column nodes
columns.forEach(col => {
  let columnNode = h.toColumn(col)
  let node = columnNode.D
  let rows = []
  while (node && node !== columnNode) {
    rows.push(node.row)
    let right = node.R
    while (right && right !== node) {
      right = right.R
    }
    node = node.D
  }
  console.log('Column', columnNode.col, rows, columnNode.S)
})

let solution = Solutions()

function selectColumnNodeHeuristic (h, s = Infinity) {
  let c = h.R

  let debug = ''
  for (let j = h.R; j !== h; j = j.R) {
    debug += j.col
    console.log(`[heuristic] size=${j.S} col=${j.col}`)
    if (j.S < s) {
      s = j.S
      c = j
    }
  }
  console.log('[debug]', debug)
  return c
}

function search (k = 0, h, c) {
  // If R[h] = h, print the current solution (see below) and return.
  if (h.R === h) {
    console.log('[terminate]')
    return solution.print()
  }

  // Choose a column object c
  c = selectColumnNodeHeuristic(h)
  // c = c.R || h.R

  console.log()
  console.log(`[search] k=${k} col=${c.col} size=${c.S}`)

  console.log('print solution for search', k)
  solution.print()

  // Cover column c
  cover(c)

  // For each r ← D[c], D[D[c]], . . . , while r != c
  for (let r = c.D; r !== c; r = r.D) {
    // set Ok ← r
    solution.add(r)

    // for each j ← R[r], R[R[r]], . . . , while j != r
    for (let j = r.R; j !== r; j = j.R) {
      // cover column j
      cover(j)
    }

    // search(k + 1);
    search(k + 1, h, c)

    // set r ← Ok and c ← C[r];
    r = solution.remove()
    c = r.C // Backtrack

    // for each j ← L[r], L[L[r]], . . . , while j != r
    for (let j = r.L; j !== r; j = j.L) {
      // uncover column j
      uncover(j)
    }
  }
  // Uncover column c and return
  return uncover(c)
}

function cover (column) {
  let c = column.C
  console.log(`[cover] column=${c.col}`)

  // Set L[R[c]] ← L[c] and R[L[c]] ← R[c]
  c.R.L = c.L
  c.L.R = c.R

  // For each i ← D[c], D[D[c]], . . . , while i != c
  for (let i = c.D; i !== c; i = i.D) {
    // for each j ← R[i], R[R[i]], . . . , while j != i
    for (let j = i.R; j !== i; j = j.R) {
      if (j.col === 'h') return

      // set U[D[j]] ← U[j], D[U[j]] ← D[j]
      j.D.U = j.U
      j.U.D = j.D

      // and set S[C[j]] ← S[C[j]] − 1
      j.C.S -= 1
    }
  }
}

function uncover (column) {
  let c = column.C
  console.log(`[uncover] column=${c.col}`)

  // For each i = U[c], U[U[c]], . . . , while i != c
  for (let i = c.U; i !== c; i = i.U) {
    // for each j ← L[i], L[L[i]], . . . , while j != i
    for (let j = i.L; j !== i; j = j.L) {
      if (j.col === 'h') return
      // set S[C[j]] ← S[C[j]] + 1
      j.C.S += 1

      // and set U[D[j]] ← j, D[U[j]] ← j
      j.D.U = j
      j.U.D = j
    }
  }
  // Set L[R[c]] ← c and R[L[c]] ← c
  c.R.L = c
  c.L.R = c
}

search(0, h, h)
solution.print()
