import React, {Component, PropTypes} from 'react';
import {DefaultRoute, NotFoundRoute, Route} from 'react-router';

import {App} from "./components/App"
import {Home} from "./components/Home"
import {AddItem} from "./components/AddItem"
import {ComposeRecipe} from "./components/ComposeRecipe"
import {Dispatcher} from 'vlux';

const countingStore = (state, action, payload) => {
  switch (action) {
    case 'inc':
      return {...state, num: state.num + payload}
    case 'dec':
      return {...state, num: state.num - payload}
    default:
      return state
  }
}


var dispatcher = new Dispatcher(countingStore, {num: 0, todos:[]});

class AppWrapper extends Component {

  static childContextTypes = {
    disp: React.PropTypes.object,
  }

  getChildContext() {
    return {
      disp: dispatcher,
    };
  }

  componentDidMount() {
    dispatcher.on('change', () => this.setState({}));
  }

  render(){
    return (<App />);
  }
}

dispatcher.on('change', ()=>{console.log('state change')});

export const routes = (
  <Route handler={AppWrapper} path="/">
    <DefaultRoute handler={Home} name="home" />
    <Route handler={AddItem} name="add-item" path="add-item"/>
    <Route handler={ComposeRecipe} name="compose-recipe" path="compose-recipe" />
  </Route>
);
