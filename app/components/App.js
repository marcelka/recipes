import React, {Component} from 'react';
import {Link, RouteHandler} from 'react-router';
import style from './App.css';

export class App extends Component {
  componentDidMount() {
    this.props.dispatcher.on('change', () => {
      console.log('state change');
      this.setState({});
    });
    this.props.actions.getFoods();
    this.props.actions.getRecipes();
  }

  render() {
    return (
      <div className={style.ahoj}>
        <div>
          <Link to="home">Home</Link>
          <Link to="search-recipes">Search Recipes</Link>
          <Link to="compose-recipe">Compose Recipe</Link>
          <Link to="search-foods">Search Foods</Link>
          <Link to="add-food">Add Food</Link>
        </div>
        <div>
          <RouteHandler {...this.props} />
        </div>
      </div>
    );
  }
}
