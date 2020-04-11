import React, { Component, createContext } from 'react';

import {
  swap,
  isNeighbour,
  swapSpace,
  shuffle,
  checkArray,
  gameState
} from '@Utils';
import AStar from '../Solvers/AStar';
import DFS from '../Solvers/DFS'
import IDS from '../Solvers/IDS'
import BFS from '../Solvers/BFS'
import Greedy from '../Solvers/Greedy'
import SolverNode from '../Solvers/SolverNode'

const NEW_GAME = '__new_game__';
const RESET_GAME = '__reset_game__';
const genrateArray = (num, add) => {
  let puzzle = [...Array(num)].map((_, i) => i + add);
  puzzle.push(0);
  return puzzle;
};
const ValuesContext = createContext({});
const SetValueContext = createContext(() => { });

const isSolvable = puzzle => {
  let parity = 0;
  let gridWidth = Math.sqrt(puzzle.length);
  let row = 0;
  let blankRow = 0;
  for (let i = 0; i < puzzle.length; i++) {
    if (i % gridWidth == 0) {
      // advance to next row
      row++;
    }
    if (puzzle[i] == 0) {
      blankRow = row;
      continue;
    }
    for (var j = i + 1; j < puzzle.length; j++) {
      if (puzzle[i] > puzzle[j] && puzzle[j] != 0) {
        parity++;
      }
    }
  }

  if (gridWidth % 2 == 0) {
    if (blankRow % 2 == 0) {
      return parity % 2 == 0;
    } else {
      return parity % 2 != 0;
    }
  } else {
    return parity % 2 == 0;
  }
};

const genratePuzzle = (arr, event, nn1) => {
  // return [5, 8, 3, 6, 7, 4, 1, 0, 2]
  // return [5, 1, 7, 3, 9, 2, 11, 4, 13, 6, 15, 8, 0, 10, 14, 12]
  // return [2,5,13,12,1,0,3,15,9,7,14,6,10,11,8,4];
  // return '1 8 7 4 10 2 9 15 0 13 5 14 11 12 6 3'.split(' ')
  if (event === NEW_GAME) {
    if (isSolvable(arr)) {

      return arr;
    } else {
      let genArr = genratePuzzle(shuffle(genrateArray(nn1, 1)), NEW_GAME, nn1);
      return genArr;
    }
  } else {

    return arr;
  }
};
const translateFromLetterIntoNums = letters => {
  // based on the keyboard's arrows
  let res = [];
  letters.forEach(l => {
    if (l === 'u') res.push(0);
    if (l === 'd') res.push(2);
    if (l === 'r') res.push(1);
    if (l === 'l') res.push(3);
  });
  return res;
};

function createGoalState(n) {
  let array = [];
  let array2D = [];
  for (let i = 1; i < n * n; i++) {
    array.push(i);
  }
  array.push(0);
  while (array.length) array2D.push(array.splice(0, n));
  return new SolverNode(0, array2D, n - 1, n - 1, 0);
}
function convertState(array, n) {
  let array2D = [],
    emptyRow,
    emptyCol;
  for (let i = 0; i < n; i++) {
    array2D.push([]);
    for (let j = 0; j < n; j++) {
      array2D[i][j] = array[i * n + j];
      if (array2D[i][j] == 0) {
        emptyRow = i;
        emptyCol = j;
      }
    }
  }
  // console.table(array2D);

  return new SolverNode(0, array2D, emptyRow, emptyCol, 0);
}

class GameFactory extends Component {
  state = this.defaultState(NEW_GAME, 1);

  timerId = null;

  nn1() {
    if (this.state && this.state.n) {
      return this.state.n * this.state.n - 1;
    }
    return 8; //n=3
  }

  defaultState(_event, num, n, arr) {
    return {
      numbers: arr === undefined ? (
        _event === NEW_GAME
          ? genratePuzzle(
            shuffle(genrateArray(this.nn1(), num)),
            _event,
            this.nn1()
          )
          : shuffle(genrateArray(this.nn1(), num))) : arr,
      moves: 0,
      seconds: 0,
      n: n ? n : this.state ? this.state.n : 3,
      gameState: gameState.GAME_IDLE,
      algrthm: this.state ? this.state.algrthm : { name: 'A*' },
      depth: this.state ? this.state.depth : 20,
      delta: this.state ? this.state.delta : 1,
    };
  }

  reset = (arr) => {
    this.setState(this.defaultState());
    setTimeout((arr) => {
      if (arr === undefined)
        this.setState(this.defaultState(NEW_GAME, 1));
      else
        this.setState(this.defaultState(NEW_GAME, 1, Math.sqrt(arr.length), arr));
      if (this.timerId) {
        clearInterval(this.timerId);
      }
    }, 100, arr);
  };

  gettingEmptyBoxLocation = n => {
    let location = this.state.numbers.indexOf(0);
    let column = Math.floor(location % n);
    let row = Math.floor(location / n);
    return [row, column, location];
  };

  move = (from, row, col, moveType, n) => {
    this.setState(prevState => {
      let newState = null;
      const [updated, newNumList] = swapSpace(
        prevState.numbers,
        from,
        row,
        col,
        moveType,
        n
      );
      if (updated) {
        newState = {
          number: newNumList,
          moves: prevState.moves + 1,
          n: prevState.n
        };
        if (prevState.moves === 0) {
          this.setTimer();
          newState = {
            ...newState,
            gameState: gameState.GAME_STARTED
          };
        }
        if (checkArray(this.state.numbers)) {
          clearInterval(this.timerId);
          newState = {
            ...newState,
            gameState: gameState.GAME_OVER
          };
        }
      }
      return newState;
    });
  };

