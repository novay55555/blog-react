import React, { Component } from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import articleCss from './articles.css';
import { querySelectors } from '../../lib/common';

export default class ArticleContent extends Component {
  componentDidMount () {
    if (!this.props.isFetching && Object.keys(this.props.article).length > 0) querySelectors('pre code').forEach(block => hljs.highlightBlock(block));
  }

  render () {
    const { className, article } = this.props;
    const html = marked(article.content || '');
    return (
      <div className={`animated fadeIn ${articleCss.content}`}>
        <h2>{article.title}</h2>
        <p>
          <span>作者: {article.author}</span>
          <span>时间: {article.date}</span>
          <span>文章分类: {article.articleType}</span>
        </p>
        <div className='text' dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  }
}

ArticleContent.PropTypes = {
  article: PropTypes.objectOf({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    articleType: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  }).isRequired
};
