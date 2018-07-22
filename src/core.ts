import { 
  ColumnNode, 
  Cell,
  Metadata,
  Node,
  initializeRootNode,
  initializeColumnNode,
  initializeDLXNode,
  Row,
  initializeMetadata,
} from './model'

export function initializeColumns (n: number): string[] {
  let labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (n < labels.length) {
    return labels.split('').slice(0, n)
  }
  return Array(n).fill(0).map((_, i) => (i + 1).toString())
}

export function initializeHeaders (columns: string[] = []): ColumnNode {
  let rootNode = initializeRootNode()
  let linkedColumnNode = columns.reduce((prev: Node, name: string) => {
    return initializeColumnNode(name).linkLeft(prev)
  }, rootNode)
  return rootNode.linkLeft(linkedColumnNode)
}

export function initializeGrid (size: number): number[][] {
  return Array(size).fill([])
    .map(() => Array(size).fill(0))
}

export function initialiseArray (size: number): number[] {
  return Array(size).fill(0)
}

export function printSolutionSudoku (solution: Node[] = []) {
  let size = 9
  if (!solution.length) {
    return console.log('[solution] not found')
  }
  let grid = initializeGrid(size)
  solution.forEach((n: Node) => {
    let m: Metadata = n.metadata
    let { row, col, val } = m
    grid[row][col] = val
  })
  console.log()
  console.log('OUTPUT:')
  console.log()
  prettyPrintSolution(grid)
  console.log()
}


export function prettyPrintSolution (solution: number[][] = []) {
  solution.forEach((row: number[], i: number) => {
    if (i > 0 && i % 3 === 0) {
      let separator = Array(7 * 3).fill('-')
      separator[6] = '+'
      separator[14] = '+'
      console.log('', separator.join(''), '')
    }
    let g1 = row.slice(0, 3).join(' ')
    let g2 = row.slice(3, 6).join(' ')
    let g3 = row.slice(6, 9).join(' ')
    let columns = [g1, g2, g3].join(' | ')
    console.log('', columns, '')
  })
}

export function initializeDancingLinks (h: ColumnNode, grid: Row, columns: string[]) {
  for (let row = 0, maxRow = grid.length; row < maxRow; row += 1) {
    let cell: Cell = grid[row]
    let { 
      data: rows, 
      row: _row,
      col: _col,
      val: _val
    } = cell

    let prevNodes = []
    let isLastRow = row === maxRow - 1

    for (let col = 0, maxCol = rows.length; col < maxCol; col += 1) {
      let val = rows[col]
      let isOne = val === 1
      let isLastColumn = col === maxCol - 1
      if (isOne) {
        let columnName = columns[col]
        let columnNode = h.traverseRight(columnName)
        columnNode.S += 1

        let newNode = initializeDLXNode(columnNode)
        newNode.metadata = initializeMetadata(_row, _col, _val)

        if (prevNodes.length > 0) {
          let prevNode = prevNodes[prevNodes.length - 1]
          newNode.linkLeft(prevNode)
        }
        let bottomNode = columnNode.traverseDown()
        newNode.linkTop(bottomNode)

        prevNodes.push(newNode)
      }

      if (isLastRow) {
        let columnName = columns[col]
        let columnNode = h.traverseRight(columnName)
        let bottomNode = columnNode.traverseDown()

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

export function selectColumnNodeHeuristic (h: ColumnNode, s: number = Infinity) {
  let c = h.R
  for (let j = h.R; j !== h; j = j.R) {
    // Select column with the smallest size
    if (j.S < s) {
      s = j.S
      c = j
    }
  }
  return c
}

export function search (
  k: number = 0, 
  h: ColumnNode, 
  s: Node[] = [], 
  callback: Function
) {
  if (h.R === h) {
    console.log('[terminate] complete')
    // printSolution, etc
    return callback(s)
  }
  let c = selectColumnNodeHeuristic(h)
  cover(c)
  for (let r = c.D; r !== c; r = r.D) {
    s.push(r)
    for (let j = r.R; j !== r; j = j.R) {
      cover(j)
    }
    search(k + 1, h, s, callback)
    r = s.pop() || r
    c = r.C
    for (let j = r.L; j !== r; j = j.L) {
      uncover(j)
    }
  }
  uncover(c)
}

export function cover (column: Node): void {
  let c = column.C
  c.R.L = c.L
  c.L.R = c.R
  for (let i = c.D; i !== c; i = i.D) {
    for (let j = i.R; j !== i; j = j.R) {
      j.D.U = j.U
      j.U.D = j.D
      j.C.S -= 1
    }
  }
}

export function uncover (column: Node): void {
  let c = column.C
  for (let i = c.U; i !== c; i = i.U) {
    for (let j = i.L; j !== i; j = j.L) {
      j.C.S += 1
      j.D.U = j
      j.U.D = j
    }
  }
  c.R.L = c
  c.L.R = c
}
