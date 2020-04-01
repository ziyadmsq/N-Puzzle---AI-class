
export const gameState = {
  GAME_IDLE: '__game_idle__',
  GAME_STARTED: '__game_started__',
  GAME_OVER: '__game_over__',
  GAME_PAUSED: '__game_paused__',
  GAME_SOLVING: '__game_solving__',
};

export const swap = (arr, from, to) => {
  arr.splice(from, 1, arr.splice(to, 1, arr[from])[0]);
  return arr;
};

export const isNeighbour = (to, from,n) => {
  let emptyColumn = Math.floor(to % n);
  let emptyRow = Math.floor(to / n);
  let clickedColumn = Math.floor(from % n);
  let clickedRow = Math.floor(from / n);

  const sameRow = emptyRow === clickedRow;
  const sameColumn = emptyColumn === clickedColumn;
  const columnDiff = emptyColumn - clickedColumn;
  const rowDiff = emptyRow - clickedRow;
  const diffColumn = Math.abs(columnDiff) === 1;
  const diffRow = Math.abs(rowDiff) === 1;
  const sameRowDiffColumn = sameRow && diffColumn;
  const sameColumnDiffRow = sameColumn && diffRow;
  if (sameRowDiffColumn || sameColumnDiffRow) {
    return true;
  } else {
    return false;
  }
};

export const swapSpace = (arr, from, row, col, move,n) => {
  let yMove = move === 0 ? 1 : move === 2 ? -1 : 0;
  let xMove = move === 3 ? 1 : move === 1 ? -1 : 0;
  let newRow = row + yMove;
  let newCol = col + xMove;
  if (newRow <= -1 || newCol <= -1 || newRow >= n || newCol >= n) {
    return [false, arr];
  }
  let to = newRow * n + newCol;
  return [true, swap(arr, from, to)];
};

export const shuffle = array_elements => {
  let i = array_elements.length,
    randomNumIndex,
    randomNum;
  while (--i > 0) {
    randomNumIndex = Math.floor(Math.random() * (i + 1));
    randomNum = array_elements[randomNumIndex];
    array_elements[randomNumIndex] = array_elements[i];
    array_elements[i] = randomNum;
  }
  return array_elements;
};

export const checkArray = arr => {
  let decision = true;
  arr.forEach((i, index) => {
    if (i !== index + 1 && i != 0) {
      decision = false;
    }
  });
  return decision;
};
