import Login from './login_react'
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios';

export default class UserView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {repairs: [], filter_for_complete: '0', filter_for_start_date_time: ''};
    this.handleLogout = this.handleLogout.bind(this);
    this.handleFilterForCompleteChange = this.handleFilterForCompleteChange.bind(this);
    this.handleFilterForStartDateTimeChange = this.handleFilterForStartDateTimeChange.bind(this);
  }

  handleFilterForStartDateTimeChange(event){
    event.preventDefault();

    this.setState({filter_for_start_date_time: event.target.value});
  }

  handleFilterForCompleteChange(event){
    event.preventDefault();

    this.setState({filter_for_complete: event.target.value});
  }

  handleLogout(event){
    event.preventDefault();

    ReactDOM.render(
      <Login />,
      document.getElementById('content')
    )
  }

  componentWillMount() {
    axios.get( Routes.repairs_path('json', {user_id: this.props.user.id}) )
    .then((response) => {
      var data = response.data;
      this.setState({repairs: data})
    })
  }

  filter_by_completeness(source){
    return source.filter((repair) =>{
      if(this.state.filter_for_complete === '0'){
        return true;
      }
      if(this.state.filter_for_complete === '1'){
        return repair.complete;
      }
      if(this.state.filter_for_complete === '2'){
        return !repair.complete;
      }
    });
  }

  filter_by_start_date_time(source){
    const date_check = new RegExp(this.state.filter_for_start_date_time, 'g');

    return source.filter((repair) =>{
      if(this.state.filter_for_start_date_time === ''){
        return true;
      }else{
        return repair.starts_at && repair.starts_at.match(date_check);
      }
    });
  }

  render() {
    var filtered_by_completeness = this.filter_by_completeness(this.state.repairs);
    var filtered_by_start_date_time = this.filter_by_start_date_time(filtered_by_completeness);

    var content = filtered_by_start_date_time.map((entity) =>
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
              <th>
                Completed
                <select onChange={this.handleFilterForCompleteChange}>
                  <option value='0'>No filter</option>
                  <option value='1'>By Completed</option>
                  <option value='2'>By Uncompleted</option>
                </select>
              </th>
              <th>Approved</th>
              <th>
                Started At
                <input type="text" placeholder="No Filter" value={this.state.filter_for_start_date_time} onChange={this.handleFilterForStartDateTimeChange} />
              </th>
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
    axios({
      method: 'POST',
      url: Routes.comments_path('json'),
      data: {comment: { comment: this.state.comment, repair_id: this.props.entity.id }}
    }).then((response) => {
      var data = response.data;
      this.switchToViewMode(data);
      this.props.onSuccess(data);
    }).catch(function(msg){
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
    this.handleStart = this.handleStart.bind(this);
  }

  handleStart(event){
    event.preventDefault();
    axios({
      method: 'PUT',
      url: Routes.start_repair_path(this.state.id,'json')
    }).then((response) => {
      var data = response.data;
      this.setState( data);
    }).catch(function(msg){
      alert( "Sorry, unauthorized!" );
    });
  }

  handleComplete(event){
    event.preventDefault();

    axios({
      method: 'PATCH',
      url: Routes.repair_path(this.state.id,'json'),
      data: {repair: { complete: true }}
    }).then((response) => {
      var data = response.data;
      this.setState( data);
    }).catch(function(msg){
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

    var completed_vdom = null;
    if(this.state.complete){
      completed_vdom = complete.toString();
    }else{
      if(starts_at){
        completed_vdom = <input type="submit" value="Complete" onClick={this.handleComplete} />
      }else{
        completed_vdom = <input type="submit" value="Start" onClick={this.handleStart} />
      }
    }

    return (
      <tr>
        <td>{name}</td>
        <td>{ completed_vdom }</td>
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
