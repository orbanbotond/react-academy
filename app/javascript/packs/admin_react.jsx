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
      <tr key={entity.id}>
        <td>{entity.name}</td>
        <td>{entity.complete.toString()}</td>
        <td>{entity.approved.toString()}</td>
        <td>{entity.user_id}</td>
        <td>{entity.starts_at}</td>
      </tr>
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