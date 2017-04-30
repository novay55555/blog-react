import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

export default class ListGroupLink extends Component {
  render() {
    const { className, lists } = this.props;
    return (
      <div className={`list-group ${className || ''}`}>
        {
          lists.map((list, i) => (
            <Link to={list.link} key={i} className="list-group-item">
              {list.count ? <span className="badge">{list.count}</span> : ''}
              {list.text}
            </Link>
          ))
        }
      </div>
    )
  }
}

ListGroupLink.PropTypes = {
  className: PropTypes.string,
  lists: PropTypes.arrayOf({
    link: PropTypes.string.isRequired,
    count: PropTypes.number,
    text: PropTypes.string.isRequired
  }).isRequired
};