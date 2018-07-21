// reducer

// Each cell can only contain one integer between 1 and 9
// [81] [1,1,1...1, 2,2,2,...,9,9,9]

const {
  initializeColumns,
  initializeHeaders,
  initializeDancingLinks,
  search,
  printSolutionSudoku,
  prettyPrintSolution,
  Constraints,
  initialiseArray
} = require('./core')

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
  let constraints = Constraints(S)
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
            data: initializeConstraints(constraints, S, row, col, _val)
          }
          m.push(res)
        }
        continue
      }

      let res = {
        row,
        col,
        val,
        data: initializeConstraints(constraints, S, row, col, val)
      }
      m.push(res)
    }
  }

  let columns = initializeColumns(S * S * 4)
  let h = initializeHeaders(columns)
  initializeDancingLinks(h, m, columns)
  console.time('start')
  search(0, h, [], printSolutionSudoku)
  console.timeEnd('start')
}

main()

function initializeConstraints (constraints, size, row, col, val) {
  let cellConstraint = initialiseArray(size)
  cellConstraint[constraints.cell(row, col, val)] = 1

  let rowConstraint = initialiseArray(size)
  rowConstraint[constraints.row(row, col, val)] = 1

  let colConstraint = initialiseArray(size)
  colConstraint[constraints.col(row, col, val)] = 1

  let boxConstraint = initialiseArray(size)
  boxConstraint[constraints.box(row, col, val)] = 1

  return [
    ...cellConstraint,
    ...rowConstraint,
    ...colConstraint,
    ...boxConstraint
  ]
}
