import React, {Component, PropTypes} from 'react';

// Ingredient: id, amount, foodId

// Actions
export function createActions(dispatcher, idGenerator) {
  return {
    addEmptyIngredient() {
      dispatcher.dispatch('add-empty-ingredient');
    },
    removeIngredient(id) {
      dispatcher.dispatch('remove-ingredient', id);
    },
    updateRecipe(path, value) {
      dispatcher.dispatch('update-recipe', {path, value});
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
            ingredients: [...recipe.ingredients, {}],
          }
        };
    case 'remove-ingredient':
        return {
          ...state,
          editedRecipe: {
            ...recipe,
            ingredients: recipe.ingredients.filter((i, order) => order !== payload),
          }
        };
    case 'update-recipe':
        var {path, value} = payload;
        return updated(state, join('editedRecipe', path), value);
    default:
      return state;
  }
}

function pathify(path) {
  if (typeof path === 'string' || typeof path === 'number')
    return [path];
  return path;
}

function join(path1, path2) {
  return [...pathify(path1), ...pathify(path2)];
}

function updated(obj, path, value) {
  path = pathify(path);
  var key = path[0];
  var result;
  if (typeof key === 'string') result = {...obj};
  if (typeof key === 'number') result = [...obj];
  if (path.length === 1)
    result[key] = value;
  else
    result[key] = updated(result[key], path.slice(1), value);
  return result;
}

function calculateProperty(ingredients, property, foods) {
  return ingredients.reduce((total, ingredient) => {
    var food = foods[ingredient.foodId];
    if (food && food[property] && ingredient.amount)
      return total + ingredient.amount * food[property];
    return total;
  }, 0);
}

function nutritionData(ingredients, properties, foods) {
  var nd = [];
  for (var i = 0; i < properties.length; i++)
    nd.push({
      ...properties[i],
      value: calculateProperty(ingredients, properties[i].name, foods),
    });
  return nd;
}

const NUTRITION_PROPERTIES = [
  {name: 'kj', displayName: 'Energy'},
  {name: 'protein', displayName: 'Protein'},
  {name: 'fiber', displayName: 'Fiber'},
];


export class Recipe extends Component {
  static contextTypes = {
    disp: PropTypes.object.isRequired,
  }

  renderIngredient(order, foodId, amount) {
    var actions = this.props.actions;
    var options = [];
    var foods = this.props.state.foods;
    options = Object.keys(foods).map((id) => <option value={id}> {foods[id].name} </option>);
    return (
      <li>
        <input onChange={(e) => actions.updateRecipe(['ingredients', order, 'amount'], e.target.value)} type='number' value={amount} /> grams of
        <select onChange={(e) => actions.updateRecipe(['ingredients', order, 'foodId'], e.target.value)} value={foodId}>
          <option> Select food </option>
          {options}
        </select>
        <button onClick={(e) => actions.removeIngredient(order)}> Remove from recipe </button>
      </li>
    );
  }

  render() {
    if (typeof (this.props.state.foods) === 'undefined') {
      return <div> loading... </div>;
    }
    var recipe = this.props.state.editedRecipe;
    var actions = this.props.actions;
    var nutriData = nutritionData(recipe.ingredients, NUTRITION_PROPERTIES, this.props.state.foods);

    return (
      <div>
        <p />

        Title:
        <input onChange={(e) => actions.updateRecipe('title', e.target.value)} type='text' value={recipe.title} />
        <hr />

        Ingredients: <p />
        <button onClick={(e) => actions.addEmptyIngredient()}> Add ingredient </button>
        <ul>
          {recipe.ingredients.map((ingr, order) => ::this.renderIngredient(order, ingr.foodId, ingr.amount))}
        </ul>
        <hr />

        Nutrition values:
        <ul>
          {nutriData.map((nd) => <li> {nd.displayName}: {nd.value} </li>)}
        </ul>
        <hr />

        Instructions: <p />
        <textArea onChange={(e) => actions.updateRecipe('instructions', e.target.value)} value={recipe.instructions} />
      </div>
    );
  }
}
