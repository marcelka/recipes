import React, {Component, findDOMNode} from 'react';
import style  from './App.css';
import {Link, RouteHandler} from 'react-router';

export class App extends  Component {
  render() {
    return (
      <div className={style.ahoj}>
        <div>
          <Link to="home">Home</Link>
          <Link to="compose-recipe">Compose recipe</Link>
          <Link to="add-item">Add item</Link>
        </div>
        <div>
          <RouteHandler />
        </div>
      </div>
    );
  }
}
