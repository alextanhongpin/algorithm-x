import  {
  initializeColumns,
  initializeHeaders,
  initializeDancingLinks,
  search,
  printSolutionSudoku,
  prettyPrintSolution,
  
  initialiseArray
} from './core'

import Constraint from './constraint'

function main () {
  let data = '.6.3..8.4537.9.....4...63.7.9..51238.........71362..4.3.64...1.....6.5231.2..9.8.'

  let G = data.split('').map((val) => {
    if (val === '.') {
      return null
    }
    return Number(val)
  })
  let S = Math.sqrt(G.length)
  let output = []
  while (G.length) {
    output.push(G.splice(0, S))
  }

  // Print the grid
  console.log()
  console.log('INPUT:')
  console.log()
  let outputWithDot = output.map(row => row.map((i) => i || '.'))

  prettyPrintSolution(outputWithDot)
  console.log()

  let m = []
  for (let row = 0; row < S; row += 1) {
    let present = output[row].filter(nonNull => nonNull)
    
    for (let col = 0; col < S; col += 1) {
      let val = output[row][col]

      if (val === null) {
        for (let n = 0; n < S; n += 1) {
          let _val = n + 1
          if (present.includes(_val)) continue
          let res = {
            row,
            col,
            val: _val,
            data: initializeConstraints( S, row, col, _val)
          }
          m.push(res)
        }
        continue
      }

      let res = {
        row,
        col,
        val,
        data: initializeConstraints(S, row, col, val)
      }
      m.push(res)
    }
  }

  console.log(`[m] rows=${m.length} cols=${m[0].data.length}`)

  let columns = initializeColumns(S * S * 4)
  let h = initializeHeaders(columns)
  initializeDancingLinks(h, m, columns)
  console.time('start')
  search(0, h, [], printSolutionSudoku)
  console.timeEnd('start')
}

main()

function initializeConstraints (
  size: number, 
  row: number, 
  col: number, 
  val: number
) {
  let arrSize = size * size * 4 // 324
  let arr = initialiseArray(arrSize)
  let constraints: {[id: number]: number} = {
    0: Constraint.cell(size, row, col, val),
    1: Constraint.row(size, row, col, val),
    2: Constraint.column(size, row, col, val),
    3: Constraint.box(size, row, col, val)
  }
  for (let i = 0; i < 4; i += 1) {
    let startIndex = size * size * i
    let index = startIndex + constraints[i]
    arr[index] = 1 
  }
  return arr
}
