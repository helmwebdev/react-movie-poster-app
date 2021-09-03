import { useEffect, useState } from 'react';
import styled from 'styled-components';

const SearchForm = styled.form``;
const SearchInputWrap = styled.div`
  border-bottom: 1px solid #000;
  height: 2rem;
  padding-bottom: 0.5em;
`;
const SearchInput = styled.input`
  background: none;
  border: none;
  color: #000;
  display: block;
  font-size: 1.5rem;
  outline: none;
  width: 100%;

  &::placeholder {
    color: #000;
  }

  &:focus {
    ::placeholder {
      color: #252525;
    }
  }
`;

interface SearchProps {
  clearSearchVal?: boolean;
  handleChange?: any;
  handleFocus?: any;
}

function Search(props: SearchProps): JSX.Element {
  const [localSearchVal, setLocalSearchVal] = useState('');

  useEffect(() => {
    if (props.clearSearchVal) {
      setLocalSearchVal('');
    }
  }, [props.clearSearchVal]);

  const handleChangeLocal = (e: any) => {
    const newVal = e.target.value;
    props.handleChange(newVal);
    setLocalSearchVal(newVal);
  };
  const handleFormSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <SearchForm onSubmit={handleFormSubmit}>
      <SearchInputWrap>
        <SearchInput
          data-testid="movie-search"
          type="text"
          placeholder="Search for a Movie"
          value={localSearchVal}
          onChange={handleChangeLocal}
          onFocus={() => props.handleFocus()}
        ></SearchInput>
      </SearchInputWrap>
    </SearchForm>
  );
}

export default Search;
