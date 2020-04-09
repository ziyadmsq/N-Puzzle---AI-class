export default class SolverNode {
    constructor(value, state, emptyRow, emptyCol, depth,id) {
      this.id = id;
      this.value = value;
      this.state = state;
      this.emptyCol = emptyCol;
      this.emptyRow = emptyRow;
      this.depth = depth;
      this.strRepresentation = '';
      this.path = '';
      // String representation of the state in CSV format
      for (var i = 0; i < state.length; i++) {
        for (var j = 0; j < state[i].length; j++)
          this.strRepresentation += state[i][j] + ',';
      }
      this.size = this.state.length;
    }
  }