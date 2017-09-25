import Login from './login_react'
import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';

export default class AdminView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {show_repairs: true};

    this.handleSwitchToRepairs = this.handleSwitchToRepairs.bind(this);
    this.handleSwitchToUsers = this.handleSwitchToUsers.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(event){
    event.preventDefault();

    ReactDOM.render(
      <Login />,
      document.getElementById('content')
    )
  }

  handleSwitchToRepairs(){
    this.setState({show_repairs: true});
  }

  handleSwitchToUsers(){
    this.setState({show_repairs: false});
  }

  render() {
    var content = this.state.show_repairs ? <Repairs onSwitchToUsers={this.handleSwitchToUsers}/> : <Users onSwitchToRepairs={this.handleSwitchToRepairs}/>;

    return (
      <div >
        <p>
          Hey! welcome admin: {this.props.user.name}
        </p>
        <a href='#' onClick={this.handleLogout}>Logout</a>
        <div>
          {content}
        </div>
      </div>
    );
  }
}

class RepairForm extends React.Component{
  constructor(props) {
    super(props);

    this.state = this.props.entity;

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCompletedChange = this.handleCompletedChange.bind(this);
    this.handleApprovedChange = this.handleApprovedChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(){
    event.preventDefault();

    axios.delete( Routes.repair_path(this.state.id,'json')
      ).then((response) => {
        var data = response.data;
        this.props.onDelete(this.state.id);
      }).catch(error => {
        alert( "Sorry, unauthorized!" );
    });
  }

  handleCancel(){
    event.preventDefault();
    const entity = (this.state.id) ? this.props.entity : this.state;

    this.props.switchToViewMode(entity);
  }

  handleSubmit(event){
    event.preventDefault();

    const url = (this.state.id) ? Routes.repair_path(this.state.id,'json') : Routes.repairs_path('json');
    const method = (this.state.id) ? 'PATCH' : 'POST';

    axios({
      method: method,
      url: url,
      data: {repair: { name: this.state.name, complete: this.state.complete, approved: this.state.approved, user_id: this.state.user_id }}
    }).then((response) => {
      var data = response.data;
      this.props.switchToViewMode(data);
    }).catch(function(msg){
      alert( "Sorry, unauthorized!" );
    });
  }

  handleUserChange(event){
    var value = event.target.value === 'null' ? null : parseInt(event.target.value);
    this.setState({user_id: value});
  }

  handleNameChange(event){
    this.setState({name: event.target.value});
  }

  handleCompletedChange(event){
    const target = event.target;
    const value = target.checked;
    this.setState({complete: value});
    if(!value){
      this.setState({approved: false});
    }
  }

  handleApprovedChange(event){
    this.setState({approved: event.target.checked});
  }

  render(){
    const { complete, approved, name, user_id } = this.state;

    var options_for_user = this.props.users.map((user) =>
      <option key={user.id} value={user.id}>{user.name}</option>
    );

    var please_select_user_or_unassign = (this.state.user_id) ? <option key='null' value='null'>Unassign The User</option>: <option key='null' value='null'>Pleaser Select a User</option>;

    var delete_button = this.props.onDelete ? <input type="submit" value="Delete" onClick={this.handleDelete} /> : '';

    return (
      <tr>
        <td>
          <input type="text" placeholder="Name" value={name} onChange={this.handleNameChange} />
        </td>
        <td>
          <input type="checkbox" checked={complete} onChange={this.handleCompletedChange} />
        </td>
        <td>
          <input type="checkbox" checked={approved} onChange={this.handleApprovedChange} disabled={!complete}/>
        </td>
        <td>
          <select value={user_id} onChange={this.handleUserChange}>
            {please_select_user_or_unassign}
            {options_for_user}
          </select>
        </td>
        <td>
        </td>
        <td>
        </td>
        <td>
          <input type="submit" value="Submit" onClick={this.handleSubmit} />
          <input type="submit" value="Cancel" onClick={this.handleCancel} />
          {delete_button}
        </td>
      </tr>
    )
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

class Repair extends React.Component{
  constructor(props) {
    super(props);

    this.state = { editMode: false, repair: this.props.entity };

    this.switchToEditMode = this.switchToEditMode.bind(this);
    this.switchToViewMode = this.switchToViewMode.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCommentAdded = this.handleCommentAdded.bind(this);
  }

  handleDelete(){
    this.props.onDelete(this.state.repair.id);
  }

  render() {
    const { editMode } = this.state;

    if (editMode) {
      return this.renderForm();
    } else {
      return this.renderRepair();
    }
  }

  renderForm() {
    return <RepairForm users={this.props.users} entity={this.props.entity} switchToViewMode={this.switchToViewMode} onDelete={this.handleDelete} />;
  }

  switchToEditMode() {
    this.setState({editMode: true});
  }

  switchToViewMode(repair) {
    this.setState({editMode: false, repair: repair});
    this.props.onChange(repair);
  }

  retrieve_user_name(user_id){
    if(user_id && this.props.users){
      return this.props.users.filter((user) =>{
        return user.id === user_id;
      })[0].name;
    }else{
      return 'Unassigned';
    }
  }

  handleCommentAdded(comment){
    var repair = this.state.repair;
    repair.comments.push(comment);
    this.setState({repair: repair});
  }

  renderRepair() {
    const { comments, complete, approved, name, user_id, starts_at } = this.state.repair;
    const user_name = this.retrieve_user_name(user_id);
    const comment_vdom = comments.map((entity) =>
      <li key={entity.id}>{entity.comment}</li>
    );

    return (
      <tr>
        <td>{name}</td>
        <td>{complete.toString()}</td>
        <td>{approved.toString()}</td>
        <td>{user_name}</td>
        <td>{starts_at}</td>
        <td>
          <ul>
            {comment_vdom}
            <AddNewComment entity={this.state.repair} onSuccess={this.handleCommentAdded}/>
          </ul>
        </td>
        <td><button onClick={this.switchToEditMode} >Edit</button></td>
      </tr>
    );
  }
}

class AddNewRepair extends React.Component{
  constructor(props) {
    super(props);

    this.state = {showButton: true, entity: {name:'', complete:false, approved: false, user_id: ''}};
    this.handleAddNew = this.handleAddNew.bind(this);
    this.switchBackToButton = this.switchBackToButton.bind(this);
  }

  handleAddNew(event){
    event.preventDefault();

    this.setState({showButton: false});
  }

  switchBackToButton(data){
    if (data.id){
      this.props.onSuccess(data);
      this.setState({showButton: true, entity: {name:'', complete:false, approved: false, user_id: ''}});
    }else{
      this.setState({showButton: true, entity: data});
    }
  }

  renderShowButton(){
    return <button onClick={this.handleAddNew}>Add New Repair</button>;
  }

  renderForm(){
    return (
      <table>
        <tbody>
          <RepairForm users={this.props.users} entity={this.state.entity} switchToViewMode={this.switchBackToButton}/>
        </tbody>
      </table>
    );
  }

  render() {
    if(this.state.showButton){
      return this.renderShowButton();
    }else{
      return this.renderForm();
    }
  }
}

class Repairs extends React.Component{
  constructor(props) {
    super(props);

    this.state = {repairs: [], filter_for_completeness: '0', filter_for_user: '-1', filter_for_start_date_time: ''};
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddNew = this.handleAddNew.bind(this);
    this.handleSwitchToUserManagement = this.handleSwitchToUserManagement.bind(this);
    this.handleFilterForCompletenessChange = this.handleFilterForCompletenessChange.bind(this);
    this.handleFilterForUserChange = this.handleFilterForUserChange.bind(this);
    this.handleFilterForStartDateTimeChange = this.handleFilterForStartDateTimeChange.bind(this);
    this.handleRepairChange = this.handleRepairChange.bind(this);
  }

  handleRepairChange(newEntity){
    var entities = this.state.repairs.slice(0);
    var new_entities = entities.map((entity) => {
      if(entity.id === newEntity.id){
        return newEntity;
      }else{
        return entity;
      }
    });

    this.setState({repairs: new_entities})
  }

  handleFilterForStartDateTimeChange(event){
    event.preventDefault();

    this.setState({filter_for_start_date_time: event.target.value});
  }

  handleFilterForUserChange(event){
    event.preventDefault();

    this.setState({filter_for_user: event.target.value});
  }

  handleFilterForCompletenessChange(event){
    event.preventDefault();

    this.setState({filter_for_completeness: event.target.value});
  }

  handleSwitchToUserManagement(event){
    event.preventDefault();

    this.props.onSwitchToUsers();
  }

  handleAddNew(entity){
    var new_repairs = this.state.repairs.slice(0);
    new_repairs.push(entity);

    this.setState({repairs: new_repairs})
  }

  handleDelete(removed_id){
    var new_repairs = this.state.repairs.filter((repair) => { return repair.id != removed_id });

    this.setState({repairs: new_repairs})
  }

  componentWillMount() {
    axios.get( Routes.repairs_path('json') )
    .then((response) => {
      var data = response.data;
      this.setState({repairs: data});
    })

    axios.get( Routes.users_path('json') )
    .then((response) => {
      var data = response.data;
      this.setState({users: data})
    })
  }

  filter_by_completeness(source){
    return source.filter((repair) =>{
      if(this.state.filter_for_completeness === '0'){
        return true;
      }
      if(this.state.filter_for_completeness === '1'){
        return repair.complete;
      }
      if(this.state.filter_for_completeness === '2'){
        return !repair.complete;
      }
    });
  }

  filter_by_user(source){
    return source.filter((repair) =>{
      if(this.state.filter_for_user === '-1'){
        return true;
      }else{
        return repair.user_id === parseInt(this.state.filter_for_user);
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
    if(!this.state.users){
      return null;
    }

    var filtered_by_completeness = this.filter_by_completeness(this.state.repairs);
    var filtered_by_user = this.filter_by_user(filtered_by_completeness);
    var filtered_by_date_time = this.filter_by_start_date_time(filtered_by_user);

    var content = filtered_by_date_time.map((entity) =>
      <Repair key={entity.id} entity={entity} users={this.state.users} onDelete={this.handleDelete} onChange={this.handleRepairChange} />
    );

    var filter_by_user_vdom = this.state.users.map((user) =>
      <option key={user.id} value={user.id}>{user.name}</option>
    );

    return (
      <div>
        <a href='#' onClick={this.handleSwitchToUserManagement}>Switch To User Management</a>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>
                Completed
                <select onChange={this.handleFilterForCompletenessChange}>
                  <option value='0'>No filter</option>
                  <option value='1'>By Completed</option>
                  <option value='2'>By Uncompleted</option>
                </select>
              </th>
              <th>Approved</th>
              <th>
                User
                <select onChange={this.handleFilterForUserChange}>
                  <option value='-1'>No filter</option>
                  {filter_by_user_vdom}
                </select>
              </th>
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
        <AddNewRepair onSuccess={this.handleAddNew} users={this.state.users} />
      </div>
    );
  } 
}

class UserForm extends React.Component{
  constructor(props) {
    super(props);

    this.state = this.props.entity;

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleAdminChange = this.handleAdminChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(){
    event.preventDefault();


    axios({
      method: 'DELETE',
      url: Routes.user_path(this.state.id,'json')
    }).then((response) => {
      var data = response.data;
      this.props.onDelete(this.state.id);
    }).catch(function(msg){
      alert( "Sorry, unauthorized!" );
    });
  }

  handleCancel(){
    event.preventDefault();
    const entity = (this.state.id) ? this.props.entity : this.state;

    this.props.switchToViewMode(entity);
  }

  handleSubmit(event){
    event.preventDefault();

    const url = (this.state.id) ? Routes.user_path(this.state.id,'json') : Routes.users_path('json');
    const method = (this.state.id) ? 'PATCH' : 'POST';

    axios({
      method: method,
      url: url,
      data: {user: { name: this.state.name, admin: this.state.admin }}
    }).then((response) => {
      var data = response.data;
      this.props.switchToViewMode(data);
    }).catch(function(msg){
      alert( "Sorry, unauthorized!" );
    });
  }

  handleNameChange(event){
    this.setState({name: event.target.value});
  }

  handleAdminChange(event){
    const target = event.target;
    const value = target.checked;
    this.setState({admin: value});
  }

  render(){
    const { name, admin } = this.state;

    var delete_button = this.props.onDelete ? <input type="submit" value="Delete" onClick={this.handleDelete} /> : '';

    return (
      <tr>
        <td>
          <input type="text" placeholder="Name" value={name} onChange={this.handleNameChange} />
        </td>
        <td>
          <input type="checkbox" checked={admin} onChange={this.handleAdminChange} />
        </td>
        <td>
          <input type="submit" value="Submit" onClick={this.handleSubmit} />
          <input type="submit" value="Cancel" onClick={this.handleCancel} />
          {delete_button}
        </td>
      </tr>
    )
  }
}

class AddNewUser extends React.Component{
  constructor(props) {
    super(props);

    this.state = {showButton: true, entity: {name:'', admin: false}};
    this.handleAddNew = this.handleAddNew.bind(this);
    this.switchBackToButton = this.switchBackToButton.bind(this);
  }

  handleAddNew(event){
    event.preventDefault();

    this.setState({showButton: false});
  }

  switchBackToButton(data){
    if (data.id){
      this.props.onSuccess(data);
    }
    this.setState({showButton: true, entity: data});
  }

  renderShowButton(){
    return <button onClick={this.handleAddNew}>Add New User</button>;
  }

  renderForm(){
    return (
      <table>
        <tbody>
          <UserForm entity={this.state.entity} switchToViewMode={this.switchBackToButton}/>
        </tbody>
      </table>
    );
  }

  render() {
    if(this.state.showButton){
      return this.renderShowButton();
    }else{
      return this.renderForm();
    }
  }
}

class User extends React.Component{
  constructor(props) {
    super(props);

    this.state = { editMode: false, entity: this.props.entity };

    this.switchToEditMode = this.switchToEditMode.bind(this);
    this.switchToViewMode = this.switchToViewMode.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(){
    this.props.onDelete(this.state.entity.id);
  }

  render() {
    const { editMode } = this.state;

    if (editMode) {
      return this.renderForm();
    } else {
      return this.renderEntity();
    }
  }

  renderForm() {
    return <UserForm entity={this.props.entity} switchToViewMode={this.switchToViewMode} onDelete={this.handleDelete} />;
  }

  switchToEditMode() {
    this.setState({editMode: true});
  }

  switchToViewMode(entity) {
    this.setState({editMode: false, entity: entity});
  }

  renderEntity() {
    const { name, admin } = this.state.entity;
    return (
      <tr>
        <td>{name}</td>
        <td>{admin.toString()}</td>
        <td><button onClick={this.switchToEditMode} >Edit</button></td>
      </tr>
    );
  }
}

class Users extends React.Component{
  constructor(props) {
    super(props);

    this.state = {entities: []};
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddNew = this.handleAddNew.bind(this);
    this.handleSwitchToRepairManagement = this.handleSwitchToRepairManagement.bind(this);
  }

  handleSwitchToRepairManagement(event){
    event.preventDefault();

    this.props.onSwitchToRepairs();
  }

  handleAddNew(entity){
    var entities = this.state.entities.slice(0);
    entities.push(entity);

    this.setState({entities: entities})
  }

  handleDelete(removed_id){
    var new_entities = this.state.entities.filter((entity) => { return entity.id != removed_id });

    this.setState({entities: new_entities})
  }

  componentWillMount() {
    axios.get( Routes.users_path('json') )
    .then((response) => {
      var data = response.data;
      this.setState({entities: msg})
    })
  }

  render() {
    var content = this.state.entities.map((entity) =>
      <User key={entity.id} entity={entity} onDelete={this.handleDelete} />
    );

    return (
      <div>
        <a href='#' onClick={this.handleSwitchToRepairManagement}>Switch To Repair Management</a>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Admin</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {content}
          </tbody>
        </table>
        <AddNewUser onSuccess={this.handleAddNew} users={this.state.users} />
      </div>
    );
  } 
}

