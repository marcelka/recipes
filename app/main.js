import React from 'react';
import Router from 'react-router';
import {routes} from './routes';
import {firebaseUrl} from '../settings';
import Firebase from 'firebase';
import {dispatcher} from './dispatcher';
import {createActions as createRecipeActions} from './components/Recipe';
import {createActions as createFirebaseActions} from './listenFirebase';


const appElement = document.querySelector('#app');
const firebaseRef = new Firebase(firebaseUrl);
const router = Router.create({routes, location: Router.HistoryLocation});

const actions = {
  ...createRecipeActions(dispatcher, firebaseRef, router),
  ...createFirebaseActions(dispatcher, firebaseRef)
};
var props = {actions, dispatcher};

router.run((Handler) => {
  React.render(<Handler {...props}/>, appElement);
});
