import React, { Component } from 'react';
import {
  GameScore,
  Button,
  PlayPauseContainer,
  Modal,
  ModalContainer
} from '@Elements';
import Score from '../Score';
import Grid from '../Grid';

import { gameState } from '@Utils';
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

  render() {
    return (
      <div id="hi">
        <GameScore>
          <Button onClick={this.props.resetGame}>new game</Button>
          <Score moves={this.props.moves} seconds={this.props.seconds} />
        </GameScore>

        <Grid n={this.props.n} />

        <PlayPauseContainer>
          <Button
            type="big"
            onClick={this.props.pauseGame}
            disabled={this.props.gameState === gameState.GAME_IDLE}
          >
            {this.props.gameState === gameState.GAME_PAUSED ? 'Play' : 'Pause'}
          </Button>
          <input className="nInput" type="number" min={2} max={9} maxLength={1} defaultValue="3" onChange={this.props.changeN}/>

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
    );
  }
}
