import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import ApplicationModal from '@cerner/terra-application/lib/application-modal/ApplicationModal';
import classNamesBind from 'classnames/bind';
import InfiniteList, { Item } from 'terra-infinite-list';
import SearchField from 'terra-search-field';
import { ThemeContext } from '@cerner/terra-application/lib/theme';
import Fuse from 'fuse.js';
import StatusView from 'terra-status-view';

import styles from './SearchModal.module.scss';

const cx = classNamesBind.bind(styles);

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

const cacheSearchItems = (siteConfig, state, setState) => {
  if (!state.searchItems) {
    const searchItems = Object.entries(siteConfig.pageConfig).map(([key, value]) => ({
      title: value.text,
      path: key,
      tags: key.split('/').join(' '),
    }));
    const { results, searchString } = state;
    setState({ results, searchString, searchItems });
    handleSearch(searchString, state, setState);
  }
};

const SearchModal = ({siteConfig, onRequestClose}) => {
  const [state, setState] = useState({ results: [] });
  const history = useHistory();
  cacheSearchItems(siteConfig, state, setState);
  const { searchItems, searchString, results } = state;
  const theme = React.useContext(ThemeContext);

  let searchRef = useRef(null);

  useEffect(() => {
    searchRef.focus();
  }, []);

  return (
    <ApplicationModal
      className={cx(theme.className)}
      title="Site Search"
      onRequestClose={onRequestClose}
      toolbar={(
        <SearchField
          className={cx('search-field')}
          isBlock
          placeholder="Search"
          onSearch={string => handleSearch(string, state, setState)}
          onInvalidSearch={() => clearResults(setState)}
          inputRefCallback={(inputRef) => { searchRef = inputRef; }}
        />
      )}
    >
      {searchItems && searchString && results.length <= 0 && <StatusView variant="no-matching-results" />}
      {results.length > 0 && (
        <InfiniteList
          dividerStyle="standard"
          role="listbox"
          ariaLabel="Infinite List"
        >
          {
            state.results.map(result => (
              <Item
                key={result.item.path}
                isSelectable
                metaData={result}
                onSelect={(event, metaData) => {
                  onRequestClose();
                  history.push(metaData.item.path);
                }}
              >
                {searchItem(result)}
              </Item>
            ))
          }
        </InfiniteList>
      )}
    </ApplicationModal>
  );
};

export default SearchModal;