  addTimer = () => {
    this.setState(prevState => {
      return { seconds: prevState.seconds + 1 };
    });
  };

  setTimer = () => {
    this.timerId = setInterval(() => {
      this.addTimer();
    }, 1000);
  };

  clickMove = from => {
    if (
      this.state.gameState === gameState.GAME_SOLVING ||
      this.state.gameState === gameState.GAME_PLAYING_SOLUTION
    )
      return;
    this.setState(prevState => {
      let newState = null;
      let to = prevState.numbers.indexOf(0);
      if (isNeighbour(to, from, this.state.n)) {
        const newNumList = swap(prevState.numbers, to, from);
        newState = {
          number: newNumList,
          moves: prevState.moves + 1
        };
        if (prevState.moves === 0) {
          this.setTimer();
          newState = {
            ...newState,
            gameState: gameState.GAME_STARTED
          };
        }
        if (checkArray(this.state.numbers)) {
          clearInterval(this.timerId);
          newState = {
            ...newState,
            gameState: gameState.GAME_OVER
          };
        }
      }
      return newState;
    });
  };

  onPauseClick = () => {
    if (
      this.state.gameState === gameState.GAME_SOLVING ||
      this.state.gameState === gameState.GAME_PLAYING_SOLUTION ||
      this.state.gameState === gameState.GAME_PLAYING_SOLUTION
    )
      return;
    this.setState(prevState => {
      let newGameState = null;

      if (prevState.gameState === gameState.GAME_STARTED) {
        clearInterval(this.timerId);
        newGameState = gameState.GAME_PAUSED;
      } else {
        this.setTimer();
        newGameState = gameState.GAME_STARTED;
      }

      return {
        gameState: newGameState
      };
    });
  };

  changeN = event => {
    if (
      this.state.gameState === gameState.GAME_SOLVING ||
      this.state.gameState === gameState.GAME_PLAYING_SOLUTION
    )
      return;
    let n = parseInt(event.target.value);
    this.setState(this.defaultState(RESET_GAME, 1, n));
    setTimeout(() => {
      this.setState(this.defaultState(NEW_GAME, 1, n));
      if (this.timerId) {
        clearInterval(this.timerId);
      }
    }, 100);
  };

  solve = () => {
    if (
      this.state.gameState === gameState.GAME_SOLVING ||
      this.state.gameState === gameState.GAME_PLAYING_SOLUTION
    )
      return;
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    this.setState({ gameState: gameState.GAME_SOLVING }, () => {

      setTimeout(() => {
        let solution = this.getSolution();
        this.setState({
          ...solution
        });
        this.playSolution(translateFromLetterIntoNums(solution.path.split('')));
      }, 100);
    });
  };

  getSolution() {
    let init = convertState(this.state.numbers, this.state.n);
    let goal = createGoalState(this.state.n);

    let solver = {};
    switch (this.state.algrthm.name) {
      case 'Breadth':
        solver = new BFS(init, goal, 0);
        break;
      case 'A*':
        solver = new AStar(init, goal, 0);
        break;
      case 'Depth':
        solver = new DFS(init, goal, 0, this.state.depth);
        break;
      case 'IDS':
        solver = new IDS(init, goal, 0, this.state.delta);
        break;
      case 'Greedy':
        solver = new Greedy(init, goal, 0);
        break;
    }
    var result = solver.execute();
    // console.log(result);
    
    if (result)
      return result;
    else {
      return [];
    }
  }

  playSolution(moves) {
    this.setState({ gameState: gameState.GAME_PLAYING_SOLUTION }, () => {

      let i = 0;
      let timer = setInterval(
        function (m, n, getBox, move) {
          if (i === m.length) {
            clearInterval(timer);
            return;
          }
          const [row, col, location] = getBox(n);
          move(location, row, col, m[i], n);
          i++;
        },
        150,
        moves,
        this.state.n,
        this.gettingEmptyBoxLocation,
        this.move
      );
    });
  }

  changeAlgrthm = newAlgrthm => {
    if (
      this.state.gameState === gameState.GAME_SOLVING ||
      this.state.gameState === gameState.GAME_PLAYING_SOLUTION
    )
      return;
    this.setState({ algrthm: newAlgrthm });
  };

  setDepth = d => {
    if (
      this.state.gameState === gameState.GAME_SOLVING ||
      this.state.gameState === gameState.GAME_PLAYING_SOLUTION
    )
      return;
    this.setState({ depth: d });
  };
  setDelta = d => {
    if (
      this.state.gameState === gameState.GAME_SOLVING ||
      this.state.gameState === gameState.GAME_PLAYING_SOLUTION
    )
      return;

    this.setState({ delta: d });
  };
  render() {
    return (
      <ValuesContext.Provider value={this.state}>
        <SetValueContext.Provider
          value={{
            resetGame: this.reset,
            setTimer: this.setTimer,
            gettingEmptyBoxLocation: this.gettingEmptyBoxLocation,
            moveCell: this.move,
            clickMove: this.clickMove,
            pauseGame: this.onPauseClick,
            changeN: this.changeN,
            solve: this.solve,
            changeAlgrthm: this.changeAlgrthm,
            setDepth: this.setDepth,
            setDelta: this.setDelta
          }}
        >
          {this.props.children}
        </SetValueContext.Provider>
      </ValuesContext.Provider>
    );
  }
}

export { isSolvable };
export const GameFactoryConsumer = ({ children }) => {
  return (
    <ValuesContext.Consumer>
      {values => (
        <SetValueContext.Consumer>
          {methods => children({ values, methods })}
        </SetValueContext.Consumer>
      )}
    </ValuesContext.Consumer>
  );
};

export default GameFactory;
