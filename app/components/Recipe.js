import React, {Component} from 'react';
import {FileForm} from './FileForm';
import {getThumbnail, updateIn, join} from './utils';

// Ingredient: id, amount, foodId

// Actions
export function createActions(dispatcher, firebaseRef, router) {
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
    saveRecipe(recipe, recipeId) {
      if (recipeId) {
        firebaseRef.child('recipes').child(recipeId).set(recipe);
      } else {
        var ref = firebaseRef.child('recipes').push(recipe);
        router.transitionTo('edit-recipe', {'recipeId': ref.key()});
      }
    },
    loadRecipe(recipeId) {
      firebaseRef.child('recipes').child(recipeId).once(
        'value',
        function(recipe) {
          if (recipe.val()) {
            var r = recipe.val();
            r.ingredients = r.ingredients || [];
            dispatcher.dispatch('load-recipe', r);
          }
        }
      );
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
        return updateIn(state, join('editedRecipe', path), value);
    case 'load-recipe':
        return {...state, editedRecipe: payload};
    default:
      return state;
  }
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
  renderIngredient(order, foodId, amount) {
    var actions = this.props.actions;
    var options = [];
    var foods = this.props.dispatcher.state.foods;
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

  componentWillMount() {
    var recipeId = this.props.params.recipeId;
    if (recipeId) {
      this.props.actions.loadRecipe(recipeId);
    }
  }

  render() {
    var state = this.props.dispatcher.state;

    // TODO wait for recipe to load
    if (typeof (state.foods) === 'undefined') {
      return <div> Loading... </div>;
    }
    var recipe = state.editedRecipe;
    var recipeId = this.props.params.recipeId;
    var actions = this.props.actions;
    var nutriData = nutritionData(recipe.ingredients, NUTRITION_PROPERTIES, state.foods);

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
        <hr />

        Image: <p />
        <img src={getThumbnail(recipe.image, 'm')} />

        <hr />

        UploadImage: <p />
        <FileForm onUpload = {(image) => actions.updateRecipe('image', image)} />

        <button onClick={(e) => actions.saveRecipe(recipe, recipeId)}> Save this recipe </button>
      </div>
    );
  }
}
