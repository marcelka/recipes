import React from 'react';
import {DefaultRoute, Route} from 'react-router';

import {App} from './components/App';
import {Home} from './components/Home';
import {Food} from './components/Food';
import {Recipe} from './components/Recipe';
import {SearchFoods} from './components/SearchFoods';
import {SearchRecipes} from './components/SearchRecipes';

export const routes = (
  <Route handler={App} path="/">
    <DefaultRoute handler={Home} name="home" />
    <Route handler={Food} name="add-food" path="/add-food"/>
    <Route handler={Food} name="edit-food" path="/edit-food/:foodId" />
    <Route handler={SearchFoods} name="search-foods" path="/search-foods"/>
    <Route handler={Recipe} name="compose-recipe" path="/compose-recipe" />
    <Route handler={Recipe} name="edit-recipe" path="/edit-recipe/:recipeId" />
    <Route handler={SearchRecipes} name="search-recipes" path="/search-recipes" />
  </Route>
);
