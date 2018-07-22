import List from './utils/list'
import { Metadata, Node } from './model';
import {
  search,
  initializeColumnLabels,
  initializeCircularDoublyLinkedToroidaList
} from './core'

export default class Sudoku {
  static EMPTY = -1;
  static VERTICAL = '|';
  static HORIZONTAL = '------+-------+------';
  static DOT = '.';
  static SIZE = 9;
  static BOX_SIZE = 3;

  static fromString(input: string): number[][] {
    let parsed = [...input].map(
      i => i === Sudoku.DOT ? Sudoku.EMPTY : Number(i)
    )
    let size = Math.sqrt(parsed.length)
    return List.chunk<number>(parsed, size)
  }

  static boardFrom(input: number[][]) {
    const [FIRST, SECOND] = [3, 7]
    let parsedRow = [...input].map((rows) => {
      let c: (string | number)[] = [...rows].map(
        i => i === Sudoku.EMPTY ? Sudoku.DOT : i
      )
      c.splice(FIRST, 0, Sudoku.VERTICAL)
      c.splice(SECOND, 0, Sudoku.VERTICAL)
      return c.join(' ')
    })
    parsedRow.splice(FIRST, 0, Sudoku.HORIZONTAL)
    parsedRow.splice(SECOND, 0, Sudoku.HORIZONTAL)
    return parsedRow.join('\n')
  }

  static print(label: string, input: number[][]) {
    console.group(label)
    console.log()
    console.log(Sudoku.boardFrom(input))
    console.log()
    console.groupEnd()
  }

  static parseCells(input: number[][]): Metadata[] {
    let size = input.length
    let constraintMatrix = []
    let onlyNumbers = (n: number): boolean => n !== Sudoku.EMPTY

    for (let row = 0; row < size; row += 1) {
      // Values that are currently present in the row
      let numbers = input[row].filter(onlyNumbers)
      for (let column = 0; column < size; column += 1) {
        let value = input[row][column]

        // If the column is not yet filled, fill it with values that are not
        // yet present in the column
        if (value === Sudoku.EMPTY) {

          // Value must be from 1 - 9
          for (let value = 1; value <= size; value += 1) {
            // Only insert numbers that are not yet present for that row
            if (numbers.includes(value)) continue
            // Create the row matrix with the constraints applied.
            // This will be a 9 x 9 x 4 matrix with 1 and 0s
            let data = Sudoku.constraintMatrix(
              size,
              row,
              column,
              value
            )
            constraintMatrix.push({ row, column, value, data })
          }
          continue
        }
        let data = Sudoku.constraintMatrix(size, row, column, value)
        constraintMatrix.push({ row, column, value, data })
      }
    }
    return constraintMatrix
  }

  static solver(input: Metadata[]): Node[] {
    let columns = initializeColumnLabels(Sudoku.SIZE * Sudoku.SIZE * 4)
    let rootNode = initializeCircularDoublyLinkedToroidaList(input, columns)
    return search(0, rootNode, [])
  }

  static solve(input: string): number[][] {
    let solutions = [input]
      .map(Sudoku.fromString)
      .map(Sudoku.parseCells)
      .map(Sudoku.solver)
      .map(Sudoku.parseSolution)
    return List.takeFirstOr(solutions, [])
  }

  static parseSolution(solution: Node[]): number[][] {
    let grid = List.grid<number>(Sudoku.SIZE, 0)
    solution.forEach((n: Node) => {
      let m: Metadata = n.metadata
      let { row, column, value } = m
      grid[row][column] = value
    })
    return grid
  }

  static constraints(
    size: number,
    row: number,
    column: number,
    value: number
  ) {
    let r = Math.floor(row / Sudoku.BOX_SIZE) * Sudoku.BOX_SIZE
    let c = Math.floor(column / Sudoku.BOX_SIZE)
    return {
      cell: row * size + column,
      row: row * size + value - 1,
      column: column * size + value - 1,
      box: (r + c) * size + value - 1
    }
  }

  static constraintMatrix(
    size: number,
    row: number,
    column: number,
    value: number
  ): number[] {
    let c = Sudoku.constraints(size, row, column, value)
    let constraints = [
      c.cell,
      c.row,
      c.column,
      c.box
    ]
    let matrices = constraints.map(index => {
      let arr = List.of(size * size, 0)
      arr[index] = 1
      return arr
    })
    return List.flatten<number>(matrices)
  }
}