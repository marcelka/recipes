import React, {Component, PropTypes} from 'react';
import {foods, getFood} from '../food_db';

// Ingredient: id, amount, foodId

// Actions
export function createActions(dispatcher, idGenerator) {
  return {
    addEmptyIngredient() {
      dispatcher.dispatch('add-empty-ingredient', idGenerator());
    },
    removeIngredient(id) {
      dispatcher.dispatch('remove-ingredient', id);
    },
    updateRecipe(data) {
      dispatcher.dispatch('update-recipe', data);
    },
    updateIngredient(id, data) {
      dispatcher.dispatch('update-ingredient', {id, data});
    },
  };
}

// Store
export function recipeStore(state, action, payload) {
  var recipe = state.editedRecipe;
  switch (action) {
    case 'add-empty-ingredient':
        return {
          ...state,
          editedRecipe: {
            ...recipe,
            ingredients: [...recipe.ingredients, {id: payload}],
          }
        };
    case 'remove-ingredient':
        return {
          ...state,
          editedRecipe: {
            ...recipe,
            ingredients: recipe.ingredients.filter((i) => i.id !== payload),
          }
        };
    case 'update-recipe':
        return {
          ...state,
          editedRecipe: {...recipe, ...payload},
        };
    case 'update-ingredient':
        var newIngredients = [];
        for (var i = 0; i < recipe.ingredients.length; i++) {
          var ingredient = recipe.ingredients[i];
          if (ingredient.id === payload.id)
            newIngredients.push({...ingredient, ...payload.data});
          else
            newIngredients.push(ingredient);
        }
        return {
          ...state,
          editedRecipe: {
            ...recipe, ingredients: newIngredients,
          }
        };
    default:
      return state;
  }
}

function calculateProperty(ingredients, property) {
  return ingredients.reduce(function(total, ingredient) {
    var food = getFood(ingredient.foodId);
    if (food && food[property] && ingredient.amount)
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
    var actions = this.props.actions;
    var options = [];
    for (var food of foods)
      options.push(<option value={food[0]}> {food[1].name} </option>);
    return (
      <li data-ingredientid={id}>
        <input onChange={(e) => actions.updateIngredient(id, {'amount': e.target.value})} type='number' value={amount} /> grams of
        <select onChange={(e) => actions.updateIngredient(id, {'foodId': e.target.value})} value={foodId}>
          <option> Select food </option>
          {options}
        </select>
        <button onClick={(e) => actions.removeIngredient(id)}> Remove from recipe </button>
      </li>
    );
  }

  render() {
    var recipe = this.props.state.editedRecipe;
    var actions = this.props.actions;
    var nutriData = nutritionData(recipe.ingredients, NUTRITION_PROPERTIES);

    return (
      <div>
        <p />

        Title:
        <input onChange={(e) => actions.updateRecipe({'title': e.target.value})} type='text' value={recipe.title} />
        <hr />

        Ingredients: <p />
        <button onClick={(e) => actions.addEmptyIngredient()}> Add ingredient </button>
        <ul>
          {recipe.ingredients.map((i) => ::this.renderIngredient(i.id, i.foodId, i.amount))}
        </ul>
        <hr />

        Nutrition values:
        <ul>
          {nutriData.map((nd) => <li> {nd.displayName}: {nd.value} </li>)}
        </ul>
        <hr />

        Instructions: <p />
        <textArea onChange={(e) => actions.updateRecipe({'instructions': e.target.value})} value={recipe.instructions} />
      </div>
    );
  }
}
