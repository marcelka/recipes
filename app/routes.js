import React from 'react';
import {DefaultRoute, NotFoundRoute, Route} from 'react-router';

import {App} from "./components/App"
import {Home} from "./components/Home"
import {AddItem} from "./components/AddItem"
import {ComposeRecipe} from "./components/ComposeRecipe"

export const routes = (
  <Route handler={App} path="/">
    <DefaultRoute handler={Home} name="home" />
    <Route handler={AddItem} name="add-item" path="add-item"/>
    <Route handler={ComposeRecipe} name="compose-recipe" path="compose-recipe" />
  </Route>
);