const ROOT = 'h'

// Metadata holds additional information for a particular box
export interface Metadata {
  column: number;
  row: number;
  value: number;
  data: number[]
}

export function initializeMetadata(
  column: number,
  row: number,
  value: number,
  data: number[]
): Metadata {
  return { row, column, value, data }
}

function nullMetadata(): Metadata {
  return { row: 0, column: 0, value: -1, data: [] }
}

export class Node {
  up: Node;
  down: Node;
  left: Node;
  right: Node;
  columnNode: Node;
  name: string = '';
  size: number = 0;
  metadata: Metadata = nullMetadata();
  constructor() {
    this.columnNode = this.up = this.down = this.left = this.right = this
  }
}

export function initializeNode(columnNode: Node, metadata: Metadata): Node {
  let node = new Node()
  node.columnNode = columnNode
  node.metadata = metadata
  return node
}

export function initializeColumnNode(name: string): Node {
  let node = new Node()
  node.name = name
  return node
}

export function initializeRootNode(): Node {
  let node = new Node()
  node.name = ROOT
  return node
}