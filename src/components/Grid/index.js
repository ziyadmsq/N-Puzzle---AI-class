import React, { Component } from 'react';
import {
  GridContainer,
  GameFactoryConsumer,
  GridOverlay,
  Icon
} from '@Elements';
import { color, gameState } from '@Utils';
import ClipLoader from "react-spinners/ClipLoader";

import Cell from '../Cell';
export default class Grid extends Component {
  cellRender(number = [], clickMove) {
    return number.map((i, _) => (
      <Cell key={_} number={i} index={_} clickMove={clickMove} />
    ));
  }
  render() {
    return (
      <GameFactoryConsumer>
        {({ values, methods }) => (
          <GridContainer n={this.props.n} id="findme">
            {this.cellRender(values.numbers, methods.clickMove)}
            {values.gameState === gameState.GAME_PAUSED && (
              <GridOverlay>
                <div onClick={methods.pauseGame}>
                  <Icon
                    name="play"
                    color={color.modalBackgroundColor}
                    size={80}
                    style={{
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </GridOverlay>
            )}
            {values.gameState === gameState.GAME_SOLVING && (
              <div className="solvingBlocker">
                <div>
                <ClipLoader
                  size={150}
                  color={"#123abc"}
                />
                </div>
              </div>
            )}
          </GridContainer>
        )}
      </GameFactoryConsumer>
    );
  }
}
