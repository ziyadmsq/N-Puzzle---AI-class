import React, { Fragment } from 'react';
import { KeyBoardManagar } from '@HOC';

import { Header, Game } from '@Components';
import { Container, Wave, GameFactoryConsumer } from '@Elements';

export let n = 4;
const Home = ({ eventType }) => {
  return (
    <Container n={n}>
      <GameFactoryConsumer>
        {({ values, methods }) => {
          return (
            <Fragment>
              <br />
              <Game n={n} eventType={eventType} {...values} {...methods} />
              <br />
            </Fragment>
          );
        }}
      </GameFactoryConsumer>
    </Container>
  );
};

export default KeyBoardManagar(Home);
