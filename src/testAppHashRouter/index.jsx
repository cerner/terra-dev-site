import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Link } from 'react-router-dom';

class TestApplication extends React.Component {
  static renderRoute({ location }) {
    return (
      <h2>
        {location.pathname}
      </h2>
    );
  }

  render() {
    return (
      <HashRouter>
        <div>
          <h1>Hash Router App</h1>
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
      </HashRouter>
    );
  }
}

ReactDOM.render(<TestApplication />, document.getElementById('hashroot'));
