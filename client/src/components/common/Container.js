import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Container extends Component {
  render () {
    const { className, children, isFluid, ...props } = this.props;
    return (
      <div className={`${isFluid ? 'container-fluid' : 'container'} ${className || ''}`} {...props}>
        <div className='row'>
          {children}
        </div>
      </div>
    );
  }
}

Container.PropTypes = {
  className: PropTypes.string,
  isFluid: PropTypes.bool
};
