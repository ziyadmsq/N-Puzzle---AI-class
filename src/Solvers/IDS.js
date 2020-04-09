import DFS from './DFS';
// log = console.log;
function IDS(initial, goal, empty, depthLimit, iterations) {
  this.initial = initial;
  this.goal = goal;
  this.empty = empty;
  this.depthLimit = depthLimit;
  this.iterations = iterations;
}

IDS.prototype.execute = function () {
  let i = 0;
  while (true) {    
    let dfs = new DFS(this.initial, this.goal, this.empty, i++);
    let res = dfs.execute();
    console.log(res);

    if (res)
      return res;
  }
}

export default IDS
