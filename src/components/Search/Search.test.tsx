import Search from './Search';
import { render, screen, fireEvent } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
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
  const setSearch: any = jest.fn();

  act(() => {
    render(<Search handleChange={setSearch}></Search>, container);
  });

  const searchInput = screen.getByTestId('movie-search');
  expect(searchInput).toHaveValue('');

  act(() => {
    fireEvent.change(searchInput, { target: { value: 'Y' } });
  });

  expect(setSearch).toHaveBeenCalledWith('Y');
  expect(searchInput).toHaveValue('Y');
});
