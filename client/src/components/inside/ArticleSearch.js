import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Search from '../common/SearchInput'
import insideCss from './inside.css'

export default class ArticleSearch extends Component {

  focus = dom => $(dom).addClass('active');

  blur = dom => $(dom).removeClass('active');

  render() {
    const { onSearch } = this.props;
    return (
      <div style={{textAlign: 'right', margin: '20px 0'}}>
        <Search 
          className={insideCss.search} 
          placeholder='Search some articles' 
          onSearch={onSearch} 
          onKeyUp={e => e.keyCode === 13 && onSearch(e.target.value)}
          onFocus={e => this.focus(e.target.parentNode)}
          onBlur={e => this.blur(e.target.parentNode)} />
      </div>
    )
  }
}

ArticleSearch.PropTypes = {
  onSearch: PropTypes.func.isRequired
};