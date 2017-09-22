import React from 'react'

export default class AdminView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div >
        Hey! welcome admin: {this.props.user.name}
      </div>
    );
  }
}
