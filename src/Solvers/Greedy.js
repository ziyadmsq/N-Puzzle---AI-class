import manhattanDistance from './Heuristic.js'
import InformedSearch from './InformedSearch.js';
const Greedy = function (initial, goal, empty) {
  InformedSearch.call(this, initial, goal, empty);
};
Greedy.prototype = Object.create(InformedSearch.prototype)

Greedy.prototype.getValue = (node) => {
  return manhattanDistance(node);
}
export default Greedy;