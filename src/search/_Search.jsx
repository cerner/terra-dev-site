import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SearchField from 'terra-search-field';
import ContentContainer from 'terra-content-container';
import ActionHeader from 'terra-action-header';
import InfiniteList, { Item } from 'terra-infinite-list';
import { disclosureManagerShape, withDisclosureManager } from 'terra-application/lib/disclosure-manager';
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
   * Injected by disclosure manager
   */
  disclosureManager: disclosureManagerShape.isRequired,

  /**
   * item selected callback
   */
  onItemSelected: PropTypes.func.isRequired,
};

const clearResults = setState => setState({ results: [] });

const handleSearch = (string, fetchSearchItems, setState) => {
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
  fetchSearchItems().then((searchItems) => {
    const fuse = new Fuse(searchItems, options); // "list" is the item array
    const results = fuse.search(string);
    setState({ results });
  });
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

const Search = ({ disclosureManager, fetchSearchItems, onItemSelected }) => {
  const [state, setState] = useState({ results: [] });
  return (
    <ContentContainer
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
            onSearch={string => handleSearch(string, fetchSearchItems, setState)}
            onInvalidSearch={() => clearResults(setState)}
          />
        </>
      )}
      fill
    >
      <InfiniteList
        dividerStyle="standard"
        isFinishedLoading={state.results.length > 0}
        initialLoadingIndicator={<StatusView variant="no-matching-results" />}
      >
        {
          state.results.map(result => (
            <Item
              key={result.item.path}
              isSelectable
              metaData={result}
              onSelect={(event, metaData) => handleSelect(metaData, onItemSelected, disclosureManager)}
            >
              {searchItem(result)}
            </Item>
          ))
        }
      </InfiniteList>
    </ContentContainer>
  );
};

Search.propTypes = propTypes;

export default withDisclosureManager(Search);
