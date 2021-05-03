import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { KEY_ESCAPE } from 'keycode-js';
import IconLeftPane from 'terra-icon/lib/icon/IconLeftPane';
import { ActiveBreakpointContext } from '@cerner/terra-application/lib/breakpoints';
import SkipToButton from '@cerner/terra-application/lib/application-container/private/skip-to/SkipToButton';
import MainPageContainer from '@cerner/terra-application/lib/page/MainPageContainer';
import { useDismissTransientPresentationsEffect } from '@cerner/terra-application/lib/utils/transient-presentations';
import { deferExecution } from '@cerner/terra-application/lib/utils/lifecycle-utils';
import usePortalManager from '@cerner/terra-application/lib/shared/usePortalManager';

import LayoutActionsContext from '@cerner/terra-application/lib/layouts/shared/LayoutActionsContext';
import NavigationItem from '@cerner/terra-application/lib/layouts/shared/NavigationItem';

import SecondaryNavigationGroup from './SecondaryNavigationGroup';
import CollapsingNavigationMenu from './side-nav/CollapsingNavigationMenu';
import SideNavHeader from './side-nav/SideNavHeader';

import styles from './SecondaryNavigationLayout.module.scss';

const cx = classNames.bind(styles);

const sideNavOverlayBreakpoints = ['tiny', 'small', 'medium'];

const propTypes = {
  /**
   * A string id used to uniquely identify the SecondaryNavigationLayout and its
   * components in the DOM.
   */
  id: PropTypes.string.isRequired,

  /**
   * A string applied to the side bar as a label.
   */
  label: PropTypes.string.isRequired,

  /**
   * A string key representing the currently active navigation item. This value
   * must correspond to a NavigationItem provided as a child to the layout.
   *
   * If no matching value exists, the `renderNavigationFallback` prop will be
   * executed to determine the rendered content. If no NavigationItem children
   * are expected to be provided, this prop should be left undefined.
   */
  activeNavigationKey: PropTypes.string.isRequired,

  /**
   * A function to be executed upon the selection of a navigation item.
   * Ex: `onSelectNavigationItem(String selectedItemKey, Object metaData)`
   */
  onSelectNavigationItem: PropTypes.function,

  /**
   * A function used to render a single page component within the body of
   * the SecondaryNavigationLayout.
   *
   * This prop should be used only when secondary navigation is not required for
   * the consuming application. If navigation capabilities are required,
   * NavigationItem children must be used instead.
   */
  renderPage: PropTypes.func,

  /**
   * A function used to render a single layout component within the body of
   * the SecondaryNavigationLayout.
   *
   * This prop should be used only when secondary navigation is not required for
   * the consuming application. If navigation capabilities are required,
   * NavigationItem children must be used instead.
   */
  renderLayout: PropTypes.function,

  /**
   * A function used to render a fallback component when the provided
   * activeNavigationKey does not correspond to a provided NavigationItem child.
   *
   * If no NavigationItem children are provided, this prop is ignored.
   */
  renderNavigationFallback: PropTypes.function,

  /**
   * A collection of child components to render within the layout body.
   *
   * Providing a NavigationItem component as a direct child will result in a
   * navigation entry being added to the SecondaryNavigationLayout side bar. Any
   * non-NavigationItem children provided alongside NavigationItem children will
   * **not** be rendered.
   *
   * If another layout is to be rendered within this layout, it is recommended
   * to use the `renderLayout` prop instead. If the renderLayout prop is
   * provided, children will be ignored, regardless of its contents.
   */
  children: PropTypes.node,
};

function mapChildItem(item) {
  return {
    text: item.label,
    name: item.label,
    path: item.key,
    childItems: item.childItems ? item.childItems.map(mapChildItem) : undefined,
  };
}

