import React from 'react';
import Search from './Search';
import { render, screen, fireEvent } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { useState } from 'react';
import { resolveTypeReferenceDirective } from 'typescript';
let container: any = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('sets search value when changed', () => {
  let searchVal = '';
  const setSearch: any = jest.fn((v) => (searchVal = v));
  let renderAgain: any;

  act(() => {
    const { rerender } = render(
      <Search searchVal={searchVal} setSearchVal={setSearch}></Search>,
      container,
    );

    renderAgain = rerender;
  });

  let searchInput = screen.getByTestId('movie-search');
  expect(searchInput).toHaveValue('');

  act(() => {
    fireEvent.change(searchInput, { target: { value: 'Y' } });

    renderAgain(
      <Search searchVal={searchVal} setSearchVal={setSearch}></Search>,
    );
  });

  expect(setSearch).toHaveBeenCalledWith('Y');
  expect(searchInput).toHaveValue('Y');
});
