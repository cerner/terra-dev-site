/* global BASENAME */
// BASENAME is defined by webpack
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';

class TestApplication extends React.Component {
  static renderRoute({ location }) {
    return (
      <h2>
        {location.pathname}
      </h2>
    );
  }

  render() {
    console.log(BASENAME);
    return (
      // BASENAME is expected to be '' or '/*'
      <BrowserRouter basename={BASENAME}>
        <div>
          <h1>Browser Router App</h1>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/topics">Topics</Link>
            </li>
          </ul>

          <Route render={TestApplication.renderRoute} />
        </div>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<TestApplication />, document.getElementById('root'));
