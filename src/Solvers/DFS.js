import SolverNode from './SolverNode.js'
import InformedSearch from './InformedSearch.js';
const DFS = function (initial, goal, empty, maxDepth) {
  InformedSearch.call(this, initial, goal, empty);
  this.maxDepth = maxDepth;
};
DFS.prototype = Object.create(InformedSearch.prototype)

DFS.prototype.expandInDir = function (rd, cd, pd, node) {
  if (node.depth >= this.maxDepth) {
    return;
  }
  let col = node.emptyCol;
  let row = node.emptyRow;

  let newState = node.state.clone();
  let temp = newState[row + rd][col + cd];

  newState[row + rd][col + cd] = this.empty;
  newState[row][col] = temp;

  let newNode = new SolverNode(0, newState, row + rd, col + cd, node.depth + 1);
  if (!this.visited.contains(newNode.strRepresentation)) {
    newNode.value = newNode.depth;
    newNode.path = node.path + pd;
    this.queue.queue(newNode);
    this.visited.add(newNode.strRepresentation);
  }
}
export default DFS;