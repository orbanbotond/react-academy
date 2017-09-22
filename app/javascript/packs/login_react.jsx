// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {name: '', pwd: ''};

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePwdChange = this.handlePwdChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  handlePwdChange(event) {
    this.setState({pwd: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    $.ajax({
      url: Routes.login_users_path(),
      data: { name: this.state.name, password: this.state.pwd }
    }).done(function( msg ) {
      alert( "Yeiyy" );
    }).fail(function(msd){
      alert( "Sorry, unauthorized!" );
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={this.state.name} onChange={this.handleNameChange} />
        </label>
        <label>
          Password:
          <input type="text" name="password" value={this.state.pwd} onChange={this.handlePwdChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Login />,
    document.body.appendChild(document.createElement('div')),
  )
})

