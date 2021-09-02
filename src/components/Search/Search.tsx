import styled from 'styled-components';

const SearchForm = styled.form`
  display: inline;
`;
const SearchInput = styled.input`
  font-size: 1.5rem;
`;

function Search(props: {
  searchVal: string;
  setSearchVal: any;
  handleFocus: any;
}): JSX.Element {
  const handleFormSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <SearchForm onSubmit={handleFormSubmit}>
      <SearchInput
        data-testid="movie-search"
        type="text"
        value={props.searchVal}
        onChange={(e) => props.setSearchVal(e.target.value)}
        onFocus={(e) => props.handleFocus()}
      ></SearchInput>
    </SearchForm>
  );
}

export default Search;
