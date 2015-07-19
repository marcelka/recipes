import React, {Component, findDOMNode, PropTypes} from 'react';
import {Link} from 'react-router';

export class Home extends Component {
    state = {
    counter: 7,
    todos: [],
  };

  handleUpdate() {
    this.setState({counter: this.state.counter + 1});
  }

  decrease() {
    this.setState({counter: this.state.counter - 1});
  }

  addItem() {
    const input = findDOMNode(this.refs.test);
    const {value} = input;
    this.setState({todos: [...this.state.todos, value]});
    input.value = ''
  }

  static contextTypes = {
    disp: React.PropTypes.object.isRequired,
  }

  render() {
    return (
      <div>
        <hr />
        <div>Welcome! What do you want to do?</div>
        <div> <Link to="compose-recipe">Compose recipe</Link> </div>
        <div> <Link to="add-item">Add item</Link> </div>
        <hr />

        <div> {this.context.disp.state.num} </div>
        <button onClick={() => this.context.disp.dispatch('dec', 1)}>-1</button>
        <button onClick={() => this.context.disp.dispatch('inc', 1)}>+1</button>
        <hr />
        <div><input ref="test"/></div>
        <div><button onClick={::this.addItem}>Add item</button></div>
        <ul>
          {this.state.todos.map((item) =>
            <li>{item}</li>)
          }
        </ul>

      </div>
    );
  }
}
