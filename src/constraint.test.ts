import * as chai from 'chai'
import Constraint from './constraint'

const expect = chai.expect

describe('Constraint', () => {
  it ('should return the correct index for cell constraints', () => {
    let size = 9
    let tests = [
      [0, 0, 1, 0],
      [0, 1, 1, 1],
      [8, 8, 9, 80]
    ]
    tests.forEach(([row, col, val, index]) => {
      expect(Constraint.cell(size, row, col, val)).to.be.eq(index)
    })
  })

  it ('should return the correct index for row constraints', () => {
    let size = 9
    let tests = [
      [0, 0, 1, 0],
      [0, 0, 2, 1],
      [0, 1, 1, 0],
      [0, 1, 2, 1],
      [8, 8, 8, 79],
      [8, 8, 9, 80]
    ]
    tests.forEach(([row, col, val, index]) => {
      expect(Constraint.row(size, row, col, val)).to.be.eq(index)
    })
  })

  it ('should return the correct index for column constraints', () => {
    let size = 9
    let tests = [
      [0, 0, 1, 0],
      [0, 0, 2, 1],
      [0, 1, 1, 9],
      [0, 1, 2, 10],
      [1, 0, 1, 0],
      [1, 0, 2, 1]
    ]
    tests.forEach(([row, col, val, index]) => {
      expect(Constraint.column(size, row, col, val)).to.be.eq(index)
    })
  })

  it ('should return the correct index for box constraints', () => {
    let size = 9
    let tests = [
      [0, 0, 1, 0],
      [0, 0, 2, 1],
      [0, 1, 1, 0],
      [0, 1, 2, 1],
      [0, 3, 1, 9],
      [0, 3, 2, 10],
      [1, 0, 1, 0],
      [1, 0, 2, 1]
    ]
    tests.forEach(([row, col, val, index]) => {
      expect(Constraint.box(size, row, col, val)).to.be.eq(index)
    })
  })
})
