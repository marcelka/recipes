import {Dispatcher} from 'vlux';
import {recipeStore} from './components/Recipe';

const firebaseStore = (state, action, payload) => {
  switch (action) {
    case 'firebase': {
      state = {...state, ...payload};
      return state;
    }
    default:
      return state;
  }
};

function composeStores(stores) {
  return function(state, action, payload) {
    //console.log('Before action:', state);
    //console.log('Action:', action, 'Payload:', payload);
    var resultState = state;
    for (var i = 0; i < stores.length; i++)
      resultState = stores[i](resultState, action, payload);
    //console.log('After action:', resultState);
    return resultState;
  };
}

const store = composeStores([recipeStore, firebaseStore]);

/*
schema state = {
  recipes: [],
  idGen: idGenGen('prefix'),
  editedRecipe: {
    title: string
    ingredients: [{foodId: id-of-food, amount: num}],
    instructions: string
  },
};
*/

const state = {
  num: 0,
  todos:[],
  recipes: [],
  editedRecipe: {
    title: '',
    ingredients: [],
    instructions: '',
  },
};

export const dispatcher = new Dispatcher(store, state);
