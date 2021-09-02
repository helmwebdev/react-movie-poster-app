import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Search from './components/Search/Search';
import { useDebounce } from './hooks/debounce.hook';

const MainWrap = styled.main`
  max-width: 1000px;
  margin: 2rem auto;
  text-align: center;
`;
const MovieResults = styled.section`
  position: relative;
`;
const SearchWrap = styled.main`
  display: inline;
  margin-right: 1rem;
`;
const SearchButton = styled.button`
  font-size: 1.5rem;
  display: inline;
`;
const Dropdown = styled.ul`
  background-color: #fff;
  font-size: 1.2rem;
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 100%;
`;
const DropdownItem = styled.li`
  color: green;
  margin: 0;
  padding: 0.5em 1rem;
`;
const MoviePoster = styled.section``;

enum UIStates {
  INITIAL,
  LOADING_RESULTS,
  VIEWING_RESULTS,
  VIEWING_POSTER,
}

const initSelectedMovie: any = null;

function App(): JSX.Element {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('');
  const [selectedMovie, setSelectedMovie] = useState(initSelectedMovie);
  const [UIState, setUIState] = useState(UIStates.INITIAL);
  const [searchUsedForButtonClick, setSearchUsedForButtonClick] = useState('');
  const [searchNotFound, setSearchNotFound] = useState(false);

  const handleSearchUpdate = (v: string) => {
    setSearch(v);
    setDebouncedSearch(v);
  };

  const getMovies = async (searchVal: string) => {
    setUIState(UIStates.LOADING_RESULTS);
    // TODO: change api key
    const url = `http://www.omdbapi.com/?s=${searchVal}&apikey=263d22d8`;

    const response = await fetch(url);
    const responseJson = await response.json();

    if (responseJson.Search) {
      setMovies(responseJson.Search);
      setSearchNotFound(false);
    } else {
      setSearchNotFound(true);
    }
    setUIState(UIStates.VIEWING_RESULTS);
  };

  useEffect(() => {
    if (debouncedSearch && debouncedSearch.length > 1) {
      getMovies(debouncedSearch);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    setUIState(UIStates.VIEWING_POSTER);
  }, [selectedMovie]);

  const handleSearchButtonClick = (e: any) => {
    e.preventDefault();

    if (search === searchUsedForButtonClick) {
      return;
    }

    getMovies(search);
    setSearchUsedForButtonClick(search);
  };

  const handleSearchItemClick = (e: any) => {
    e.preventDefault();
    const selectedId = e.target.attributes['data-id'].value;
    const selectedMovie = movies.find(
      (movie: any) => movie.imdbID === selectedId,
    );

    setSelectedMovie(selectedMovie);
  };

  const handleSearchFocus = () => {
    if (isInState(UIStates.VIEWING_POSTER)) {
      setUIState(UIStates.VIEWING_RESULTS);
    }
  };

  const isInState = (state: UIStates) => {
    return UIState === state;
  };

  const canShowResults = () => {
    return isInState(UIStates.VIEWING_RESULTS);
  };

  const canShowPoster = () => {
    return (
      selectedMovie &&
      (isInState(UIStates.VIEWING_POSTER) ||
        isInState(UIStates.VIEWING_RESULTS))
    );
  };

  return (
    <MainWrap>
      <MovieResults>
        <SearchWrap>
          <Search
            searchVal={search}
            setSearchVal={handleSearchUpdate}
            handleFocus={handleSearchFocus}
          ></Search>
        </SearchWrap>
        <SearchButton onClick={handleSearchButtonClick}>Search</SearchButton>
        {canShowResults() && (
          <Dropdown>
            {searchNotFound && <DropdownItem>Not found</DropdownItem>}
            {movies.map(
              ({ Title, imdbID }: { Title: string; imdbID: string }) => (
                <DropdownItem
                  key={imdbID}
                  data-id={imdbID}
                  onClick={handleSearchItemClick}
                >
                  {Title}
                </DropdownItem>
              ),
            )}
          </Dropdown>
        )}
      </MovieResults>

      <MoviePoster>
        {canShowPoster() && <img src={selectedMovie.Poster} />}
      </MoviePoster>
    </MainWrap>
  );
}

export default App;
