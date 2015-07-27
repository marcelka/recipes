import React, {Component} from 'react';
import {FileForm} from './FileForm';
import {getThumbnail, getIn, updateIn, join} from './utils';

// Ingredient: id, amount, foodId
const emptyRecipe = {
  title: '',
  ingredients: [],
  instructions: '',
};

// Schema:
// editedRecipe = {
//   isSaved: bool
//   isNew: bool
//   data: {
//     title: string
//     instructions: string
//     image: undefined or string
//     ingredients: [
//       {
//         foodId: string
//         amount: int
//       }
//     ]
//   }
// }

// Actions
export function createActions(dispatcher, firebaseRef, router) {
  return {
    addEmptyIngredient(recipeId) {
      dispatcher.dispatch('add-empty-ingredient', {recipeId});
    },
    removeIngredient(recipeId, order) {
      dispatcher.dispatch('remove-ingredient', {recipeId, order});
    },
    updateRecipeData(recipeId, path, value) {
      dispatcher.dispatch('update-recipe-data', {recipeId, path, value});
    },
    saveRecipe(recipeId, recipe) {
      if (recipeId) {
        firebaseRef.child('recipes').child(recipeId).set(recipe);
        dispatcher.dispatch('update-recipe', {recipeId, data: {isSaved: true}});
      } else {
        var ref = firebaseRef.child('recipes').push(recipe);
        recipeId = ref.key();
        dispatcher.dispatch('update-recipe', {
          recipeId,
          data: {isNew: true, isSaved: true, data: recipe}
        });
        router.replaceWith('edit-recipe', {recipeId});
      }
    },
    loadRecipe(recipeId) {
      var isNew = false;
      var isSaved = true;

      if (recipeId) {
        firebaseRef.child('recipes').child(recipeId).once(
          'value',
          function(recipe) {
            if (recipe.val()) {
              var r = recipe.val();
              r.ingredients = r.ingredients || [];
              dispatcher.dispatch('update-recipe', {
                recipeId,
                data: {isNew, isSaved, data: r}
              });
            } else {
              router.transitionTo('not-found');
            }
          }
        );
      } else {
        dispatcher.dispatch('update-recipe', {
          recipeId,
          data: {isNew, isSaved, data: {...emptyRecipe}},
        });
      }
    },
  };
}

// Store
export function recipeStore(state, action, payload) {
  if (payload) {
    var recipeId = payload.recipeId;
    var pathToRecipe = recipeId ?
      ['editedRecipes', 'byId', recipeId] : ['editedRecipes', '_new'];
    var pathToIngredients = join(pathToRecipe, ['data', 'ingredients']);
    var ingredients = getIn(state, pathToIngredients);

    var markUnsaved = (s) => updateIn(s, join(pathToRecipe, 'isSaved'), false);
  }

  switch (action) {
    case 'add-empty-ingredient':
      return markUnsaved(
          updateIn(state, pathToIngredients, [...ingredients, {}]));
    case 'remove-ingredient':
      return markUnsaved(updateIn(state, pathToIngredients,
          [...ingredients.filter((i, order) => order !== payload.order)]));
    case 'update-recipe-data':
      var wholePath = join(join(pathToRecipe, 'data'), payload.path);
      return markUnsaved(updateIn(state, wholePath, payload.value));
    case 'update-recipe':
      var s = {...state};
      for (var path of Object.keys(payload.data)) {
        s = updateIn(s, join(pathToRecipe, path), payload.data[path]);
      }
      return s;
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

function getRecipe(state, recipeId) {
  var recipes = state.editedRecipes;
  return recipeId ? recipes.byId[recipeId] : recipes._new;
}

export class Recipe extends Component {

  componentWillReceiveProps(nextProps) {
    var recipeId = nextProps.params.recipeId;
    var recipe = getRecipe(this.props.dispatcher.state, recipeId);
    if (!recipe) {
      this.props.actions.loadRecipe(recipeId);
    }
  }

  renderIngredient(order, foodId, amount) {
    var recipeId = this.props.params.recipeId;
    var actions = this.props.actions;
    var options = [];
    var foods = this.props.dispatcher.state.foods;
    options = Object.keys(foods).map((id) => <option value={id}> {foods[id].name} </option>);
    return (
      <li>
        <input onChange={(e) => actions.updateRecipeData(recipeId, ['ingredients', order, 'amount'], e.target.value)} type='number' value={amount} /> grams of
        <select onChange={(e) => actions.updateRecipeData(recipeId, ['ingredients', order, 'foodId'], e.target.value)} value={foodId}>
          <option> Select food </option>
          {options}
        </select>
        <button onClick={(e) => actions.removeIngredient(recipeId, order)}> Remove from recipe </button>
      </li>
    );
  }

  render() {
    var state = this.props.dispatcher.state;
    var recipeId = this.props.params.recipeId;
    var recipe = getRecipe(state, recipeId);

    if (!recipe) {
      return <div> <p /> Loading... </div>;
    }

    var actions = this.props.actions;
    var nutriData = nutritionData(recipe.data.ingredients, NUTRITION_PROPERTIES, state.foods);

    return (
      <div>
        <p />
        {!recipe.isNew ? '' :
           'Your recipe has been saved. You can edit it later by accessing this url, bookmark it!'
        }

        <p />
        <button disabled={recipe.isSaved} onClick={(e) => actions.saveRecipe(recipeId, recipe.data, recipe.id)}> Save this recipe </button>
        {recipe.isSaved ? '' : 'You have some unsaved chages.'}
        <hr />

        Title:
        <input onChange={(e) => actions.updateRecipeData(recipeId, 'title', e.target.value)} type='text' value={recipe.data.title} />
        <hr />

        Ingredients: <p />
        <button onClick={(e) => actions.addEmptyIngredient(recipeId)}> Add ingredient </button>
        <ul>
          {recipe.data.ingredients.map((ingr, order) => ::this.renderIngredient(order, ingr.foodId, ingr.amount))}
        </ul>
        <hr />

        Nutrition values:
        <ul>
          {nutriData.map((nd) => <li> {nd.displayName}: {nd.value} </li>)}
        </ul>
        <hr />

        Instructions: <p />
        <textarea onChange={(e) => actions.updateRecipeData(recipeId, 'instructions', e.target.value)} value={recipe.data.instructions} />
        <hr />

        Image: <p />
        <img src={getThumbnail(recipe.data.image, 'm')} />

        <hr />

        UploadImage: <p />
        <FileForm onUpload = {(image) => actions.updateRecipeData(recipeId, 'image', image)} />
      </div>
    );
  }
}
