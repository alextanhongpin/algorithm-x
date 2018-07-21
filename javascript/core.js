const { ColumnNode, DancingNode } = require('./node')

const ROOT = 'h'

function initializeColumns (n) {
  let labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (n < labels.length) {
    return labels.split('').slice(0, n)
  }
  return Array(n).fill(0).map((_, i) => (i + 1).toString())
}

function initializeHeaders (columns = []) {
  let h = new ColumnNode(ROOT)
  let last = columns.reduce((acc, col) => {
    let node = new ColumnNode(col)
    node.linkLeft(acc)
    return node
  }, h)
  last.R = h
  last.R.L = last
  h.L = last
  h.L.R = h
  return h
}

function printSolution (o = []) {
  if (!o.length) {
    console.log('[solution] not found')
  }
  o.forEach((c) => {
    let out = c.C.N
    let node = c.R
    while (node !== c) {
      out += node.C.N
      node = node.R
    }
    console.log('[solution]', out)
  })
}

function initializeDancingLinks (h, data, columns) {
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

        let newNode = new DancingNode(columnNode)

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

      if (isLastColumn && prevNodes.length) {
        let lastNode = prevNodes[prevNodes.length - 1]
        let firstNode = prevNodes[0]
        lastNode.R = firstNode
        lastNode.R.L = lastNode
      }
    }
  }
}

// // Example traversing down the 'A' column nodes
function traverse (columns, h) {
  columns.forEach(col => {
    let columnNode = h.toColumn(col)
    let node = columnNode.D
    let rows = []
    while (node && node !== columnNode) {
      rows.push(node.C.N)
      let right = node.R
      while (right && right !== node) {
        right = right.R
      }
      node = node.D
    }
    console.log('[traverse]', columnNode.N, columnNode.S, rows)
  })
}

function selectColumnNodeHeuristic (h, s = Infinity) {
  let c = h.R
  for (let j = h.R; j !== h; j = j.R) {
    if (j.S < s) {
      s = j.S
      c = j
    }
  }
  return c
}

function search (k = 0, h, s = []) {
  if (h.R === h) {
    return printSolution(s)
  }
  let c = selectColumnNodeHeuristic(h)
  cover(c)
  for (let r = c.D; r !== c; r = r.D) {
    s.push(r)
    for (let j = r.R; j !== r; j = j.R) {
      cover(j)
    }
    search(k + 1, h, s)
    r = s.pop()
    c = r.C
    for (let j = r.L; j !== r; j = j.L) {
      uncover(j)
    }
  }
  return uncover(c)
}

function cover (column) {
  let c = column.C
  c.R.L = c.L
  c.L.R = c.R

  for (let i = c.D; i !== c; i = i.D) {
    for (let j = i.R; j !== i; j = j.R) {
      if (j.col === 'h') return
      j.D.U = j.U
      j.U.D = j.D
      j.C.S -= 1
    }
  }
}

function uncover (column) {
  let c = column.C

  for (let i = c.U; i !== c; i = i.U) {
    for (let j = i.L; j !== i; j = j.L) {
      if (j.col === 'h') return

      j.C.S += 1

      j.D.U = j
      j.U.D = j
    }
  }
  c.R.L = c
  c.L.R = c
}

module.exports = {
  initializeColumns,
  initializeHeaders,
  printSolution,
  initializeDancingLinks,
  traverse,
  selectColumnNodeHeuristic,
  search
}
