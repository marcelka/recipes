import {Dispatcher} from 'vlux';
import {recipeStore} from './components/Recipe';

const countingStore = (state, action, payload) => {
  switch (action) {
    case 'inc':
      return {...state, num: state.num + payload};
    case 'dec':
      return {...state, num: state.num - payload};
    default:
      return state;
  }
};

const todoStore = (state, action, payload) => {
  switch (action) {
    case 'add-item':
      return {...state, todos: [...state.todos, payload]};
    default:
      return state;
  }
};

function composeStores(stores) {
  return function(state, action, payload) {
    console.log('Before action:', state);
    console.log('Action:', action, 'Payload:', payload);
    var resultState = state;
    for (var i = 0; i < stores.length; i++)
      resultState = stores[i](resultState, action, payload);
    console.log('After action:', resultState);
    return resultState;
  };
}

const store = composeStores([countingStore, todoStore, recipeStore]);

const state = {
  num: 0,
  todos:[],
  recipes: [],
  editedRecipe: {
    title: '',
    ingredients: [],
    instructions: '',
    showStats: {
    },
  },
};

export const dispatcher = new Dispatcher(store, state);
