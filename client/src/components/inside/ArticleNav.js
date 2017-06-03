import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Nav from '../common/Nav';

export default class ArticleNav extends Component {
  constructor () {
    super();
    this.state = {
      tabs: [{ text: '文章列表' }, { text: '文章发布' }]
    };
  }

  render () {
    const { onClick, activeIndex } = this.props;
    return (
      <Nav tabs={this.state.tabs} onClick={onClick} activeIndex={activeIndex} style={{marginBottom: 20}} />
    );
  }
}

ArticleNav.PropTypes = {
  onClick: PropTypes.func.isRequired,
  activeIndex: PropTypes.number.isRequired
};
