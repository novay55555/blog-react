import React, { Component } from 'react'
import PropTypes from 'prop-types'
import commonClass from './common.css'

export default class SearchInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || ''
    };
  }

  change = e => this.setState({ value: e.target.value });

  render() {
    const { className, icon, onSearch, type, ...props } = this.props;
    const { value } = this.state;
    return (
      <div className={`form-group ${commonClass.search} ${className || ''}`}>
        <input
          className="form-control"
          type={type || 'text'}
          value={value}
          onChange={this.change}
          {...props} />
        <a href="#" className={`glyphicon ${icon}`}
          onClick={e => {
            e.preventDefault();
            return onSearch.call(onSearch, value);
          }}></a>
      </div>
    )
  }
}

SearchInput.PropTypes = {
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
};