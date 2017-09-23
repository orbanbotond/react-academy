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

    this.props.switchToViewMode(this.props.entity);
  }

  handleSubmit(event){
    event.preventDefault();

    $.ajax({
      method: 'PATCH',
      url: Routes.repair_path(this.state.id,'json'),
      data: {repair: { name: this.state.name, complete: this.state.complete, approved: this.state.approved, user_id: this.state.user_id }}
    }).done(( msg ) => {
      this.props.switchToViewMode(this.state);
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
          <input type="submit" value="Delete" onClick={this.handleDelete} />
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
    if(user_id){
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

class Repairs extends React.Component{
  constructor(props) {
    super(props);

    this.state = {repairs: []};
    this.handleDelete = this.handleDelete.bind(this);
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
      </div>
    );
  } 
}
