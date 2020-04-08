import manhattanDistance from './Heuristic.js'
import InformedSearch from './InformedSearch.js';
const AStar = function (initial, goal, empty) {
  InformedSearch.call(this, initial, goal, empty);
}
AStar.prototype = Object.create(InformedSearch.prototype)

AStar.prototype.getValue = (node) => {
  return node.depth + manhattanDistance(node);
}
export default AStar;