const {
  initializeHeaders,
  initializeDancingLinks,
  search,
  initializeColumns
} = require('./core')

function main () {
  let data = [
    [0, 0, 1, 0, 1, 1, 0],
    [1, 0, 0, 1, 0, 0, 1],
    [0, 1, 1, 0, 0, 1, 0],
    [1, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 1],
    [0, 0, 0, 1, 1, 0, 1]]

  let columns = initializeColumns(data[0].length)
  let h = initializeHeaders(columns)
  initializeDancingLinks(h, mapData(data), columns)
  search(0, h)
}

function mapData (data) {
  return data.map((row, i) => {
    return {
      row: i,
      data: row,
      col: null,
      val: null
    }
  })
}

main()
