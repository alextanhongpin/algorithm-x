const ROOT = 'h'

// Cell
export interface Cell {
  col: number;
  row: number;
  val: number;
  data: any;
}

export type Row = Cell[]

export function initializeCell(
  row: number, 
  col: number,
  val: number,
  data: any
): Cell {
  return { row, col, val, data }
}

// Metadata
export interface Metadata {
  col: number;
  row: number;
  val: number;
}

export function initializeMetadata(
  row: number, 
  col: number, 
  val: number
): Metadata {
  return { row, col, val }
}

export class Node {
  U: Node; // Up
  D: Node; // Down
  L: Node; // Left
  R: Node; // Right
  C: Node; // ColumnNode
  N: string = ''; // Name
  S: number = 0; // Size
  metadata: Metadata = {row: 0, col: 0, val: 0}
  constructor() {
    this.U = this.D = this.L = this.R = this.C = this
  }
  traverseDown (): Node {
    let node: Node = this
    while (node && node.D && node.D !== node) {
      node = node.D
    }
    return node
  }
  traverseRight(name: string): Node {
    let node: Node = this
    while (node.N !== name && node.R && node.R !== node) {
      node = node.R
    }
    return node
  }
  linkLeft (l: Node): Node {
    this.L = l
    this.L.R = this
    return this
  }
  linkTop (u: Node): Node {
    this.U = u
    this.U.D = this
    return this
  }
}

// DLXNode
export class DLXNode extends Node {
  constructor (public C: ColumnNode) { super() }
}

export function initializeDLXNode(C: ColumnNode): DLXNode {
  return new DLXNode(C)
}

// ColumnNode
export class ColumnNode extends Node {
  constructor (public readonly N: string) { super() }
}

export function initializeColumnNode(name: string): ColumnNode {
  return new ColumnNode(name)
}

export function initializeRootNode(): ColumnNode {
  return new ColumnNode(ROOT)
}
