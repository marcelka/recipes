import React, {Component} from 'react';
import {Link} from 'react-router';

export class Home extends Component {
  render() {
    return (
      <div>
        <p />
        <div>Welcome! What do you want to do?</div>
        <div> <Link to="search-recipes">Search Recipes</Link> </div>
        <div> <Link to="compose-recipe">Compose recipe</Link> </div>
        <div> <Link to="add-food">Add Food</Link> </div>
        <div> <Link to="search-foods">Search Foods</Link> </div>
      </div>
    );
  }
}
