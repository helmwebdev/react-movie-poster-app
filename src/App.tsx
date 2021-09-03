import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Search from './components/Search/Search';
import { useDebounce } from './hooks/debounce.hook';
import Spinner from './components/Spinner/Spinner';
import FadeIn from './components/FadeIn/FadeIn';

// STYLED COMPONENTS
const MainWrap = styled.main`
  max-width: 1000px;
  margin: 0 auto;
  padding: 4rem 2rem 2rem 2rem;
  text-align: center;
`;
const MovieResults = styled.section`
  display: flex;
  position: relative;
  max-width: 500px;
  margin: 0 auto;
`;
const SearchWrap = styled.div`
  flex: 1;
  margin-right: 1rem;
`;
const SearchButton = styled.button`
  cursor: pointer;
  font-size: 1rem;
  margin-left: 1em;
  background-color: #8a1717;
  border: none;
  border-radius: 3px;
  color: #fff;
  width: 6rem;
  outline: 0;

  &:hover {
    background-color: #a72121;
  }

  &:focus {
    box-shadow: 0 0 3px 2px #f5a6a6;
  }
`;
const Dropdown = styled.ul`
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
const DropdownItem = styled.li`
  border-bottom: 1px solid #e4b3b3;

  margin: 0;
  padding: 0.5em 1rem;

  &:hover {
    background-color: #ffb3b3;
    color: #000;
    cursor: pointer;
  }

  &:last-child {
    border-bottom: none;
  }
`;
const DropdownItemButton = styled.button`
  background-color: none;
  color: #a95555;
`;
const MoviePoster = styled.section`
  font-size: 1.5rem;
  padding-top: 2em;
  text-align: center;
`;
const PosterPlaceholder = styled.section``;

// Interfaces
interface Movie {
  imdbID: string;
  Title: string;
  Poster: string;
}

// STATE HANDLING
enum UIStates {
  INITIAL,
  LOADING_RESULTS,
  VIEWING_RESULTS,
  VIEWING_POSTER,
  VIEWING_RESULTS_AND_POSTER,
}

const initSelectedMovie: any = null;

function App(): JSX.Element {
  const [movies, setMovies] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 700);
  const [selectedMovie, setSelectedMovie]: [Movie, any] =
    useState(initSelectedMovie);
  const [UIState, setUIState] = useState(UIStates.INITIAL);
  const [searchUsedForButtonClick, setSearchUsedForButtonClick] = useState('');
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [clearSearchVal, setClearSearchVal] = useState(false);

  const getMovies = async (searchVal: string) => {
    const url = `http://www.omdbapi.com/?s=${searchVal}&apikey=902755be`;

    const response = await fetch(url);
    const responseJson = await response.json();

    if (responseJson.Search) {
      // we should only use the first 10 results
      setMovies(responseJson.Search.slice(0, 10));
      setSearchNotFound(false);
    } else {
      setSearchNotFound(true);
    }
    setUIState(UIStates.VIEWING_RESULTS);
  };

  // HOOKS
  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length <= 1) {
      return;
    }

    setTimeout(() => {
      getMovies(debouncedSearch);
    }, 1000);

    setClearSearchVal(false);
    setUIState(UIStates.LOADING_RESULTS);
  }, [debouncedSearch]);

  useEffect(() => {
    setUIState(UIStates.VIEWING_POSTER);
  }, [selectedMovie]);

  // EVENT HANDLERS
  const handleSearchUpdate = (v: string) => {
    setDebouncedSearch(v);
  };

  const handleSearchButtonClick = (e: any) => {
    e.preventDefault();

    if (debouncedSearch === searchUsedForButtonClick) {
      return;
    }

    getMovies(debouncedSearch);
    setSearchUsedForButtonClick(debouncedSearch);
  };

  const handleSearchItemClick = (e: any) => {
    e.preventDefault();
    const selectedId = e.target.attributes['data-id'].value;
    const selectedMovie = movies.find(
      (movie: any) => movie.imdbID === selectedId,
    );

    setSelectedMovie(selectedMovie);
    setClearSearchVal(true);
  };

  const handleSearchFocus = () => {
    if (isInState(UIStates.VIEWING_POSTER)) {
      setUIState(UIStates.VIEWING_RESULTS);
    }
  };

  // MAIN STATE HANDLING
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

  // RENDERS
  const renderDropdown = () => (
    <FadeIn>
      <Dropdown>
        {searchNotFound && (
          <DropdownItem>
            Not found. Select one below or search again.
          </DropdownItem>
        )}
        {movies.map(({ Title, imdbID }: Movie) => (
          <DropdownItem
            key={imdbID}
            data-id={imdbID}
            onClick={handleSearchItemClick}
          >
            {Title}
          </DropdownItem>
        ))}
      </Dropdown>
    </FadeIn>
  );

  const renderPoster = () => {
    if (selectedMovie.Poster && selectedMovie.Poster !== 'N/A') {
      return <img src={selectedMovie.Poster} alt={selectedMovie.Title} />;
    } else {
      return (
        !isInState(UIStates.VIEWING_RESULTS) && (
          <PosterPlaceholder>
            Sorry, we couldn&apos;t retrieve the poster for this selection.
            Please try another.
          </PosterPlaceholder>
        )
      );
    }
  };

  return (
    <MainWrap>
      <MovieResults>
        <SearchWrap>
          <Search
            clearSearchVal={clearSearchVal}
            handleChange={handleSearchUpdate}
            handleFocus={handleSearchFocus}
          ></Search>
        </SearchWrap>
        <SearchButton onClick={handleSearchButtonClick}>Search</SearchButton>
        {canShowResults() && renderDropdown()}
      </MovieResults>

      <MoviePoster>
        {canShowPoster() ? (
          renderPoster()
        ) : (
          <PosterPlaceholder>
            {isInState(UIStates.LOADING_RESULTS) ? (
              <Spinner />
            ) : (
              'To see its Poster here!'
            )}
          </PosterPlaceholder>
        )}
      </MoviePoster>
    </MainWrap>
  );
}

export default App;
