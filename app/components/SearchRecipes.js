import React, {Component} from 'react';

export class SearchRecipes extends Component {

  renderRecipe(foods, recipe) {
    var ingredients = recipe.ingredients || [];
    var rendIng = [];
    for (var ing of ingredients) {
      if (typeof foods[ing.foodId] !== 'undefined' && typeof ing.amount !== 'undefined') {
        rendIng.push(<li> {foods[ing.foodId].name}: {ing.amount} g </li>);
      }
    }
    return (<ul> {rendIng} </ul>);
  }

  render() {
    var rendRec = [];
    var state = this.props.dispatcher.state;
    const recipes = state.recipes;
    const foods = state.foods;
    if ((typeof recipes === 'undefined') || (typeof foods === 'undefined')) {
      return <div> Loading... </div>;
    }
    Object.keys(recipes).forEach((id) => rendRec.push(<li> {recipes[id].title} {this.renderRecipe(foods, recipes[id])} </li>));
    return (
      <div>
        <ul>
          {rendRec}
        </ul>
      </div>
    );
  }
}
