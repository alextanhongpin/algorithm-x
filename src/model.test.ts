import { Node } from './model'

import * as chai from 'chai'

const expect = chai.expect

describe('Node', () => {
  it ('should return reference to a new node', () => {
    let node = new Node()
    expect(node).to.be.not.eq(null)
  })

  it ('should return self when traversing down an unlinked node', () => {
    let node = new Node()
    let nodeBottom = node.traverseDown()
    expect(node).to.be.eq(nodeBottom)
  })

  it ('should return self when traversing right an unlinked node', () => {
    let node = new Node()
    let nodeBottom = node.traverseRight('')
    expect(node).to.be.eq(nodeBottom)
  })
})
