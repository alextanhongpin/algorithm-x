import Sudoku from './sudoku';
import { initializeMetadata } from './model';
import {
  search,
  initializeCircularDoublyLinkedToroidaList,
  initializeColumnLabels
} from './core';

async function main() {
  solveDancingLinks()
  solveSudoku()
}

function solveDancingLinks() {
  let data: number[][] = [
    [0, 0, 1, 0, 1, 1, 0],
    [1, 0, 0, 1, 0, 0, 1],
    [0, 1, 1, 0, 0, 1, 0],
    [1, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 1],
    [0, 0, 0, 1, 1, 0, 1]
  ]

  let size = data[0].length
  let columnLabels = initializeColumnLabels(size)
  let metadata = data.map(rows => initializeMetadata(-1, -1, -1, rows))
  let rootNode = initializeCircularDoublyLinkedToroidaList(
    metadata,
    columnLabels
  )

  let output = search(0, rootNode, [])
  output.forEach(node => {
    let results = [node.columnNode.name]
    let right = node.right
    while (right !== node) {
      results.push(right.columnNode.name)
      right = right.right
    }
    console.log(results.join(' '))
  })
}

function solveSudoku() {
  let input = '.6.3..8.4537.9.....4...63.7.9..51238.........71362..4.3.64...1.....6.5231.2..9.8.'

  Sudoku.print('INPUT: ', Sudoku.fromString(input))
  Sudoku.print('OUTPUT:', Sudoku.solve(input))
}

main().catch(console.error)
