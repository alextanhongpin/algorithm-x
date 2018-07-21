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
  initializeDancingLinks(h, data, columns)
  search(0, h)
}

main()
