import React, { Fragment } from 'react';
import { KeyBoardManagar } from '@HOC';

import { Header, Game } from '@Components';
import { Container, Wave, GameFactoryConsumer } from '@Elements';

const Home = ({ eventType, props }) => {

  return (
    <GameFactoryConsumer>
      {({ values, methods }) => {
        return (
          <Container n={values.n}>
            <Fragment>
              <br />
              <Game eventType={eventType} {...values} {...methods} />
              <br />
            </Fragment>
          </Container>

        );
      }}
    </GameFactoryConsumer>
  );
};

export default KeyBoardManagar(Home);
