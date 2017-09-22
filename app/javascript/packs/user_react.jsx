import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class UserView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div >
        Hey! welcome simple user: {user.name}
      </div>
    );
  }
}
