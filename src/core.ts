import {
  Metadata,
  Node,
  initializeRootNode,
  initializeColumnNode,
  initializeMetadata,
  initializeNode,
} from './model'

const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

type ColumnLabels = string[]

// initializeColumnLabels will create an array of labels from a given limit
export function initializeColumnLabels(n: number): ColumnLabels {
  let labels = [...ALPHABETS]
  if (n < labels.length) {
    return labels.slice(0, n)
  }
  return Array(n).fill(0).map((_, i) => (i + 1).toString())
}

export function initializeHeaderColumns(labels: ColumnLabels = []): Node {
  let rootNode = initializeRootNode()
  let currNode = labels.reduce((prev: Node, name: string) => {
    let curr = initializeColumnNode(name)
    curr.left = prev
    curr.left.right = curr
    return curr
  }, rootNode)
  rootNode.left = currNode
  rootNode.left.right = rootNode
  return rootNode
}

export function initializeCircularDoublyLinkedToroidaList(
  metadata: Metadata[],
  columnLabels: ColumnLabels
): Node {
  // Setup header node
  let rootNode = initializeHeaderColumns(columnLabels)
  let dimension = (m: Metadata[]): [number, number] =>
    [m.length, m[0].data.length]
  let isOne = (n: number): boolean => n === 1
  let [maxRow, maxCol] = dimension(metadata)
  let isLastRow = (row: number): boolean => row === maxRow - 1
  let isLastColumn = (col: number): boolean => col === maxCol - 1

  metadata.forEach((meta, row) => {
    let _metadata = initializeMetadata(meta.column, meta.row, meta.value, [])
    let prevNodes: Node[] = []

    meta.data.forEach((value: number, column: number) => {
      let name = columnLabels[column]
      if (isOne(value)) {
        let columnNode = traverseRight(rootNode, name)
        columnNode.size += 1
        let node = initializeNode(columnNode, _metadata)

        // Bind to the previous node on the left
        if (prevNodes.length > 0) {
          let prevNode = prevNodes[prevNodes.length - 1]
          node.left = prevNode
          node.left.right = node
        }

        // Bind back to the top node
        let bottomNode = traverseDown(columnNode)
        node.up = bottomNode
        node.up.down = node

        prevNodes.push(node)
      }

      // Link top and bottom nodes together
      if (isLastRow(row)) {
        let lastNode = traverseRight(rootNode, name)
        let bottomNode = traverseDown(lastNode)
        bottomNode.down = bottomNode.columnNode
        bottomNode.down.up = bottomNode
      }

      // Link left and right nodes together
      if (isLastColumn(column) && prevNodes.length) {
        let lastNode = prevNodes[prevNodes.length - 1]
        let firstNode = prevNodes[0]
        lastNode.right = firstNode
        lastNode.right.left = lastNode
      }
    })
  })
  return rootNode
}

export function smallestColumnSize(
  rootNode: Node,
  size: number = Infinity
) {
  let c = rootNode.right
  for (let j = rootNode.right; j !== rootNode; j = j.right) {
    if (j.size < size) {
      size = j.size
      c = j
    }
  }
  return c
}

export function* search(
  depth: number = 0,
  rootNode: Node,
  solution: Node[] = [],
): IterableIterator<Node[]> {
  // Termination condition
  if (rootNode.right === rootNode) {
    // Return a copy without pointing back to the reference,
    // as the values might be replaced
    console.log('[terminate]')
    return [...solution]
  }
  // Start with the smallest column node to minimize search
  let c = smallestColumnSize(rootNode)
  cover(c)
  for (let r = c.down; r !== c; r = r.down) {
    solution.push(r)
    for (let j = r.right; j !== r; j = j.right) {
      cover(j)
    }
    yield [...solution]
    let result = yield* search(depth + 1, rootNode, solution)
    if (result) {
      return result
    }
    r = solution.pop() || r
    c = r.columnNode
    for (let j = r.left; j !== r; j = j.left) {
      uncover(j)
    }
  }
  uncover(c)
}

function cover(node: Node): void {
  let columnNode = node.columnNode
  columnNode.right.left = columnNode.left
  columnNode.left.right = columnNode.right
  for (let i = columnNode.down; i !== columnNode; i = i.down) {
    for (let j = i.right; j !== i; j = j.right) {
      j.down.up = j.up
      j.up.down = j.down
      j.columnNode.size -= 1
    }
  }
}

function uncover(node: Node): void {
  let columnNode = node.columnNode
  for (let i = columnNode.up; i !== columnNode; i = i.up) {
    for (let j = i.left; j !== i; j = j.left) {
      j.columnNode.size += 1
      j.down.up = j
      j.up.down = j
    }
  }
  columnNode.right.left = columnNode
  columnNode.left.right = columnNode
}

function traverseDown(rootNode: Node): Node {
  let node = rootNode
  while (node && node.down && node.down !== node) {
    node = node.down
  }
  return node
}

function traverseRight(rootNode: Node, name: string): Node {
  let node = rootNode
  while (node.name !== name && node.right !== node) {
    node = node.right
  }
  return node
}
