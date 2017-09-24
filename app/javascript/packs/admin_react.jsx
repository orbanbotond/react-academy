import React from 'react'

export default class AdminView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div >
        <p>
          Hey! welcome admin: {this.props.user.name}
        </p>
        <div>
          <Repairs />
          <Users />
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

    $.ajax({
      method: 'DELETE',
      url: Routes.repair_path(this.state.id,'json')
    }).done(( msg ) => {
      this.props.onDelete(this.state.id);
    }).fail(function(msd){
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

    $.ajax({
      method: method,
      url: url,
      data: {repair: { name: this.state.name, complete: this.state.complete, approved: this.state.approved, user_id: this.state.user_id }}
    }).done(( msg ) => {
      this.props.switchToViewMode(msg);
    }).fail(function(msd){
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
          <input type="submit" value="Submit" onClick={this.handleSubmit} />
          <input type="submit" value="Cancel" onClick={this.handleCancel} />
          {delete_button}
        </td>
      </tr>
    )
  }
}

class Repair extends React.Component{
  constructor(props) {
    super(props);

    this.state = { editMode: false, repair: this.props.entity };

    this.switchToEditMode = this.switchToEditMode.bind(this);
    this.switchToViewMode = this.switchToViewMode.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
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

  renderRepair() {
    const { complete, approved, name, user_id, starts_at } = this.state.repair;
    const user_name = this.retrieve_user_name(user_id);
    return (
      <tr>
        <td>{name}</td>
        <td>{complete.toString()}</td>
        <td>{approved.toString()}</td>
        <td>{user_name}</td>
        <td>{starts_at}</td>
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
    }
    this.setState({showButton: true, entity: data});
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

    this.state = {repairs: []};
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddNew = this.handleAddNew.bind(this);
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
    $.ajax({ url: Routes.repairs_path('json')}).done((msg)=>{
        this.setState({repairs: msg})
      });

    $.ajax({ url: Routes.users_path('json')}).done((msg)=>{
        this.setState({users: msg})
      });
  }

  render() {
    var content = this.state.repairs.map((entity) =>
      <Repair key={entity.id} entity={entity} users={this.state.users} onDelete={this.handleDelete} />
    );

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Completed</th>
              <th>Approved</th>
              <th>User</th>
              <th>Started At</th>
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

    $.ajax({
      method: 'DELETE',
      url: Routes.user_path(this.state.id,'json')
    }).done(( msg ) => {
      this.props.onDelete(this.state.id);
    }).fail(function(msd){
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

    $.ajax({
      method: method,
      url: url,
      data: {user: { name: this.state.name, admin: this.state.admin }}
    }).done(( msg ) => {
      this.props.switchToViewMode(msg);
    }).fail(function(msd){
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
    $.ajax({ url: Routes.users_path('json')}).done((msg)=>{
        this.setState({entities: msg})
      });
  }

  render() {
    var content = this.state.entities.map((entity) =>
      <User key={entity.id} entity={entity} onDelete={this.handleDelete} />
    );

    return (
      <div>
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

