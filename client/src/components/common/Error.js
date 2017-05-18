import React, { Component } from 'react'

export default class Error extends Component {
  render() {
    const { msg } = this.props;
    return (
      <div style={{textAlign: 'center'}}>
        <h1>{msg || 'Something bad happend!'}</h1>
      </div>
    )
  }
}