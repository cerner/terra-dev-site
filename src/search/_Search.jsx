import React from 'react';
import PropTypes from 'prop-types';
import SearchField from 'terra-search-field';
import ContentContainer from 'terra-content-container';
import ActionHeader from 'terra-action-header';
import InfiniteList, { Item } from 'terra-infinite-list';
import { DisclosureManagerContext } from 'terra-application/lib/disclosure-manager';
import Fuse from 'fuse.js';
import StatusView from 'terra-status-view';
import classNames from 'classnames/bind';
import styles from './search.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * Function to fetch items to search.
   */
  fetchSearchItems: PropTypes.func.isRequired,

  /**
   * item selected callback
   */
  onItemSelected: PropTypes.func.isRequired,
};

const ENTER = 13;
const ARROW_UP = 38;
const ARROW_DOWN = 40;
const KEY_END = 35;
const KEY_HOME = 36;

const clearResults = setState => setState({ results: [] });

const handleSearch = (searchString, state, setState) => {
  const options = {
    shouldSort: true,
    tokenize: true,
    includeMatches: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 2,
    keys: [
      'title',
      'tags',
    ],
  };
  const { searchItems } = state;
  if (searchItems) {
    const fuse = new Fuse(searchItems, options); // "list" is the item array
    const results = fuse.search(searchString);
    setState({ results, searchString, searchItems });
  }
};

const handleSelect = (metaData, onItemSelected, disclosureManager) => {
  onItemSelected(metaData.item.path);
  disclosureManager.closeDisclosure();
};

const highlight = (key, result) => {
  // Filter the matches to only ones that match the key
  const valueArray = result.matches.filter(item => item.key === key).map((match) => {
    let startIndex = 0;
    // Split the value string to have spans around the matching indices
    const splitString = match.indices.reduce((acc, index) => {
      acc.push(match.value.slice(startIndex, index[0]));
      acc.push(<span key={index[0]}>{match.value.slice(index[0], index[1] + 1)}</span>);
      startIndex = index[1] + 1;
      return acc;
    }, []);
    splitString.push(match.value.slice(startIndex));
    return splitString;
  });
  // The item has a match that should be highlighted
  if (valueArray.length === 1) {
    return valueArray[0];
  }
  // else return the item
  return result.item[key];
};

const searchItem = result => (
  <div className={cx('item')}>
    <div className={cx('title')}>
      {highlight('title', result)}
    </div>
    <div className={cx('path')}>
      {highlight('path', result)}
    </div>
  </div>
);

const cacheSearchItems = (fetchSearchItems, state, setState) => {
  if (!state.searchItems) {
    fetchSearchItems().then((searchItems) => {
      const { results, searchString } = state;
      setState({ results, searchString, searchItems });
      handleSearch(searchString, state, setState);
    });
  }
};

function isActive(active, result) {
  return active && active.item.path === result.item.path;
}

const Search = ({ fetchSearchItems, onItemSelected }) => {
  const [state, setState] = React.useState({ results: [] });
  cacheSearchItems(fetchSearchItems, state, setState);
  const { searchItems, searchString, results } = state;
  const disclosureManager = React.useContext(DisclosureManagerContext);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const active = results.length > 0 ? results[activeIndex] : null;

  const searchRef = React.useRef(null);
  const activeRef = React.useRef(null);

  // focus on the searchbox onMount
  React.useEffect(() => {
    const { current: search } = searchRef;
    search.focus();
  }, []);

  const handleKeyDown = React.useCallback(event => {
    const { keyCode } = event;

    // only handle key presses when there are results present
    if (results.length === 0) {
      return;
    }

    // Find previous result
    if (keyCode === ARROW_UP) {
      event.preventDefault();
      setActiveIndex(index => Math.max(index - 1, 0));

    // Find next result
    } else if (keyCode === ARROW_DOWN) {
      event.preventDefault();
      setActiveIndex(index => Math.min(index + 1, results.length - 1));

    // Find first result
    } else if (keyCode === KEY_HOME) {
      event.preventDefault();
      setActiveIndex(0);

    // Find last result
    } else if (keyCode === KEY_END) {
      event.preventDefault();
      setActiveIndex(results.length - 1);

    // Select active result
    } else if (keyCode === ENTER) {
      const selection = results[activeIndex];
      handleSelect(selection, onItemSelected, disclosureManager);
    }
  }, [activeIndex, disclosureManager, onItemSelected, results]);

  // scroll to the active result when it changes
  React.useEffect(() => {
    // get ref to list using getElementById since terra-infinite-list doesn't
    // expose the refCallback on the terra-list
    const list = document.getElementById('infinite-search-list');
    const { current: activeResult } = activeRef;

    if (!list || !activeResult) {
      return;
    }

    const listRect = list.parentNode.getBoundingClientRect();
    const activeResultRect = activeResult.parentNode.getBoundingClientRect();

    // determine scroll direction, only scrollIntoView if we're on the bounds
    // of the listbox
    if (activeResultRect.top < listRect.top) {
      activeResult.scrollIntoView();
    } else if (activeResultRect.bottom > listRect.bottom) {
      activeResult.scrollIntoView(false);
    }
  }, [active]);

  return (
    <ContentContainer
      onKeyDown={handleKeyDown}
      header={(
        <>
          <ActionHeader
            title="Site Search"
            onBack={disclosureManager.goBack}
            onClose={disclosureManager.closeDisclosure}
          />
          <SearchField
            className={cx('search-field')}
            isBlock
            placeholder="Search"
            onSearch={string => handleSearch(string, state, setState)}
            onInvalidSearch={() => clearResults(setState)}
            inputRefCallback={(inputRef) => { searchRef.current = inputRef; }}
          />
        </>
      )}
      fill
    >
      {searchItems && searchString && results.length <= 0 && <StatusView variant="no-matching-results" />}
      {results.length > 0 && (
        <InfiniteList
          dividerStyle="standard"
          id="infinite-search-list" // use id for finding DOM node until refCallback is exposed
        >
          {
            state.results.map((result, index) => {
              const isActiveResult = isActive(active, result);

              return (
                <Item
                  className={cx({ 'is-active': isActiveResult })}
                  refCallback={(ref) => { if (isActiveResult) { activeRef.current = ref; } }}
                  key={result.item.path}
                  isSelectable
                  metaData={result}
                  onMouseOver={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onSelect={(event, metaData) => handleSelect(metaData, onItemSelected, disclosureManager)}
                >
                  {searchItem(result)}
                </Item>
              );
            })
          }
        </InfiniteList>
      )}
    </ContentContainer>
  );
};

Search.propTypes = propTypes;

export default Search;
