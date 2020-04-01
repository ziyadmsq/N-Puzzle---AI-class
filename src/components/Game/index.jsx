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

  render() {

    return (
      <div >
        <div style={{ float: "left" }}>
          <GameScore>
            <Button onClick={this.props.resetGame}>new game</Button>
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
                  textColor="white"
                  onClick={this.props.resetGame}
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
