import React, {Component, findDOMNode, PropTypes} from 'react';
import {foods, getFood} from '../food_db';

export function recipeStore(state, action, payload) {
  var idGen = state.idGen;
  var recipe = state.editedRecipe;
  switch (action) {
    case 'add-empty-ingredient':
        return {
          ...state,
          editedRecipe: addEmptyIngredient(recipe, idGen),
        };
    case 'remove-ingredient':
        return {
          ...state,
          editedRecipe: removeIngredient(recipe, payload),
        };
    case 'update-recipe':
        return {
          ...state,
          editedRecipe: {...recipe, ...payload},
        };
    default:
      return state;
  }
}

function addEmptyIngredient(recipe, idGen) {
  var ingredient = {
    id: idGen(),
    // amount: 0,
    // foodId: undefined,
  };
  return {
    ...recipe,
    ingredients: [...recipe.ingredients, ingredient],
  };
}

function removeIngredient(recipe, id) {
  return {
    ...recipe,
    ingredients: recipe.ingredients.filter((i) => i.id !== id),
  };
}

function calculateProperty(ingredients, property) {
  return ingredients.reduce(function(total, ingredient) {
    var food = getFood(ingredient.foodId);
    if (food && food[property])
      return total + ingredient.amount * food[property];
    return total;
  }, 0);
}

const NUTRITION_PROPERTIES = [
  {name: 'kj', displayName: 'Energy'},
  {name: 'protein', displayName: 'Protein'},
  {name: 'fiber', displayName: 'Fiber'},
];

function nutritionData(ingredients, properties) {
  var nd = [];
  for (var i = 0; i < properties.length; i++)
    nd.push({
      ...properties[i],
      value: calculateProperty(ingredients, properties[i].name),
    });
  return nd;
}

export class Recipe extends Component {
  static contextTypes = {
    disp: PropTypes.object.isRequired,
  }

  renderIngredient(id, foodId, amount) {
    var options = [];
    for (var food of foods)
      options.push(<option value={food[0]}> {food[1].name} </option>);
    return (
      <li data-ingredientid={id}>
        <input onChange={::this.handleUpdate} ref={'ingredientAmount-' + id} type='number' value={amount} /> grams of
        <select onChange={::this.handleUpdate} ref={'ingredientFoodId-' + id} value={foodId}>
          {options}
        </select>
        <button onClick={::this.removeIngredientFactory(this, id)}> Remove from recipe </button>
      </li>
    );
  }

  handleUpdate(e) {
    var title = findDOMNode(this.refs.title);
    var instructions = findDOMNode(this.refs.instructions);
    var ingredientNodes = findDOMNode(this.refs.ingredients).children;
    var ingredients = [];
    for (var i = 0; i < ingredientNodes.length; i++) {
      var id = ingredientNodes[i].dataset.ingredientid;
      ingredients.push({
        id: id,
        amount: findDOMNode(this.refs['ingredientAmount-' + id]).value,
        foodId: findDOMNode(this.refs['ingredientFoodId-' + id]).value,
      });
    }
    this.context.disp.dispatch('update-recipe', {
      'title': title.value,
      'instructions': instructions.value,
      'ingredients': ingredients,
    });
  }

  addIngredient(e) {
    this.context.disp.dispatch('add-empty-ingredient');
  }

  removeIngredientFactory(_this, id) {
    return function(e) { _this.context.disp.dispatch('remove-ingredient', id); };
  }

  removeIngredient(e) {
    this.context.disp.dispatch('remove-ingredient');
  }

  render() {
    var recipe = this.context.disp.state.editedRecipe;
    var nutriData = nutritionData(recipe.ingredients, NUTRITION_PROPERTIES);
    return (
      <div>
        <p />

        Title:
        <input onChange={::this.handleUpdate} ref='title' type='text' value={recipe.title} />
        <hr />

        Ingredients: <p />
        <button onClick={::this.addIngredient}> Add ingredient </button>
        <ul ref='ingredients'>
          {recipe.ingredients.map((i) => ::this.renderIngredient(i.id, i.foodId, i.amount))}
        </ul>
        <hr />

        Nutrition values:
        <ul>
          {nutriData.map((nd) => <li> {nd.displayName}: {nd.value} </li>)}
        </ul>
        <hr />

        Instructions: <p />
        <textArea onChange={::this.handleUpdate} ref='instructions' value={recipe.instructions} />
      </div>
    );
  }
}
