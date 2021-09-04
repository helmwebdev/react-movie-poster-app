import React from 'react';
import ReactDOM from 'react-dom';
import { normalize } from 'styled-normalize';
import { createGlobalStyle } from 'styled-components';
import App from './App';

export const GlobalStyle = createGlobalStyle`
  ${normalize}

  html {
    background: linear-gradient(#ff6b6b, #c53c3c);
    background-size: cover;
    height: 100%;
  }
  body {
    font-family: Arial, sans-serif;
    padding: 0;
  }
`;

const Root = () => (
  <React.Fragment>
    <GlobalStyle />
    <App />
  </React.Fragment>
);

ReactDOM.render(<Root />, document.querySelector('#root'));
