PriorityQueue = require('js-priority-queue');
HashSet = require('hashset');
/**
 * this is the object of A star
 * contains many function stored in the prototype
 * the functions are listed
 *  - execute
 *  - expandNode
 *  - clone
 *  - heuristic
 *  */
function AStar(initial, goal, empty) {
  this.initial = initial;
  this.goal = goal;
  this.empty = empty;
  this.queue = new PriorityQueue({
    comparator: function(a, b) {
      // if (a.value > b.value) return 1;
      // if (a.value < b.value) return -1;
      // return 0;
      return a.value - b.value;
    }
  });
  this.queue.queue(initial);
//   console.log(initial.state)
  this.visited = new HashSet();
}
// function AStar(init, n) {
//     // console.log(convertState(init, n))
//     // console.log(createGoalState(n))
//     this.initial = convertState(init, n);
//     this.goal = createGoalState(n);
//     this.empty = 0;
//     this.queue = new PriorityQueue({
//       comparator: function(a, b) {
//         if (a.value > b.value) return 1;
//         if (a.value < b.value) return -1;
//         return 0;
//       }
//     });
//     this.queue.queue(init);
//     this.visited = new HashSet();
//   }

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
AStar.prototype.execute = function() {
  // Add current state to visited list
  this.visited.add(this.initial.strRepresentation);
//   console.log(this.queue.length)
  while (this.queue.length > 0) {
    // console.log(this.queue.length)
    var current = this.queue.dequeue();

    if (current.strRepresentation == this.goal.strRepresentation){
        // console.log("current strRepresentation "+current.strRepresentation)
        // console.log("goal strRepresentation "+this.goal.strRepresentation)
      return current;
    }
    this.expandNode(current);
  }
};
AStar.prototype.expandNode = function(node) {
  var temp = '';
  var newState = '';
  var col = node.emptyCol;
  var row = node.emptyRow;
  var newNode = '';
//   console.log(node.emptyCol)

  // Up
  if (row > 0) {
    newState = node.state.clone();
    temp = newState[row - 1][col];
    newState[row - 1][col] = this.empty;
    newState[row][col] = temp;
    newNode = new Node(0, newState, row - 1, col, node.depth + 1);

    if (!this.visited.contains(newNode.strRepresentation)) {
      newNode.value = newNode.depth + this.heuristic(newNode);
      newNode.path = node.path + 'd';
      this.queue.queue(newNode);
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
      newNode.value = newNode.depth + this.heuristic(newNode);
      newNode.path = node.path + 'u';
      this.queue.queue(newNode);
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
      newNode.value = newNode.depth + this.heuristic(newNode);
      newNode.path = node.path + 'r';
      this.queue.queue(newNode);
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
      newNode.value = newNode.depth + this.heuristic(newNode);
      newNode.path = node.path + 'l';
      this.queue.queue(newNode);
      this.visited.add(newNode.strRepresentation);
    }
  }
};
Array.prototype.clone = function() {
  return JSON.parse(JSON.stringify(this));
};
AStar.prototype.heuristic = function(node) {
  return this.manhattanDistance(node);
};
function createGoalState(n){
    let array = []
    let array2D = []
    for(let i = 1 ; i < n*n ; i++){
        array.push(i)
    }
    array.push(0)
    while(array.length) array2D.push(array.splice(0,n));
    return new Node(0,array2D,n-1,n-1,0)
}
function start() {
  //   5,8,3,6,7,4,1,0,2

  // var init = new Node(convertState([5,8,3,6,7,4,1,0,2],3));
  hi = '10 5 8 2 11 1 15 4 0 7 12 3 9 13 14 6'.split(' ')
//   var init = convertState([5,8,3,6,7,4,1,0,2],3)
  var init = convertState(hi,4)
  var goal = createGoalState(4)
console.log("my size "+ init.size)
var astar = new AStar(init,goal, 0);
//   var astar = new AStar([5,8,3,6,7,4,1,0,2], 3);
  // To measure time taken by the algorithm
  var startTime = new Date();
  // Execute AStar
  var result = astar.execute();
  // To measure time taken by the algorithm
  var endTime = new Date();
  console.log(result);
}

AStar.prototype.misplacedTiles = function(node) {
  var result = 0;

  for (var i = 0; i < node.state.length; i++) {
    for (var j = 0; j < node.state[i].length; j++)
      if (
        node.state[i][j] != this.goal.state[i][j] &&
        node.state[i][j] != this.empty
      )
        result++;
  }

  return result;
};
AStar.prototype.manhattanDistance = function(node) {
  var result = 0;

  for (var i = 0; i < node.state.length; i++) {
    for (var j = 0; j < node.state[i].length; j++) {
      var elem = node.state[i][j];
      var found = false;
      for (var h = 0; h < this.goal.state.length; h++) {
        for (var k = 0; k < this.goal.state[h].length; k++) {
          if (this.goal.state[h][k] == elem) {
            result += Math.abs(h - i) + Math.abs(j - k);
            found = true;
            break;
          }
        }
        if (found) break;
      }
    }
  }
//   console.log('manhattan '+result)
  return result;
};
AStar.prototype.linearConflicts = function(node) {
  var result = 0;
  var state = node.state;

  // Row Conflicts
  for (var i = 0; i < state.length; i++)
    result += this.findConflicts(state, i, 1);

  // Column Conflicts
  for (var i = 0; i < state[0].length; i++)
    result += this.findConflicts(state, i, 0);

  return result;
};

AStar.prototype.findConflicts = function(state, i, dimension) {
  var result = 0;
  var tilesRelated = new Array();

  // Loop foreach pair of elements in the row/column
  for (var h = 0; h < state.length - 1 && !tilesRelated.contains(h); h++) {
    for (var k = h + 1; k < state.length && !tilesRelated.contains(h); k++) {
      var moves =
        dimension == 1
          ? this.inConflict(i, state[i][h], state[i][k], h, k, dimension)
          : this.inConflict(i, state[h][i], state[k][i], h, k, dimension);

      if (moves == 0) continue;
      result += 2;
      tilesRelated.push([h, k]);
      break;
    }
  }

  return result;
};

// AStar.prototype.inConflict = function (index, a, b, indexA, indexB, dimension)
// {
//    var indexGoalA = -1
//    var indexGoalB = -1

//    for (var c = 0; c = 0 && indexGoalB >= 0) &&
//            ((indexA  indexGoalB) ||
//           (indexA > indexB && indexGoalA < indexGoalB))
//                      ? 2
//                      : 0;
// }

AStar.prototype.heuristic = function(node) {
  return this.manhattanDistance(node) + this.manhattanDistance(node);
};

function convertState(array, n) {
  // Node(value, state, emptyRow, emptyCol, depth)

  var array2D = [],
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
  node = new Node(0, array2D, emptyRow, emptyCol, 0);
//   console.log(node)
  return node
}

function test() {
  statetest = [5, 8, 3, 6, 7, 4, 1, 0, 2];

  var array2D = [],
    emptyRow,
    emptyCol,
    i,
    k,
    n = 3;
  for (i = 0, k = -1; i < statetest.length; i++) {
    if (i % n === 0) {
      // add new row
      k++;
      array2D[k] = [];
    }
    // push column
    if (statetest[i] === 0) {
      emptyRow = k;
      emptyCol = i % n;
    }
    array2D[k].push(statetest[i]);
  }
  var ourState = [0, array2D, emptyRow, emptyCol, 0];
  console.log(ourState);
  return ourState;
}

// test()
start();
//   export default AStar;
