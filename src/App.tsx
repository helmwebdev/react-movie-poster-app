import { useRef, useState } from 'react';
import Search from './components/Search/Search';
import { useDebounce } from './hooks/debounce.hook';
import Spinner from './components/Spinner/Spinner';
import FadeIn from './components/FadeIn/FadeIn';
import {
  MainWrap,
  MovieResults,
  SearchWrap,
  SearchButton,
  Dropdown,
  DropdownItem,
  DropdownItemNotFound,
  DropdownItemButton,
  PosterPlaceholder,
  MoviePoster,
} from './App.styles';
import { useKeyPress } from './hooks/keypress.hook';
import useDidMountEffect from './hooks/did-mount-effect.hook';

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
const numOfDropdownItems = 10;

function App(): JSX.Element {
  // STATE HOOKS
  const [movies, setMovies] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 700);
  const [selectedMovie, setSelectedMovie]: [Movie, any] =
    useState(initSelectedMovie);
  const [UIState, setUIState] = useState(UIStates.INITIAL);
  const [searchUsedForButtonClick, setSearchUsedForButtonClick] = useState('');
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [clearSearchVal, setClearSearchVal] = useState(false);

  // DOM REFS
  const dropdownRef = useRef();

  // KEYBOARD HOOKS
  const upKeyPressed: boolean = useKeyPress('ArrowUp');
  const downKeyPressed: boolean = useKeyPress('ArrowDown');
  const enterKeyPressed: boolean = useKeyPress('Enter');

  // EFFECT HOOKS
  useDidMountEffect(() => {
    if (!debouncedSearch || debouncedSearch.length <= 1) {
      return;
    }

    setUIState(UIStates.LOADING_RESULTS);

    // Intentional delay to show loading spinner
    setTimeout(() => {
      getMovies(debouncedSearch);
    }, 500);

    setClearSearchVal(false);
    setSelectedMovie(null);
  }, [debouncedSearch]);

  useDidMountEffect(() => {
    if (selectedMovie) {
      setUIState(UIStates.VIEWING_POSTER);
    }
  }, [selectedMovie]);

  // TODO: move to Dropdown component
  useDidMountEffect(() => {
    const dropdown = dropdownRef.current;
    if (!dropdown) {
      return;
    }
    if (upKeyPressed) {
      focusOnItem(dropdown, 'up');
    }
    if (downKeyPressed) {
      focusOnItem(dropdown, 'down');
    }
    if (enterKeyPressed) {
      selectMovieWithEnterKey();
    }
  }, [upKeyPressed, downKeyPressed, enterKeyPressed]);

  // API CALLS
  const getMovies = async (searchVal: string) => {
    const url = `http://www.omdbapi.com/?s=${searchVal}&apikey=902755be`;

    const response = await fetch(url);
    const responseJson = await response.json();

    if (responseJson.Search) {
      // we should only use the first 10 results
      setMovies(responseJson.Search.slice(0, numOfDropdownItems));
      setSearchNotFound(false);
    } else {
      setSearchNotFound(true);
    }
    setUIState(UIStates.VIEWING_RESULTS);
  };

  // DOM MANIPULATION
  // TODO: move these focus functions to Dropdown component
  const focusOnItem = (dropdown: any, key: 'up' | 'down') => {
    const dataIdAttr: any = 'data-id';
    const currentId: number = parseInt(
      document.activeElement?.attributes[dataIdAttr]?.value || '-1',
    );
    if (key === 'up') {
      focusPrevious(dropdown, currentId);
    }
    if (key === 'down') {
      focusNext(dropdown, currentId);
    }
  };

  const focusPrevious = (dropdown: any, currentId: number) => {
    if (currentId === 0) {
      return;
    } else {
      dropdown.querySelector(`[data-id="${currentId - 1}"]`).focus();
    }
  };

  const focusNext = (dropdown: any, currentId: number) => {
    if (currentId === numOfDropdownItems - 1) {
      return;
    } else {
      dropdown.querySelector(`[data-id="${currentId + 1}"]`).focus();
    }
  };

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

  // TODO: move to Dropdown component
  const handleSearchItemClick = (e: any) => {
    e.preventDefault();
    const selectedId = e.target.attributes['data-imdbid'].value;
    selectMoviePoster(selectedId);
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

  // OTHER STATE HANDLING
  // TODO: move to Dropdown component
  // TODO: this named function style should probably be preferred over arrow functions for debugging and maintenance purposes
  function selectMovieWithEnterKey() {
    const dataIdAttr: any = 'data-id';
    const elementDataId: string | undefined =
      document.activeElement?.attributes[dataIdAttr]?.value;
    const imdbIdAttr: any = 'data-imdbid';
    const imdbId: string | undefined =
      document.activeElement?.attributes[imdbIdAttr]?.value;
    if (elementDataId && imdbId) {
      selectMoviePoster(imdbId);
    }
  }

  function selectMoviePoster(selectedId: any) {
    const selectedMovie = movies.find(
      (movie: any) => movie.imdbID === selectedId,
    );

    setSelectedMovie(selectedMovie);
    setClearSearchVal(true);
  }

  // RENDERS
  // TODO: move to Dropdown component
  const renderDropdown = () => (
    <FadeIn>
      <Dropdown ref={dropdownRef}>
        {searchNotFound && (
          <DropdownItem>
            <DropdownItemNotFound>
              Not found. Select one below or search again.
            </DropdownItemNotFound>
          </DropdownItem>
        )}
        {movies.map(({ Title, imdbID }: Movie, index) => (
          <DropdownItem
            key={imdbID}
            data-id={imdbID}
            onClick={handleSearchItemClick}
          >
            <DropdownItemButton
              type="button"
              data-id={index}
              data-imdbid={imdbID}
            >
              {Title}
            </DropdownItemButton>
          </DropdownItem>
        ))}
      </Dropdown>
    </FadeIn>
  );

  const renderPosterPlaceholder = () => {
    return (
      <PosterPlaceholder>
        {isInState(UIStates.LOADING_RESULTS) ? (
          <Spinner />
        ) : (
          seePosterHereText()
        )}
      </PosterPlaceholder>
    );
  };

  const seePosterHereText = () => {
    return isInState(UIStates.VIEWING_RESULTS) ? '' : 'To see its Poster here!';
  };

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
        {/** TODO: remove the search button since it's confusing UX, but was part of
        requirements */}
        <SearchButton type="button" onClick={handleSearchButtonClick}>
          Search
        </SearchButton>
        {canShowResults() && renderDropdown()}
      </MovieResults>

      <MoviePoster>
        {canShowPoster() ? renderPoster() : renderPosterPlaceholder()}
      </MoviePoster>
    </MainWrap>
  );
}

export default App;
