import AdminView from './admin_react'
import UserView from './user_react'
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {name: '', pwd: ''};

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCreateNewUser = this.handleCreateNewUser.bind(this);
    this.handlePwdChange = this.handlePwdChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  handleCreateNewUser(event) {
    event.preventDefault();

    ReactDOM.render(
      <Register />,
      document.getElementById('content')
    )
  }

  handlePwdChange(event) {
    this.setState({pwd: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    $.ajax({
      url: Routes.login_users_path(),
      data: { name: this.state.name, password: this.state.pwd }
    }).done(( msg ) => {
      if(msg.admin){
        this.switchToAdminView(msg);
      }else{
        this.switchToUserView(msg);
      }
    }).fail(function(msd){
      alert( "Sorry, unauthorized!" );
    });
  }

  render() {
    return (
      <div>
        <p>
          Please provide your authentication info for login!
        </p>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={this.state.name} onChange={this.handleNameChange} />
          </label>
          <label>
            Password:
            <input type="password" name="password" value={this.state.pwd} onChange={this.handlePwdChange} />
          </label>
          <input type="submit" value="Login" />
        </form>
        <a href='#' onClick={this.handleCreateNewUser}>Create a New User</a>
      </div>
    );
  }

  switchToAdminView(user){
    ReactDOM.render(
      <AdminView user={user}/>,
      document.getElementById('content')
    )
  }

  switchToUserView(user){
    ReactDOM.render(
      <UserView user={user}/>,
      document.getElementById('content')
    )
  }
}

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {name: '', pwd: ''};

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handlePwdChange = this.handlePwdChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  handleLogin(event) {
    event.preventDefault();

    ReactDOM.render(
      <Login />,
      document.getElementById('content')
    )
  }

  handlePwdChange(event) {
    this.setState({pwd: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    $.ajax({
      method: 'POST',
      url: Routes.register_users_path('json'),
      data: { name: this.state.name, password: this.state.pwd }
    }).done(( msg ) => {
      this.switchToUserView(msg);
    }).fail(function(msd){
      alert( "Sorry, the user with the same name already exists. Pick another username!" );
    });
  }

  render() {
    return (
      <div>
        <p>
          Please enter your info for your new user
        </p>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={this.state.name} onChange={this.handleNameChange} />
          </label>
          <label>
            Password:
            <input type="password" name="password" value={this.state.pwd} onChange={this.handlePwdChange} />
          </label>
          <input type="submit" value="Create New User" />
        </form>
        <a href='#' onClick={this.handleLogin}>Login</a>
      </div>
    );
  }

  switchToUserView(user){
    ReactDOM.render(
      <UserView user={user}/>,
      document.getElementById('content')
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Login />,
    document.getElementById('content')
  )
})
