const assert = require('assert')
const {
  Constraints

} = require('./core')

function TestContraints () {
  let size = 9
  // 9 x 9 array

  let contraints = Constraints(size)
  let indexOffset = 1

  let cellTests = [
    [0, 0, 1, 1 - indexOffset],
    [0, 1, 1, 2 - indexOffset],
    [8, 8, 9, 81 - indexOffset]
  ]
  cellTests.forEach(([row, col, val, index]) => {
    assert.equal(contraints.cell(row, col, val), index)
  })
  console.log('[cellConstraintTest] success')

  let rowTests = [
    [0, 0, 1, 1 - indexOffset],
    [0, 0, 2, 2 - indexOffset],
    [0, 1, 1, 1 - indexOffset],
    [0, 1, 2, 2 - indexOffset],
    [8, 8, 8, 80 - indexOffset],
    [8, 8, 9, 81 - indexOffset]
  ]
  rowTests.forEach(([row, col, val, index]) => {
    assert.equal(contraints.row(row, col, val), index)
  })
  console.log('[rowConstraintTest] success')

  let colTests = [
    [0, 0, 1, 1 - indexOffset],
    [0, 0, 2, 2 - indexOffset],
    [0, 1, 1, 10 - indexOffset],
    [0, 1, 2, 11 - indexOffset],
    [1, 0, 1, 1 - indexOffset],
    [1, 0, 2, 2 - indexOffset]
  ]
  colTests.forEach(([row, col, val, index]) => {
    assert.equal(contraints.col(row, col, val), index)
  })
  console.log('[colConstraintTest] success')

  let boxTests = [
    [0, 0, 1, 1 - indexOffset],
    [0, 0, 2, 2 - indexOffset],
    [0, 1, 1, 10 - indexOffset],
    [0, 1, 2, 11 - indexOffset],
    [0, 2, 1, 19 - indexOffset],
    [0, 2, 2, 20 - indexOffset],
    [1, 0, 1, 1 - indexOffset],
    [1, 0, 2, 2 - indexOffset]
  ]
  boxTests.forEach(([row, col, val, index]) => {
    assert.equal(contraints.box(row, col, val), index)
  })
  console.log('[boxConstraintTest] success')

  let a = new Set()
  let b = new Set()
  let c = new Set()
  let d = new Set()
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      for (let val = 0; val < 9; val += 1) {
        a.add(contraints.cell(row, col, val + 1))
        b.add(contraints.row(row, col, val + 1))
        c.add(contraints.col(row, col, val + 1))
        d.add(contraints.box(row, col, val + 1))
      }
    }
  }
  assert.equal(a.size, 81)
  assert.equal(b.size, 81)
  assert.equal(c.size, 81)
  assert.equal(d.size, 81)
}

(function main () {
  TestContraints()
})()
