// reducer

// Each cell can only contain one integer between 1 and 9
// [81] [1,1,1...1, 2,2,2,...,9,9,9]

const {
  initializeColumns,
  initializeHeaders,
  initializeDancingLinks,
  traverse,
  search
} = require('./core')

function CellConstraint (S) {
  let out = Array(S * S).fill(0)
  return {
    add (row, col, val) {
      let i = (val - 1) * S + col
      out[i] = 1
      return this
    },
    print () {
      console.log(out.join('').replace(/0/g, '.'))
      return this
    },
    value () {
      return out
    }
  }
}

// Each row can only contain nine unique integers in the range of 1 to 9
// [81] [1,2,3,4,5,6,7,8,9 <- row0, 1,2,3,4,....<-rown]
function RowConstraint (S) {
  let out = Array(S * S).fill(0)
  return {
    add (row, col, val) {
      let i = row * S + (val - 1)
      out[i] = 1
      return this
    },

    print () {
      console.log(out.join('').replace(/0/g, '.'))
      return this
    },
    value () {
      return out
    }
  }
}

function ColumnConstraint (S) {
  let out = Array(S * S).fill(0)
  return {
    add (row, col, val) {
      let i = col * S + (val - 1)
      out[i] = 1
      return this
    },
    print () {
      console.log(out.join('').replace(/0/g, '.'))
      return this
    },
    value () {
      return out
    }
  }
}

function BoxConstraint (S) {
  let out = Array(S * S).fill(0)
  return {
    add (row, col, val) {
      let i = col * S + (val - 1)
      out[i] = 1
      return this
    },
    print () {
      console.log(out.join('').replace(/0/g, '.'))
      return this
    },
    value () {
      return out
    }
  }
}

function makeMatrix (S = 9) {
  return Array(S).fill([]).map(() => {
    return Array(S).fill(0)
  })
}
function print (G) {
  let out = G.map(row => {
    return row.join('').replace(/0/g, '.')
  }).join('\n')
  console.log(out)
}

function main () {
  let data = '.6.3..8.4537.9.....4...63.7.9..51238.........71362..4.3.64...1.....6.5231.2..9.8.'

  let G = data.split('').map((val) => {
    if (val === '.') {
      return null
    }
    return Number(val)
  })
  let S = Math.sqrt(G.length)
  console.log(S)

  let output = []
  while (G.length) {
    output.push(G.splice(0, S))
  }
  console.log(output)

  let m = []
  for (let i = 0; i < S; i += 1) {
    for (let j = 0; j < S; j += 1) {
      let row = i
      let col = j
      let val = output[row][col]

      let cellConstraint = CellConstraint(S)
      let rowConstraint = RowConstraint(S)
      let columnConstraint = ColumnConstraint(S)
      let boxConstraint = BoxConstraint(S)
      let a = cellConstraint.add(row, col, val).value()
      let b = rowConstraint.add(row, col, val).value()
      let c = columnConstraint.add(row, col, val).value()
      let d = boxConstraint.add(row, col, val).value()
      let out = a.concat(b.concat(c.concat(d)))
      m.push(out)
    }
  }

  console.log('size', m.length, m[0].length)

  let columns = initializeColumns(S * S)
  let h = initializeHeaders(columns)
  initializeDancingLinks(h, m, columns)
  traverse(columns, h)
  // search(0, h)
}

main()
