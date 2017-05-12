import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Nav from '../common/Nav'

export default class ArticleNav extends Component {
  constructor() {
    super();
    this.state = {
      tabs: [{ text: '文章列表' }, { text: '文章发布' }]
    };
  }

  render() {
    return (
      <Nav tabs={this.state.tabs} onClick={() => console.log(1)} />
    )
  }
}