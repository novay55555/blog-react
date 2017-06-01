import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import articleCss from './articles.css'

export default class ArticleLists extends Component {
  render() {
    const { articles } = this.props;
    return (
      <ul className={`list-group ${articleCss.list}`}>
        {
          articles.map((article, i) => (
            <li key={i}>
              <Link to={article.link} className={`list-group-item animated fadeInDown`}>
                <h3>{article.title}</h3>
                <p>
                  <span>作者: {article.author}</span>
                  <span>时间: {article.date}</span>
                  <span>文章分类: {article.articleType}</span>
                </p>
                <p>{article.description}</p>
              </Link>
            </li>
          ))
        }
      </ul>
    )
  }
}

ArticleLists.PropTypes = {
  articles: PropTypes.arrayOf({
    link: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    articleType: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired
};