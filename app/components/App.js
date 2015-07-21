import React, {Component, PropTypes} from 'react';
import {Link, RouteHandler} from 'react-router';
import style from './App.css';
import {dispatcher} from '../dispatcher';
import {createActions} from './Recipe';


function idGenGen(prefix) {
  var n = 0;
  return function() {n++; return prefix + n; };
}
var idGenerator = idGenGen('prefix-');

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
    var actions = {...createActions(dispatcher, idGenerator)};
    var state = dispatcher.state;
    var props = {dispatcher, idGenerator, actions, state};

    return (
      <div className={style.ahoj}>
        <div>
          <Link to="home">Home</Link>
          <Link to="compose-recipe">Compose recipe</Link>
          <Link to="add-item">Add item</Link>
          <Link to="recipe">Recipe</Link>
        </div>
        <div>
          <RouteHandler {...props} />
        </div>
      </div>
    );
  }
}

dispatcher.on('change', () => { console.log('state change'); });
