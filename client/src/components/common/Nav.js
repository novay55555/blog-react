import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

export default class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: props.activeIndex || 0
    };
  }

  change = activeIndex => this.setState({ activeIndex });

  render() {
    const { activeIndex } = this.state;
    const { types, className, onClick, tabs, ...props } = this.props;
    return (
      <ul className={`nav nav-${types || 'tabs'} ${className || ''}`} {...props}>
        {
          tabs.map((tab, i) => (
            <li key={i} role="presentation" className={activeIndex === i ? 'active' : ''}>
              <Link to={tab.path || '#'} onClick={e => {
                this.change(i);
                onClick && e.preventDefault();
                onClick && onClick();
              }}>{tab.text}</Link>
            </li>
          ))
        }
      </ul>
    )
  }
}

Nav.PropTypes = {
  types: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  tabs: PropTypes.arrayOf({
    path: PropTypes.string,
    text: PropTypes.string.isRequired
  }).isRequired,
  activeIndex: PropTypes.number
};