const SecondaryNavigationLayout = ({
  id,
  label,
  activeNavigationKey,
  children,
  onSelectNavigationItem,
  renderPage,
  renderLayout,
  renderNavigationFallback,
}) => {
  const activeBreakpoint = React.useContext(ActiveBreakpointContext);
  const parentLayoutActions = React.useContext(LayoutActionsContext);

  const pageContainerRef = React.useRef();
  const sideNavBodyRef = React.useRef();
  const sideNavPanelRef = React.useRef();
  const resizeOverlayRef = React.useRef();

  const [contentElementRef, pageContainerPortalsRef] = usePortalManager(activeNavigationKey, () => {
    deferExecution(() => {
      document.body.focus();
    });
  });

  const [sideNavOverlayIsVisible, setSideNavOverlayIsVisible] = React.useState(false);

  function getNavigationItems(childComponents) {
    return React.Children.toArray(childComponents).reduce((accumulator, child) => {
      const items = [...accumulator];

      if (child.type === NavigationItem) {
        items.push(child);
      } else if (child.type === SecondaryNavigationGroup) {
        const groupItems = getNavigationItems(child.props.children);
        if (groupItems) {
          items.push(...groupItems);
        }
      }

      return items;
    }, []);
  }

  const navigationItems = getNavigationItems(children);
  const hasActiveNavigationItem = !!navigationItems.find(item => item.props.navigationKey === activeNavigationKey);

  const hasSidebar = !!navigationItems.length;
  const hasOverlaySidebar = sideNavOverlayBreakpoints.indexOf(activeBreakpoint) !== -1;
  const sideNavIsVisible = hasSidebar && (sideNavOverlayIsVisible || sideNavOverlayBreakpoints.indexOf(activeBreakpoint) === -1);

  const layoutActionsContextValue = React.useMemo(() => {
    let newStartActions = parentLayoutActions.startActions;

    if (hasSidebar && hasOverlaySidebar) {
      newStartActions = [...newStartActions, {
        key: 'secondary-navigation-layout-toggle-navigation-panel',
        label: `Toggle Navigation Panel ${sideNavOverlayIsVisible ? 'Closed' : 'Open'}`, // TODO intl and verify a11y
        icon: IconLeftPane,
        onSelect: () => {
          setSideNavOverlayIsVisible((state) => !state);
        },
      }];
    }

    return ({
      startActions: newStartActions,
      endActions: parentLayoutActions.endActions,
    });
  }, [parentLayoutActions.startActions, parentLayoutActions.endActions, hasSidebar, hasOverlaySidebar, sideNavOverlayIsVisible]);

  useDismissTransientPresentationsEffect(() => {
    if (hasOverlaySidebar) {
      setSideNavOverlayIsVisible(false);
    }
  });

  React.useEffect(() => {
    const navigationItemKeys = navigationItems.map(item => item.props.navigationKey);
    // Cleanup nodes for removed children
    const danglingPortalKeys = Object.keys(pageContainerPortalsRef.current).filter((itemKey) => !navigationItemKeys.includes(itemKey));
    danglingPortalKeys.forEach((pageKey) => {
      delete pageContainerPortalsRef.current[pageKey];
    });
  }, [navigationItems, pageContainerPortalsRef]);

  const lastNavigationPanelOpenState = React.useRef(sideNavOverlayIsVisible);
  React.useEffect(() => {
    if (sideNavOverlayIsVisible && !lastNavigationPanelOpenState.current) {
      deferExecution(() => { sideNavPanelRef.current.focus(); });
    } else if (!sideNavOverlayIsVisible && lastNavigationPanelOpenState.current) {
      deferExecution(() => {
        const mainElement = document.querySelector('main');
        if (mainElement) {
          mainElement.focus();
        }
      });
    }

    lastNavigationPanelOpenState.current = sideNavOverlayIsVisible;
  }, [sideNavOverlayIsVisible]);

  React.useEffect(() => {
    if (!sideNavOverlayIsVisible) {
      return undefined;
    }

    function handleKeydown(e) {
      if (e.keyCode === KEY_ESCAPE) {
        if (e.target === pageContainerRef.current || pageContainerRef.current.contains(e.target)) {
          setSideNavOverlayIsVisible(false);
        }
      }
    }

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [sideNavOverlayIsVisible, setSideNavOverlayIsVisible]);

  function activatePage(pageKey) {
    setSideNavOverlayIsVisible(false);

    if (pageKey === activeNavigationKey) {
      return;
    }

    onSelectNavigationItem(pageKey);
  }

  function renderNavigationItems() {
    return navigationItems.map((item) => {
      let portalElement = pageContainerPortalsRef.current[item.props.navigationKey]?.element;
      if (!portalElement) {
        portalElement = document.createElement('div');
        portalElement.style.position = 'relative';
        portalElement.style.height = '100%';
        portalElement.style.width = '100%';
        portalElement.id = `side-nav-${item.props.navigationKey}`;
        pageContainerPortalsRef.current[item.props.navigationKey] = {
          element: portalElement,
        };
      }

      /**
       * The cloned element is wrapped in a keyed fragment to ensure the render order of
       * the mapped items.
       */
      return (
        <React.Fragment key={item.props.navigationKey}>
          {React.cloneElement(item, {
            isActive: item.props.navigationKey === activeNavigationKey, portalElement,
          })}
        </React.Fragment>
      );
    });
  }

  function buildSideNavItems(childComponents) {
    return React.Children.map(childComponents, (child) => {
      if (child.type === NavigationItem) {
        return { key: child.props.navigationKey, label: child.props.label };
      }

      if (child.type === SecondaryNavigationGroup) {
        return { key: child.props.label, label: child.props.label, childItems: buildSideNavItems(child.props.children) };
      }

      return null;
    });
  }

  let content;
  if (renderPage) {
    content = (
      <MainPageContainer>
        {renderPage()}
      </MainPageContainer>
    );
  } else if (renderLayout) {
    content = renderLayout();
  } else if (navigationItems.length) {
    content = (
      <>
        {renderNavigationItems()}
        {!hasActiveNavigationItem && renderNavigationFallback ? renderNavigationFallback() : undefined}
      </>
    );
  } else {
    content = children;
  }

  return (
    <>
      {hasSidebar && (
        <SkipToButton
          description="Side Navigation"
          onSelect={() => {
            if (hasOverlaySidebar) {
              setSideNavOverlayIsVisible(true);
            } else {
              deferExecution(() => {
                sideNavPanelRef.current.focus();
              });
            }
          }}
        />
      )}
      <div
        className={cx('side-nav-container')}
        ref={pageContainerRef}
      >
        <div
          ref={resizeOverlayRef}
          className={cx('.side-nav-resize-overlay')}
        />
        <div
          ref={sideNavPanelRef}
          className={cx('side-nav-sidebar', { visible: hasSidebar && sideNavIsVisible, overlay: hasOverlaySidebar })}
          tabIndex="-1"
        >
          {hasSidebar && (
            <div className={cx('sidebar-container')}>
              <div className={cx('header-container')}>
                <SideNavHeader
                  label={label}
                  onRequestClose={sideNavOverlayIsVisible ? () => {
                    setSideNavOverlayIsVisible(false);
                  } : undefined}
                />
              </div>
              <div className={cx('content')}>
                <CollapsingNavigationMenu
                  id={`${id}-side-nav`}
                  selectedPath={activeNavigationKey}
                  onSelect={(key) => { activatePage(key); }}
                  menuItems={[{
                    childItems: buildSideNavItems(children).map(mapChildItem),
                  }]}
                />
              </div>
            </div>
          )}
        </div>
        <div ref={sideNavBodyRef} className={cx('side-nav-body')}>
          <div
            ref={contentElementRef}
            className={cx('page-body')}
            inert={sideNavOverlayIsVisible ? 'true' : null}
          >
            <LayoutActionsContext.Provider value={layoutActionsContextValue}>
              {content}
            </LayoutActionsContext.Provider>
          </div>
        </div>
      </div>
    </>
  );
};

SecondaryNavigationLayout.propTypes = propTypes;

export default SecondaryNavigationLayout;
