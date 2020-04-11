import PriorityQueue from 'js-priority-queue';
import HashSet from 'hashset';
import SolverNode from './SolverNode.js';

function InformedSearch(initial, goal, empty) {
    this.idCounter = BigInt(0);
    this.numberOfExpandedNodes = 0;
    this.numberOfNodesDroppedByVisit = 0;
    this.initial = initial;
    this.goal = goal;
    this.empty = empty;
    this.hasVisitList = true;
    this.queue = new PriorityQueue({
        comparator: function (a, b) {
            const newLocal = a.value - b.value;
            if (newLocal == 0) {
                //FIFO
                return a.id - b.id;
            }
            return newLocal;
        }
    });
    this.queue.queue(initial);
    this.visited = new HashSet();
}

InformedSearch.prototype.execute = function () {

    let timeStart = Date.now();
    let maxSize = 0, maxQueueSize = 0;
    let numberOfGoalTests = 0;
    if (this.hasVisitList)
        this.visited.add(this.initial.strRepresentation);
    while (this.queue.length > 0) {
        maxSize = Math.max(maxSize, this.visited.length + this.queue.length);
        maxQueueSize = Math.max(maxQueueSize, this.queue.length);
        let current = this.queue.dequeue();

        numberOfGoalTests++;
        if (current.strRepresentation === this.goal.strRepresentation)
            return {
                path: current.path,
                depth: current.depth,
                maxSize,
                visitedSize: this.visited.length,
                maxQueueSize,
                numberOfExpandedNodes: this.numberOfExpandedNodes,
                numberOfNodesDroppedByVisit: this.numberOfNodesDroppedByVisit,
                numberOfGoalTests,
                totalTime: Date.now() - timeStart,
            };
        this.expandNode(current);
    }
    return this;
}
InformedSearch.prototype.expandNode = function (node) {

    let col = node.emptyCol;
    let row = node.emptyRow;

    // Right
    if (col < node.size - 1)
        this.expandInDir(0, 1, 'l', node);
    // Left
    if (col > 0)
        this.expandInDir(0, -1, 'r', node);
    // Up
    if (row > 0)
        this.expandInDir(-1, 0, 'd', node);
    // Down
    if (row < node.size - 1)
        this.expandInDir(1, 0, 'u', node);

}

InformedSearch.prototype.expandInDir = function (rd, cd, pd, node) {
    let col = node.emptyCol;
    let row = node.emptyRow;

    let newState = node.state.clone();
    let temp = newState[row + rd][col + cd];

    newState[row + rd][col + cd] = this.empty;
    newState[row][col] = temp;

    let newNode = new SolverNode(0, newState, row + rd, col + cd, node.depth + 1, this.idCounter++);
    if (!this.hasVisitList || !this.visited.contains(newNode.strRepresentation)) {
        this.numberOfExpandedNodes++;
        newNode.value = this.getValue(newNode);
        newNode.path = node.path + pd;
        this.queue.queue(newNode);
        if (this.hasVisitList)
            this.visited.add(newNode.strRepresentation);
    } else
        this.numberOfNodesDroppedByVisit++;
}

InformedSearch.prototype.getValue = function (node) {
    throw new Error("Can't call abstract function");
}

Array.prototype.clone = function () {
    return JSON.parse(JSON.stringify(this));
};
export default InformedSearch;
