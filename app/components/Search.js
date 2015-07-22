import React, {Component} from 'react';

export class Search extends Component {

  state = {recipes: {}}

  renderRecipe(foods, recipe) {
    var ingredients = recipe.ingredients;
    var rendIng = [];
    Object.keys(ingredients).forEach(
      (ingredientId) => {
        rendIng.push(<li> {foods[ingredientId].name}: {ingredients[ingredientId]} g </li>);
      });
    return (<ul> {rendIng} </ul>);
  };

  render() {
    var rendRec = [];
    const recipes = this.props.state.recipes;
    const foods = this.props.state.foods;
    if ((typeof recipes === 'undefined') || (typeof foods === 'undefined')) {
      return <div> Loading </div>;
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
