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

  for (let output of search(0, rootNode, [])) {
    if (!output.length) continue
    output.forEach(node => {
      let results = [node.columnNode.name]
      let right = node.right
      while (right !== node) {
        results.push(right.columnNode.name)
        right = right.right
      }
      console.log(results.join(' '))
    })
    console.log()
  }
}

function solveSudoku() {
  let inputs = [
    '.6.3..8.4537.9.....4...63.7.9..51238.........71362..4.3.64...1.....6.5231.2..9.8.',
    '.......12........3..23..4....18....5.6..7.8.......9.....85.....9...4.5..47...6...'
  ]

  inputs.map(function (input, i) {
    console.time('benchmark')
    Sudoku.print(`INPUT ${i + 1}:`, Sudoku.fromString(input))
    Sudoku.solve(input).map(async (solution, j) => {
      // Add delay effect when displaying results
      await delay(100 * j)
      Sudoku.print(`OUTPUT ${i + 1} ITERATION=${j}:`, solution)
      // console.log(`STRING ${i + 1}:`, Sudoku.toString(solution))
    })
    console.timeEnd('benchmark')
  })
}

function delay(duration: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(duration)
    }, duration)
  })
}

main().catch(console.error)
