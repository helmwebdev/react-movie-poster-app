import React from 'react';
import ReactDOM from 'react-dom';
import { normalize } from 'styled-normalize';
import { createGlobalStyle } from 'styled-components';
import App from './App';

export const GlobalStyle = createGlobalStyle`
  ${normalize}

  body {
    padding: 0;
    background-color: darkblue;
  }
`;

const Root = () => (
  <React.Fragment>
    <GlobalStyle />
    <App />
  </React.Fragment>
);

ReactDOM.render(<Root />, document.querySelector('#root'));
