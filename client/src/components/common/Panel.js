import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Panel extends Component {
  render () {
    const { className, type, title } = this.props;
    return (
      <div className={`panel panel-${type || 'default'} ${className || ''}`}>
        <div className='panel-heading'>
          <h3 className='panel-title'>{title}</h3>
        </div>
        <div className='panel-body'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

Panel.PropTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  title: PropTypes.string.isRequired
};
