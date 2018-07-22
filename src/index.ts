import {
  initializeHeaders,
  initializeDancingLinks,
  initializeColumns,
  search,
} from './core'

import { Row, Cell, initializeCell, Node } from './model';
import { FgWhite, FgGreen } from './color';

function main () {
  let data: number[][] = [
    [0, 0, 1, 0, 1, 1, 0],
    [1, 0, 0, 1, 0, 0, 1],
    [0, 1, 1, 0, 0, 1, 0],
    [1, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 1],
    [0, 0, 0, 1, 1, 0, 1]
  ]

  let size = data[0].length
  let columns = initializeColumns(size)
  let header = initializeHeaders(columns)
  initializeDancingLinks(header, mapData(data), columns)
  let printer = new Printer(data, columns)
  printer.input()
  search(0, header, [], printer.output.bind(printer))
}

function mapData (grid: number[][]): Row {
  return grid.map((data: number[], row: number): Cell => {
    return initializeCell(row, -1, -1, data)
  })
}

interface IPrinter {
  input(): void
  output(solution: Node[]): void
}

class Printer implements IPrinter {
  constructor(public data: number[][], public headers: string[]) {}
  header() {
    console.log(FgWhite, ' ', FgWhite,  this.headers.join(' '))
  }
  input () {
    console.log('INPUT:')
    console.log()
    this.header()
    this.data.forEach((row, i) => {
      let rowStr = row.map((v) => v === 0 ? '.' : '1').join(' ')
      console.log(FgWhite, i + 1, FgGreen, rowStr)
    })
    console.log(FgWhite)
  }
  output(solution: Node[]) {
    if (!solution.length) {
      return console.log('[solution] not found')
    }
    let rows = solution.map((n: Node) => {
      return n.metadata.row
    }).sort()

    let filtered = this.data.filter((_, i) => rows.includes(i))
    
    console.log('OUTPUT:')
    console.log()
    this.header()
    filtered.forEach((row, i) => {
      let rowStr = row.map((v) => v === 0 ? '.' : '1').join(' ')
      console.log(FgWhite, rows[i] + 1, FgGreen, rowStr)
    })
    console.log(FgWhite)
  }
}

main()
