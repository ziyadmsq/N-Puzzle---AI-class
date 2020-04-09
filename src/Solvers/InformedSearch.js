import PriorityQueue from 'js-priority-queue';
import HashSet from 'hashset';
import SolverNode from './SolverNode.js';

function InformedSearch(initial, goal, empty) {
    this.idCounter = 0;
    this.initial = initial;
    this.goal = goal;
    this.empty = empty;
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
    // Add current state to visited list
    let maxDepth = 0;
    let maxValue = 0;
    this.visited.add(this.initial.strRepresentation);
    while (this.queue.length > 0) {

        let current = this.queue.dequeue();

        // if (current.depth > maxDepth) {
        //     maxDepth = current.depth;
        //     // console.log("depth: " + maxDepth);
        // }
        // if (current.value > maxValue) {
        //     maxValue = current.value;
        //     // console.log("maxValue: " + maxValue + " Value: " + (maxValue - current.depth));
        // }
        if (current.strRepresentation === this.goal.strRepresentation)
            return current;
        this.expandNode(current);
    }
}
InformedSearch.prototype.expandNode = function (node) {

    let col = node.emptyCol;
    let row = node.emptyRow;

    // Up
    if (row > 0) {
        this.expandInDir(-1, 0, 'd', node);
    }
    // Down
    if (row < node.size - 1) {
        this.expandInDir(1, 0, 'u', node);
    }
    // Left
    if (col > 0) {
        this.expandInDir(0, -1, 'r', node);
    }
    // Right
    if (col < node.size - 1) {
        this.expandInDir(0, 1, 'l', node);
    }
}

InformedSearch.prototype.expandInDir = function (rd, cd, pd, node) {
    let col = node.emptyCol;
    let row = node.emptyRow;

    let newState = node.state.clone();
    let temp = newState[row + rd][col + cd];

    newState[row + rd][col + cd] = this.empty;
    newState[row][col] = temp;

    let newNode = new SolverNode(0, newState, row + rd, col + cd, node.depth + 1, this.idCounter++);
    if (!this.visited.contains(newNode.strRepresentation)) {
        newNode.value = this.getValue(newNode);
        newNode.path = node.path + pd;
        this.queue.queue(newNode);
        this.visited.add(newNode.strRepresentation);
    }
}

InformedSearch.prototype.getValue = function (node) {
    throw new Error("Can't call abstract function");
}

Array.prototype.clone = function() {
    return JSON.parse(JSON.stringify(this));
  };
export default InformedSearch;
