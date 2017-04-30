import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ContainerFluid extends Component {
  constructor() {
    super();
  }

  render() {
    const { className } = this.props;
    return (
      <div className={`container-fluid ${className || ''}`}>
        {this.props.children}
      </div>
    )
  }
}

ContainerFluid.PropTypes = {
  className: PropTypes.string
};