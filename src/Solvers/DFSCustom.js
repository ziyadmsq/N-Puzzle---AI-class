import PriorityQueue from 'js-priority-queue';
import InformedSearch from './InformedSearch.js';
import SolverNode from './SolverNode.js';
const DFSCustomVisitList = function (initial, goal, empty, maxDepth) {
  InformedSearch.call(this, initial, goal, empty);
  this.maxDepth = maxDepth;
  this.queue = new PriorityQueue({
    comparator: function (a, b) {
      return b.id - a.id > 0 ? 1 : -1;
    }
  });
  this.queue.queue(initial);
  this.visited = []
  this.hasVisitList = false;
};


DFSCustomVisitList.prototype = Object.create(InformedSearch.prototype)

DFSCustomVisitList.prototype.expandInDir = function (rd, cd, pd, node) {
  if (node.depth >= this.maxDepth) {
    return;
  }
  let col = node.emptyCol;
  let row = node.emptyRow;

  let newState = node.state.clone();
  let temp = newState[row + rd][col + cd];

  newState[row + rd][col + cd] = this.empty;
  newState[row][col] = temp;

  let newNode = new SolverNode(0, newState, row + rd, col + cd, node.depth + 1, this.idCounter++);
  
  let x = this.visited[newNode.strRepresentation];
  // console.log(x);

  if (x === undefined || x > newNode.depth) {
      this.numberOfExpandedNodes++;
      newNode.value = this.getValue(newNode);
      newNode.path = node.path + pd;
      this.queue.queue(newNode);
      if(x === undefined)
        this.visited.length++;
      this.visited[newNode.strRepresentation] = newNode.depth;
  } else
      this.numberOfNodesDroppedByVisit++;
}


DFSCustomVisitList.prototype.getValue = (node) => {
  return 0;
}

export default DFSCustomVisitList;