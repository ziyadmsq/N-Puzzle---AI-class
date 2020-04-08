import PriorityQueue from 'js-priority-queue';
import HashSet from 'hashset';
/**
 * this is the object of A star
 * contains many function stored in the prototype
 * the functions are listed
 *  - execute
 *  - expandNode
 *  - clone
 *  - heuristic
 *  */
function Greedy(initial, goal, empty) {
  this.initial = initial;
  this.goal = goal;
  this.empty = empty;
  this.queue = new PriorityQueue({
    comparator: function(a, b) {
    //   if (a.value > b.value) return 1;
    //   if (a.value < b.value) return -1;
    //   return 0;
      return a.value - b.value;
    }
  });
  this.queue.queue(initial);
//   console.log(initial.state)
  this.visited = new HashSet();
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
Greedy.prototype.execute = function() {
  // Add current state to visited list
  this.visited.add(this.initial.strRepresentation);
  while (this.queue.length > 0) {
    var current = this.queue.dequeue();

    if (current.strRepresentation == this.goal.strRepresentation){
      return current;
    }
    this.expandNode(current);
  }
};
Greedy.prototype.expandNode = function(node) {
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
      newNode.value = this.heuristic(newNode);
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
      newNode.value = this.heuristic(newNode);
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
      newNode.value = this.heuristic(newNode);
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
      newNode.value = this.heuristic(newNode);
      newNode.path = node.path + 'l';
      this.queue.queue(newNode);
      this.visited.add(newNode.strRepresentation);
    }
  }
};
Array.prototype.clone = function() {
  return JSON.parse(JSON.stringify(this));
};
Greedy.prototype.heuristic = function(node) {
  return this.manhattanDistance(node);
};
Greedy.prototype.misplacedTiles = function(node) {
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
Greedy.prototype.manhattanDistance = function(node) {
  var result = 0;

  for (var i = 0; i < node.state.length; i++) {
    for (var j = 0; j < node.state[i].length; j++) {
      var elem = node.state[i][j];
      var found = false;
      for (var h = 0; h < this.goal.state.length; h++) {
        for (var k = 0; k < this.goal.state[h].length; k++) {
          if (this.goal.state[h][k] == elem) {
            //   console.log("manhattan results"+result)
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

Greedy.prototype.heuristic = function(node) {
  return this.manhattanDistance(node) + this.manhattanDistance(node);
};


export default Greedy;
