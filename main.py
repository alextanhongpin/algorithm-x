import numpy as np

m = np.array([[1,2,3], [4,5,6], [7,8,9]])
print('matrix `m`:\n', m)

print('first row:', m[0])
print('first col:', m[:, 0])

print('sum rows:', np.sum(m, axis=0))
print('sum cols:', np.sum(m, axis=1))

print('delete first row:', np.delete(m, 0, axis=0))
print('delete first row:', m[1:,:])

print('delete first col:', np.delete(m, 0, axis=1))
print('delete first col:', m[:,1:])

print('delete multiple rows:', np.delete(m, [0, 2], axis=0))
print('delete multiple rows:', m[[1],].flatten())

print('delete multiple cols:', np.delete(m, [0, 2], axis=1))
print('delete multiple cols:', m[:,[1]].flatten())

r, c = m.shape
print("shape", r, c)
for i in range(0, r):
    for j in range(0, c):
        if m[i, j] == 1:
            print(i, j)