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
  }

  handleCancel(){
    this.props.switchToViewMode();
  }

  handleSubmit(event){
    event.preventDefault();

    $.ajax({
      method: 'PATCH',
      url: Routes.repair_path(this.state.id,'json'),
      data: {repair: { name: this.state.name, complete: this.state.complete, approved: this.state.approved, user_id: this.state.user_id }}
    }).done(( msg ) => {
      this.props.switchToViewMode();
    }).fail(function(msd){
      alert( "Sorry, unauthorized!" );
    });
  }

  handleUserChange(event){
    // this.setState({name: event.target.value});
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
    const { complete, approved, name } = this.state;

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
          </td>
          <td>
            <input type="submit" value="Submit" onClick={this.handleSubmit} />
            <input type="submit" value="Cancel" onClick={this.handleCancel} />
          </td>
        </tr>

    )
  }
}

class Repair extends React.Component{
  constructor(props) {
    super(props);

    this.state = { editMode: false };

    this.switchToEditMode = this.switchToEditMode.bind(this);
    this.switchToViewMode = this.switchToViewMode.bind(this);
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
    return <RepairForm entity={this.props.entity} switchToViewMode={this.switchToViewMode}/>;
  }

  switchToEditMode() {
    this.setState({editMode: true});
  }

  switchToViewMode() {
    this.setState({editMode: false});
  }

  renderRepair() {
    return (
      <tr>
        <td>{this.props.entity.name}</td>
        <td>{this.props.entity.complete.toString()}</td>
        <td>{this.props.entity.approved.toString()}</td>
        <td>{this.props.entity.user_id}</td>
        <td>{this.props.entity.starts_at}</td>
        <td><button onClick={this.switchToEditMode} >Edit</button></td>
      </tr>
    );
  }
}

class Repairs extends React.Component{
  constructor(props) {
    super(props);

    this.state = {repairs: []};
  }

  componentWillMount() {
    $.ajax({
      url: Routes.repairs_path('json')}).done((msg)=>{
        this.setState({repairs: msg})
      });
  }

  render() {
    var content = this.state.repairs.map((entity) =>
      <Repair key={entity.id} entity={entity} />
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
