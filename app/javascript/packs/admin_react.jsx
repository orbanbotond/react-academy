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
        debugger
        this.setState({repairs: msg})
      });
  }

  render() {
    return (
      <div >
          Repairs
      </div>
    );
  }  
}