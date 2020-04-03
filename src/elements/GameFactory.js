import React, { Component, createContext } from 'react';

import {
  swap,
  isNeighbour,
  swapSpace,
  shuffle,
  checkArray,
  gameState
} from '@Utils';
import AStar from './AStar';

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
  var gridWidth = Math.sqrt(puzzle.length);
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
  return [5,8,3,6,7,4,1,0,2]
  if (event === NEW_GAME) {
    if (isSolvable(arr)) {
      console.log("genratePuzzle()"+arr)
      return arr;
    } else {
      genArr = genratePuzzle(shuffle(genrateArray(nn1, 1)), NEW_GAME, nn1);
      console.log("genratePuzzle()"+genArr)
      return genArr
    }
  } else {
    console.log("genratePuzzle()"+arr)
    return arr;
  }
};
const translateFromLetterIntoNums = (letters) => {
  // based on the keyboard's arrows
  // it should be reversed for Astar algorithm 
  let res = [];
  letters.forEach(l => {
    if (l === "u")
      res.push(0);
    if (l === "d")
      res.push(2);
    if (l === "r")
      res.push(1);
    if (l === "l")
      res.push(3);
  });
  return res;
}
const breadthSolver = (numbers) => {
  //this is a simulation
  //wait 2 sec
  let now = new Date().getTime();
  while (new Date().getTime() - now < 2000);

  console.log("found sol");
  console.log("translateFromLetterIntoNums() = " + translateFromLetterIntoNums(["u", "r", "d", "l",]))
  return translateFromLetterIntoNums(["u", "r", "d", "l",]);
}
const AStarSolver = (initalState) => {
  //this is a simulation
  //wait 2 sec
  // let now = new Date().getTime();
  // while (new Date().getTime() - now < 2000);
  // // i only did the previous lines because Obada did it and it seems important

  // // create goal state 
  // // TODO: make it adaptable to n*n
  // goalState = [1,2,3,4,5,6,7,8,0]
  // var astar = new AStar(init, goal, 0);
  // astarResult = astar.execute()
  // 'uldruurddluruldrulldrurdd'.split("")
  console.log(initalState)
  var astar = new AStar(initalState,3)
  console.log("it ain't much, but it's honest work")
  var result = astar.execute();
  console.log(result.path)
  // return translateFromLetterIntoNums('drulddluurdldruldrruldluu'.split(""));
  return translateFromLetterIntoNums(result.path.split(""));


}

class GameFactory extends Component {

  state = this.defaultState(NEW_GAME, 1);

  timerId = null;

  nn1() {
    if (this.state && this.state.n) {
      return this.state.n * this.state.n - 1;
    }
    return 8;//n=3
  }

  defaultState(_event, num, n) {
    return {
      numbers:
        _event === NEW_GAME
          ? genratePuzzle(shuffle(genrateArray(this.nn1(), num)), _event, this.nn1())
          : shuffle(genrateArray(this.nn1(), num)),
      moves: 0,
      seconds: 0,
      n: n ? n : (this.state ? this.state.n : 3),
      gameState: gameState.GAME_IDLE,
      algrthm: { name: "A*" },
      depth: 20,
    }
  }

  reset = () => {
    this.setState(this.defaultState(RESET_GAME));
    setTimeout(() => {
      this.setState(this.defaultState(NEW_GAME, 1));
      if (this.timerId) {
        clearInterval(this.timerId);
      }
    }, 100);
  };

  gettingEmptyBoxLocation = (n) => {
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
          n: prevState.n,
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
    if (this.state.gameState === gameState.GAME_SOLVING || this.state.gameState === gameState.GAME_PLAYING_SOLUTION)
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
    if (this.state.gameState === gameState.GAME_SOLVING || this.state.gameState === gameState.GAME_PLAYING_SOLUTION || this.state.gameState === gameState.GAME_PLAYING_SOLUTION)
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

  changeN = (event) => {
    if (this.state.gameState === gameState.GAME_SOLVING || this.state.gameState === gameState.GAME_PLAYING_SOLUTION)
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
    if (this.state.gameState === gameState.GAME_SOLVING || this.state.gameState === gameState.GAME_PLAYING_SOLUTION)
      return;
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    this.setState({ gameState: gameState.GAME_SOLVING }, () => {
      console.log(this.state.gameState);
      setTimeout(() => {
        let moves = this.getMoves();
        console.log("moves"+moves);
        this.playSolution(moves);
      }, 100);
    });
  }

  getMoves() {
    let moves = [];
    switch (this.state.algrthm.name) {
      case "Breadth":
        console.log("this.state.number = " + this.state.number)
        console.log("this.state.numbers = " +this.state.numbers)
        moves = breadthSolver(this.state.number);
        break;
      case "A*":
        // change  to Astar class
        // astar = new AStar()
        console.log(this.state.number)
        moves = AStarSolver(this.state.numbers)
        break;
    }
    return moves;
  }

  playSolution(moves) {
    this.setState({ gameState: gameState.GAME_PLAYING_SOLUTION }, () => {
      console.log("state set");
      let i = 0;
      let timer = setInterval(function (m,n,getBox,move) {
        if (i === m.length) {
          clearInterval(timer);
          return;
        }
        const [row, col, location] = getBox(n);
        move(location, row, col, m[i], n)
        i++;
      }, 500, moves,this.state.n,this.gettingEmptyBoxLocation,this.move);
    });
  }

  changeAlgrthm = (newAlgrthm) => {
    if (this.state.gameState === gameState.GAME_SOLVING || this.state.gameState === gameState.GAME_PLAYING_SOLUTION)
      return;
    this.setState({ algrthm: newAlgrthm });
  }

  setDepth = (d) => {
    if (this.state.gameState === gameState.GAME_SOLVING || this.state.gameState === gameState.GAME_PLAYING_SOLUTION)
      return;
    this.setState({ depth: d });
  }
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
          }}
        >
          {this.props.children}
        </SetValueContext.Provider>
      </ValuesContext.Provider>
    );
  }
}

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
