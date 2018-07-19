import numpy as np

A = [1, 4, 7]
B = [1, 4]
C = [4, 5, 7]
D = [3, 5, 6]
E = [2, 3, 6, 7]
F = [2, 7]

exact_cover = []

m = [A, B, C, D, E, F]
print(m)

# Convert the data to a matrix
for ri, row in enumerate(m):
    cols = []
    for i in range(1, 8):
        cols.append(1 if i in row else 0)
    m[ri] = cols

m = np.array(m)

## Start
cols_with_one = np.sum(m, axis=0)
print('cols_with_one: \n', cols_with_one)

min_cols = min(cols_with_one)
print('min_cols:\n', min_cols)

cols_with_one = [i for i, col in enumerate(cols_with_one) if col == min_cols]
print('cols_with_one:\n', cols_with_one)

if len(cols_with_one) > 0:
    # Take the first column
    col = cols_with_one[0]
    print('col:', col)

    # Take the first columns
    first_cols = m[:, col]
    print('first_cols:', first_cols)

    rows_with_one = [i for i, row in enumerate(first_cols) if row == 1]
    print('rows_with_one:', rows_with_one)

    # Iterate through each row
    mcopy = m[:]
    for r in rows_with_one:
        cols_to_keep = [i for i, col in enumerate(m[r]) if col != 1]
        print("cols_to_keep", cols_to_keep)
    mcopy = mcopy[:, cols_to_keep]
    print("mcopy", mcopy)

# from dataclasses import dataclass

# @dataclass
# class Node:
#     l: Node
#     r: Node
#     u: Node
#     d: Node
#     c: int # Column
#     s: int # Size
#     n: str # Name
#     h: Node # root

class Node:
    def __init__(self, left, right, up, down, col, size, row, is_header):
        self.left = left
        self.right = right
        self.up = up
        self.down = down
        self.col = col
        self.size = size
        self.row = row
        self.is_header = is_header