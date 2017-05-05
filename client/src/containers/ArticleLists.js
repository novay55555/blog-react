import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Lists from '../components/articles/List'
import Loading from '../components/common/Loading'
import { fetchArticles } from '../actions/articles'
import articlesCss from '../components/articles/articles.css'

class ArticleLists extends Component {

  constructor() {
    super();
  }

  componentWillMount() {
    this.props.dispatch(fetchArticles());
  }

  componentWillReceive(nextState) {
    if (nextState.page != this.props.page) this.props.dispatch(fetchArticles(nextState.page));
  }

  render() {
    const { articles, page, total, isFetching } = this.props;
    return (
      isFetching ? <Loading /> : <Lists className={articlesCss.list} articles={articles} />
    )
  }
}

const mapStateToProps = state => {
  const { items: articles, page, total, isFetching } = state.articles.lists;
  return {
    articles,
    page,
    total,
    isFetching
  }
};

export default connect(mapStateToProps)(ArticleLists)