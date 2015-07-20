import React, {Component, PropTypes} from 'react';
import {Link, RouteHandler} from 'react-router';
import style from './App.css';
import {dispatcher} from '../dispatcher';

export class App extends Component {
  static childContextTypes = {
    disp: PropTypes.object,
  }

  getChildContext() {
    return {
      disp: dispatcher,
    };
  }

  componentDidMount() {
    dispatcher.on('change', () => this.setState({}));
  }

  render() {
    return (
      <div className={style.ahoj}>
        <div>
          <Link to="home">Home</Link>
          <Link to="compose-recipe">Compose recipe</Link>
          <Link to="add-item">Add item</Link>
          <Link to="recipe">Recipe</Link>
        </div>
        <div>
          <RouteHandler />
        </div>
      </div>
    );
  }
}

dispatcher.on('change', () => { console.log('state change'); });
