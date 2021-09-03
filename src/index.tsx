import React from 'react';
import ReactDOM from 'react-dom';
import { normalize } from 'styled-normalize';
import { createGlobalStyle } from 'styled-components';
import App from './App';

export const GlobalStyle = createGlobalStyle`
  ${normalize}

  body {
    font-family: Arial, sans-serif;
    padding: 0;
    background-color: #c53c3c;
  }
`;

const Root = () => (
  <React.Fragment>
    <GlobalStyle />
    <App />
  </React.Fragment>
);

ReactDOM.render(<Root />, document.querySelector('#root'));
