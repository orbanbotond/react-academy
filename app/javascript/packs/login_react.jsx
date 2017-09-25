import AdminView from './admin_react'
import UserView from './user_react'
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios';

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

    axios.get( Routes.login_users_path('json',{ 
        name: this.state.name, 
        password: this.state.pwd 
      })).then((response) => {
        var data = response.data;
        if(data.admin){
          this.switchToAdminView(data);
        }else{
          this.switchToUserView(data);
        }
      }).catch(error => {
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

    axios({
      method: 'POST',
      url: Routes.register_users_path('json'),
      data: { name: this.state.name, password: this.state.pwd }
    }).then((response) => {
      var data = response.data;
      this.switchToUserView(data);
    }).catch(function(msg){
      alert( "Sorry, the user is already taken! Please pick another username" );
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
