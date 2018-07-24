# sudoku-solver

Sudoku solver implementing DLX (Dancing Links + Algorithm X) by Donald Knuth.



## Output

![gif](./assets/sudoku.gif)

```
INPUT 1:

  . 6 . | 3 . . | 8 . 4
  5 3 7 | . 9 . | . . .
  . 4 . | . . 6 | 3 . 7
  ------+-------+------
  . 9 . | . 5 1 | 2 3 8
  . . . | . . . | . . .
  7 1 3 | 6 2 . | . 4 .
  ------+-------+------
  3 . 6 | 4 . . | . 1 .
  . . . | . 6 . | 5 2 3
  1 . 2 | . . 9 | . 8 .

OUTPUT 1:

  2 6 1 | 3 7 5 | 8 9 4
  5 3 7 | 8 9 4 | 1 6 2
  9 4 8 | 2 1 6 | 3 5 7
  ------+-------+------
  6 9 4 | 7 5 1 | 2 3 8
  8 2 5 | 9 4 3 | 6 7 1
  7 1 3 | 6 2 8 | 9 4 5
  ------+-------+------
  3 5 6 | 4 8 2 | 7 1 9
  4 8 9 | 1 6 7 | 5 2 3
  1 7 2 | 5 3 9 | 4 8 6

benchmark: 26.947ms
STRING 1: 261375894537894162948216357694751238825943671713628945356482719489167523172539486
INPUT 2:

  . . . | . . . | . 1 2
  . . . | . . . | . . 3
  . . 2 | 3 . . | 4 . .
  ------+-------+------
  . . 1 | 8 . . | . . 5
  . 6 . | . 7 . | 8 . .
  . . . | . . 9 | . . .
  ------+-------+------
  . . 8 | 5 . . | . . .
  9 . . | . 4 . | 5 . .
  4 7 . | . . 6 | . . .

OUTPUT 2:

  8 3 9 | 4 6 5 | 7 1 2
  1 4 6 | 7 8 2 | 9 5 3
  7 5 2 | 3 9 1 | 4 8 6
  ------+-------+------
  3 9 1 | 8 2 4 | 6 7 5
  5 6 4 | 1 7 3 | 8 2 9
  2 8 7 | 6 5 9 | 3 4 1
  ------+-------+------
  6 2 8 | 5 3 7 | 1 9 4
  9 1 3 | 2 4 8 | 5 6 7
  4 7 5 | 9 1 6 | 2 3 8

benchmark: 19.776ms
```

## Installing Virtualenv
```bash
pip3 install virtualenv
```

## Setting up Virtualenv
```bash
$ virtualenv venv
$ source venv/bin/activate
$ deactivate
```

## Install Dependencies
Only install after setting up virtualenv to avoid polluting the global namespace.
```
pip3 install numpy
```

## Run 
```bash
$ python3 main.py
```

## Dancing Links

```
If A is empty, the problem is solved; terminate successfully.
Otherwise choose a column, c (deterministically).
Choose a row, r, such that A[r, c] = 1 (nondeterministically).
Include r in the partial solution.
For each j such that A[r, j] = 1,
    delete column j from matrix A;
    for each i such that A[i, j] = 1,
        delete row i from matrix A.
Repeat this algorithm recursively on the reduced matrix A.
```

# Rerefences
https://www.ocf.berkeley.edu/~jchu/publicportal/sudoku/0011047.pdf
https://www.kth.se/social/files/58861771f276547fe1dbf8d1/HLaestanderMHarrysson_dkand14.pdf


## Setup Typescript Testing

yarn add mocha @types/mocha chai @types/chai ts-node typescript --dev
