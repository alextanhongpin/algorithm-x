export default class Constraint {
  static cell(size: number, row: number, col: number, _val: number) {
    return row * size + col
  }
  static row(size: number, row: number, _col: number, val: number) {
    return row * size + (val - 1)
  }
  static column(size: number, _row: number, col: number, val: number) {
    return col * size + (val - 1)
  }
  static box(size: number, row: number, col: number, val: number) {
    let r = 3 * Math.floor(row / 3)
    let c = Math.floor(col / 3)
    return (r + c) * size + (val - 1)
  }
}
