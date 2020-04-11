import PriorityQueue from 'js-priority-queue';
import InformedSearch from './InformedSearch.js';
const DFS = function (initial, goal, empty, maxDepth) {
  InformedSearch.call(this, initial, goal, empty);
  this.maxDepth = maxDepth;
  this.queue = new PriorityQueue({
    comparator: function (a, b) {
      return b.id - a.id > 0 ? 1 : -1;
    }
  });
  this.queue.queue(initial);
  this.hasVisitList = false;

};
DFS.prototype = Object.create(InformedSearch.prototype)

DFS.prototype.expandInDir = function (rd, cd, pd, node) {
  if (node.depth >= this.maxDepth) {
    return;
  }
  return InformedSearch.prototype.expandInDir.call(this, rd, cd, pd, node);
}

DFS.prototype.getValue = (node) => {
  return 0;
}
export default DFS;