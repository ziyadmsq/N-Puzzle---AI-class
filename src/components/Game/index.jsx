import React, { Component } from 'react';
import Select from 'react-select';
import {
  GameScore,
  Button,
  PlayPauseContainer,
  Modal,
  ModalContainer,
  MovmentPanel,
} from '@Elements';
import Score from '../Score';
import Grid from '../Grid';
import { isSolvable } from '../../elements/GameFactory.js';
import { gameState } from '@Utils';

const algorithms = [
  { value: 'A*', label: 'A*' },
  { value: 'Greedy', label: 'Greedy' },
  { value: 'Breadth', label: 'Breadth' },
  { value: 'Depth', label: 'Depth' },
  { value: 'IDS', label: 'IDS' },
];//TODO move somewhere

export default class Game extends Component {
  componentDidUpdate(prevProps, prevState) {

    if (prevProps.eventType !== this.props.eventType) {
      const [_, move] = this.props.eventType || [null, null];

      const [row, col, location] = this.props.gettingEmptyBoxLocation(this.props.n);
      if (
        this.props.gameState === gameState.GAME_IDLE ||
        this.props.gameState === gameState.GAME_STARTED
      ) {
        this.props.moveCell(location, row, col, move, this.props.n);
      }
    }
  }
  algorithmChange = (value) => this.props.changeAlgrthm({ name: value.value });

  setDepth = (e) => this.props.setDepth(e.target.value);
  setDelta = (e) => this.props.setDelta(e.target.value);
  isSquare = (n) => n > 0 && Math.sqrt(n) % 1 === 0;

  onNewGameButton = () => {
    let x = prompt("Enter customized n-puzzle.Enter numbers seprated by space"
    +"\nand for the empty block Enter 0 for example: \"1 0 2 3 5 4 7 6 8 \"\nLeave it empty for random puzzle")
    if (x == "")
      this.props.resetGame()
    else if (x == null) { }
    else {
      x = x.trim()
      x = x.split(' ')
      for (let i = 0; i < x.length; i++) {
        x[i] = parseInt(x[i])
      }
      if(this.isSquare(x.length))
        if (isSolvable(x))
          this.props.resetGame(x)
          else {
            alert("Not solvable input")
            this.onNewGameButton()
          }
      else {
        alert("Not solvable input")
        this.onNewGameButton()
      }
    }
  }

  render() {
    return (
      <div >
        <div style={{ float: "left" }}>
          <GameScore>
            <Button onClick={this.onNewGameButton}>new game</Button>
            <Score moves={this.props.moves} seconds={this.props.seconds} />
          </GameScore>
          <PlayPauseContainer>
            <input className="nInput" type="number" min={2} max={9} maxLength={1} defaultValue="3" onChange={this.props.changeN} />
          </PlayPauseContainer>

          <Grid n={this.props.n} />
          <PlayPauseContainer>
            <Button
              type="big"
              onClick={this.props.pauseGame}
              disabled={this.props.gameState === gameState.GAME_IDLE}
            >
              {this.props.gameState === gameState.GAME_PAUSED ? 'Play' : 'Pause'}
            </Button>

          </PlayPauseContainer>
          <Modal on={this.props.gameState === gameState.GAME_OVER}>
            <ModalContainer>
              <div className="text-1">Excellent!</div>
              <div>
                It took you <b>{this.props.moves} moves</b>
              </div>
              <div>
                <Button
                  type="big"
                  textColor="black"
                  onClick={this.onNewGameButton}
                >
                  Play Again
              </Button>
              </div>
            </ModalContainer>
          </Modal>
        </div>
        <MovmentPanel n={this.props.n}>
          <label style={{ color: "#000", fontSize: 22 }}> Algorithm </label>
          <Select
            options={algorithms}
            defaultValue={algorithms[0]}
            onChange={this.algorithmChange}
          />
          <div hidden={this.props.algrthm.name !== "Depth"}>
            <label style={{ color: "#000", fontSize: 22 }}> Max Depth </label>
            <input className="input" type="number" defaultValue="20" onChange={this.setDepth} />
          </div>
          <div hidden={this.props.algrthm.name !== "IDS"}>
            <label style={{ color: "#000", fontSize: 22 }}> Delta </label>
            <input className="input" type="number" defaultValue="1" onChange={this.setDelta} />
          </div>
          <Button
            onClick={this.props.solve}
            disabled={this.props.gameState === gameState.Game_Solving}
            className="btn"
          >
            {this.props.gameState === gameState.Game_Solving ? 'Solving' : 'Solve'}
          </Button>
        </MovmentPanel>
      </div>
    );
  }
}
