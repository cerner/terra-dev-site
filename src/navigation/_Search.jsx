import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SearchField from 'terra-search-field';
import ContentContainer from 'terra-content-container';
import ActionHeader from 'terra-action-header';
import InfiniteList, { Item } from 'terra-infinite-list';
import { disclosureManagerShape, withDisclosureManager } from 'terra-application/lib/disclosure-manager';
import { withRouter } from 'react-router-dom';
import Fuse from 'fuse.js';
import StatusView from 'terra-status-view';
// eslint-disable-next-line import/no-unresolved, import/extensions
import searchItems from 'build/searchItems';
import classNames from 'classnames/bind';
import styles from './search.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * Injected by disclosure manager
   */
  disclosureManager: disclosureManagerShape.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
};

const clearResults = setState => setState({ results: [] });

const handleSearch = (string, setState) => {
  console.log(string);
  const options = {
    shouldSort: true,
    tokenize: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 2,
    keys: [
      'title',
      'path',
    ],
  };
  const fuse = new Fuse(searchItems, options); // "list" is the item array
  const results = fuse.search(string);
  setState({ results });
  console.log(results);
};

const handleSelect = (metaData, history, disclosureManager) => {
  history.push(metaData.path);
  disclosureManager.closeDisclosure();
};

const ApplicationSwitcher = ({ disclosureManager, history }) => {
  const [state, setState] = useState({ results: [] });

  console.log(state);

  return (
    <ContentContainer
      header={(
        <>
          <ActionHeader
            title="Search"
            onBack={disclosureManager.goBack}
            onClose={disclosureManager.closeDisclosure}
          />
          <SearchField
            className={cx('searchField')}
            isBlock
            onSearch={string => handleSearch(string, setState)}
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
              key={result.path}
              isSelectable
              metaData={result}
              onSelect={(event, metaData) => handleSelect(metaData, history, disclosureManager)}
            >
              <div className={cx('item')}>
                <div className={cx('title')}>
                  {result.title}
                </div>
                <div className={cx('path')}>
                  {result.path}
                </div>
              </div>
            </Item>
          ))
        }
      </InfiniteList>
    </ContentContainer>
  );
};

ApplicationSwitcher.propTypes = propTypes;

export default withRouter(withDisclosureManager(ApplicationSwitcher));
