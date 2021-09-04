import styled from 'styled-components';

interface HasRef {
  ref: any;
}

// STYLED COMPONENTS
export const MainWrap = styled.main`
  max-width: 1000px;
  margin: 0 auto;
  padding: 4rem 2rem 2rem 2rem;
  text-align: center;
`;
export const MovieResults = styled.section`
  display: flex;
  position: relative;
  max-width: 500px;
  margin: 0 auto;
`;
export const SearchWrap = styled.div`
  flex: 1;
  margin-right: 1rem;
`;
export const SearchButton = styled.button`
  cursor: pointer;
  font-size: 1rem;
  margin-left: 1em;
  background-color: #8a1717;
  border: none;
  border-radius: 3px;
  color: #fff;
  width: 6rem;
  outline: 0;
  transition: background-color 0.3s;

  &:hover {
    background-color: #a72121;
  }

  &:focus {
    box-shadow: 0 0 3px 2px #f5a6a6;
  }
`;
export const Dropdown = styled.ul<HasRef>`
  background-color: #ffe9e9;
  border-radius: 5px;
  font-size: 1.2rem;
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  top: calc(100% + 1rem);
  left: 0;
  right: 0;
  overflow: hidden;
`;
export const DropdownItem = styled.li`
  border-bottom: 1px solid #e4b3b3;
  margin: 0;

  &:last-child {
    border-bottom: none;
  }
`;
export const DropdownItemButton = styled.button`
  background: none;
  color: #a95555;
  padding: 0.5em 1rem;
  width: 100%;
  outline: 0;
  border: none;

  &:hover,
  &:focus {
    background-color: #ffb3b3;
    color: #000;
    cursor: pointer;
  }
`;
export const DropdownItemNotFound = styled.span`
  display: block;
  padding: 0.5em 0;
`;
export const MoviePoster = styled.section`
  font-size: 1.5rem;
  padding-top: 2em;
  text-align: center;
`;
export const PosterPlaceholder = styled.section``;
