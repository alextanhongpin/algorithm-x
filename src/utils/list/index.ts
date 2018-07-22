export default class List {
  static chunk<T>(arr: T[], size: number): T[][] {
    let out = []
    while (arr.length) {
      out.push(arr.splice(0, size))
    }
    return out
  }
  
  static flatten<T>(arr: T[][]): T[] {
    return arr.reduce((a: T[], b: T[]) => a.concat(b), [])
  }

  static takeFirstOr<T>(arr: T[], def: T): T {
    if (arr.length > 0) {
      return arr[0]
    }
    return def
  }

  static of<T>(size: number, value: T): T[] {
    return Array(size).fill(value)
  }

  static grid<T>(size: number, value: T): T[][] {
    return Array(size).fill([])
      .map(() => Array(size).fill(value))
  }
}
