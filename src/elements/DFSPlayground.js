HashSet = require('hashset');
Stack = require('stack-data');
log = console.log;
function DFS(initial, goal, empty,limit) {
  this.initial = initial;
  this.goal = goal;
  this.empty = empty;
  this.visited = new HashSet();
  this.limit = limit;
  this.fringe = []; // TODO: add fringe
  this.fringe.push(initial);
}

function Node(value, state, emptyRow, emptyCol, depth) {
  this.value = value;
  this.state = state;
  this.emptyCol = emptyCol;
  this.emptyRow = emptyRow;
  this.depth = depth;
  this.strRepresentation = '';
  this.path = '';

  // String representation of the state in CSV format
  for (var i = 0; i < state.length; i++) {
    // We assume the state is a square
    if (state[i].length != state.length) {
      console.log('Number of rows differs from number of columns');
      return false;
    }

    for (var j = 0; j < state[i].length; j++)
      this.strRepresentation += state[i][j] + ',';
  }
  this.size = this.state.length;
}

DFS.prototype.execute = function() {
  // Add current state to visited list
  log(this.fringe.length);
  this.visited.add(this.initial.strRepresentation);

  while (this.fringe.length > 0) {
    var current = this.fringe.pop();
    // log(current)
    if (current.strRepresentation == this.goal.strRepresentation)
      return current;
    if (this.limit > current.depth) this.expandNode(current);
  }
};

DFS.prototype.expandNode = function(node) {
  // log(node)
  var temp = '';
  var newState = '';
  var col = node.emptyCol;
  var row = node.emptyRow;
  var newNode = '';

  // Up
  if (row > 0) {
    newState = node.state.clone();
    temp = newState[row - 1][col];
    newState[row - 1][col] = this.empty;
    newState[row][col] = temp;
    newNode = new Node(0, newState, row - 1, col, node.depth + 1);

    if (!this.visited.contains(newNode.strRepresentation)) {
      newNode.value = newNode.depth;
      newNode.path = node.path + 'd';
      this.fringe.push(newNode);
      this.visited.add(newNode.strRepresentation);
    }
  }

  // Down
  if (row < node.size - 1) {
    newState = node.state.clone();
    temp = newState[row + 1][col];
    newState[row + 1][col] = this.empty;
    newState[row][col] = temp;
    newNode = new Node(0, newState, row + 1, col, node.depth + 1);

    if (!this.visited.contains(newNode.strRepresentation)) {
      newNode.value = newNode.depth;
      newNode.path = node.path + 'u';
      this.fringe.push(newNode);
      this.visited.add(newNode.strRepresentation);
    }
  }

  // Left
  if (col > 0) {
    newState = node.state.clone();
    temp = newState[row][col - 1];
    newState[row][col - 1] = this.empty;
    newState[row][col] = temp;
    newNode = new Node(0, newState, row, col - 1, node.depth + 1);

    if (!this.visited.contains(newNode.strRepresentation)) {
      newNode.value = newNode.depth;
      newNode.path = node.path + 'r';
      this.fringe.push(newNode);
      this.visited.add(newNode.strRepresentation);
    }
  }

  // Right
  if (col < node.size - 1) {
    newState = node.state.clone();
    temp = newState[row][col + 1];
    newState[row][col + 1] = this.empty;
    newState[row][col] = temp;
    newNode = new Node(0, newState, row, col + 1, node.depth + 1);

    if (!this.visited.contains(newNode.strRepresentation)) {
      newNode.value = newNode.depth;
      newNode.path = node.path + 'l';
      this.fringe.push(newNode);
      this.visited.add(newNode.strRepresentation);
    }
  }
};
Array.prototype.clone = function() {
  return JSON.parse(JSON.stringify(this));
};
function createGoalState(n) {
  let array = [];
  let array2D = [];
  for (let i = 1; i < n * n; i++) {
    array.push(i);
  }
  array.push(0);
  while (array.length) array2D.push(array.splice(0, n));
  return new Node(0, array2D, n, n, 0);
}

function convertState(array, n) {
  // Node(value, state, emptyRow, emptyCol, depth)

  let array2D = [],
    emptyRow,
    emptyCol,
    i,
    k;
  for (i = 0, k = -1; i < array.length; i++) {
    if (i % n === 0) {
      // add new row
      k++;
      array2D[k] = [];
    }
    // push column
    if (array[i] == 0) {
      emptyRow = k;
      emptyCol = i % n;
    }
    array2D[k].push(array[i]);
  }
  // let ourState = [0, array2D, emptyRow, emptyCol, 0];
  return new Node(0, array2D, emptyRow, emptyCol, 0);
}
function test() {
  console.log('starting test ...');
  //   5,8,3,6,7,4,1,0,2

  // var init = new Node(convertState([5,8,3,6,7,4,1,0,2],3));
  //   hi = '10 5 8 2 11 1 15 4 0 7 12 3 9 13 14 6'.split(' ');
  var init = convertState([5, 8, 3, 6, 7, 4, 1, 0, 2], 3);
  //   var init = convertState(hi, 3);
  var goal = createGoalState(3);
  console.log('my size ' + init.size);
  var dfs = new DFS(init, goal, 0,50);
  //   var astar = new AStar([5,8,3,6,7,4,1,0,2], 3);
  // To measure time taken by the algorithm
  var startTime = new Date();
  // Execute AStar
  var result = dfs.execute();
  // To measure time taken by the algorithm
  var endTime = new Date();
  console.log(result);
}
test();
