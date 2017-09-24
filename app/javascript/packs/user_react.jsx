import Login from './login_react'
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

export default class UserView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {repairs: []};
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(event){
    event.preventDefault();

    ReactDOM.render(
      <Login />,
      document.getElementById('content')
    )
  }

  componentWillMount() {
    $.ajax({ url: Routes.repairs_path('json', {user_id: this.props.user.id})}).done((msg)=>{
        this.setState({repairs: msg})
      });
  }

  render() {
    var content = this.state.repairs.map((entity) =>
      <Repair key={entity.id} entity={entity} />
    );

    return (
      <div>
        Hey! welcome simple user: {this.props.user.name}
        <a href='#' onClick={this.handleLogout}>Logout</a>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Completed</th>
              <th>Approved</th>
              <th>Started At</th>
              <th>Comments</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {content}
          </tbody>
        </table>
      </div>
    );
  }
}

class AddNewComment extends React.Component{
  constructor(props) {
    super(props);

    this.state = { editMode: false, comment: '' };
    this.handleSwitchToEditMode = this.handleSwitchToEditMode.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleSwitchToEditMode(){
    this.setState({ editMode: true });
  }

  handleCancel(){
    this.switchToViewMode();
  }

  switchToViewMode(){
    this.setState({ editMode: false });
  }

  handleCommentChange(event){
    this.setState({ comment: event.target.value });
  }

  handleSubmit(){
    $.ajax({
      method: 'POST',
      url: Routes.comments_path('json'),
      data: {comment: { comment: this.state.comment, repair_id: this.props.entity.id }}
    }).done(( msg ) => {
      this.switchToViewMode(msg);
      this.props.onSuccess(msg);
    }).fail(function(msd){
      alert( "Sorry, unauthorized!" );
    });
  }

  render() {
    const { editMode } = this.state;

    if (editMode) {
      return this.renderForm();
    } else {
      return this.renderViewMode();
    }
  }

  renderForm() {
    return (
      <div>
        <input type="text" placeholder="Add New Comment Here" value={this.state.comment} onChange={this.handleCommentChange} />
        <button onClick={this.handleSubmit}>Save Comment</button>
        <button onClick={this.handleCancel}>Cancel</button>
      </div>
    );
  }

  renderViewMode(){
    return (
      <div>
        <button onClick={this.handleSwitchToEditMode}>Add New Comment</button>
      </div>
    );
  }
}

class Repair extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.props.entity;

    this.handleCommentAdded = this.handleCommentAdded.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
  }

  handleComplete(event){
    event.preventDefault();

    $.ajax({
      method: 'PATCH',
      url: Routes.repair_path(this.state.id,'json'),
      data: {repair: { complete: true }}
    }).done(( msg ) => {
      this.setState( msg);
    }).fail(function(msd){
      alert( "Sorry, unauthorized!" );
    });
  }

  handleCommentAdded(comment){
    var repair = this.state;
    repair.comments.push(comment);
    this.setState({repair: repair});
  }

  render() {
    const {name, approved, complete, starts_at, comments } = this.state;

    const comment_vdom = comments.map((entity) =>
      <li key={entity.id}>{entity.comment}</li>
    );

    return (
      <tr>
        <td>{name}</td>
        <td>{ this.state.complete ? complete.toString() : <input type="submit" value="Complete" onClick={this.handleComplete} /> }</td>
        <td>{approved.toString()}</td>
        <td>{starts_at}</td>
        <td>
          <ul>
            {comment_vdom}
            <AddNewComment entity={this.state} onSuccess={this.handleCommentAdded}/>
          </ul>
        </td>
        <td>
          
        </td>
      </tr>
    );
  }
}
