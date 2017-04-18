/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import MarkAllTodosMutation from '../mutations/MarkAllTodosMutation';
import Todo from './Todo';

import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';
import RelayClassic from 'react-relay/classic'

class TodoList extends React.Component {
  _handleMarkAllChange = (e) => {
    const complete = e.target.checked;
    RelayClassic.Store.commitUpdate(
      new MarkAllTodosMutation({
        complete,
        todos: this.props.viewer.todos,
        viewer: this.props.viewer,
      })
    );
  };
  renderTodos() {
    return this.props.viewer.todos.edges.map(edge =>
      <Todo
        key={edge.node.id}
        todo={edge.node}
        viewer={this.props.viewer}
      />
    );
  }
  render() {
    const numTodos = this.props.viewer.totalCount;
    const numCompletedTodos = this.props.viewer.completedCount;
    return (
      <section className="main">
        <input
          checked={numTodos === numCompletedTodos}
          className="toggle-all"
          onChange={this._handleMarkAllChange}
          type="checkbox"
        />
        <label htmlFor="toggle-all">
          Mark all as complete
        </label>
        <ul className="todo-list">
          {this.renderTodos()}
        </ul>
      </section>
    );
  }
}

export default createFragmentContainer(TodoList, {
  viewer: graphql`
    fragment TodoList_viewer on User {
      completedCount,
      todos(
        status: $status,
        first: 2147483647  # max GraphQLInt
      ) {
        edges {
          node {
            id,
            ...Todo_todo,
          },
        },
        ...MarkAllTodosMutation_todos,
      },
      totalCount,
      ...MarkAllTodosMutation_viewer,
      ...Todo_viewer,
    }
  `,
});
