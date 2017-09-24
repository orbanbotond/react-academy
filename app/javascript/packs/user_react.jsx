import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

export default class UserView extends React.Component {
  constructor(props) {
    debugger
    super(props);
  }

  render() {
    return (
      <div >
        Hey! welcome simple user: {this.props.user.name}
      </div>
    );
  }
}
