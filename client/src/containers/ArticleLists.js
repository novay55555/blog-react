import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Lists from '../components/articles/List'
import Loading from '../components/common/Loading'
import Pagination from '../components/common/Pagination'
import { fetchArticles } from '../actions/articles'
import articlesCss from '../components/articles/articles.css'

class ArticleLists extends Component {

  componentWillMount() {
    this.props.dispatch(fetchArticles(this.props.params.page));
  }

  componentWillReceiveProps(nextState) {
    if (this.props.params.page !== nextState.params.page) this.props.dispatch(fetchArticles(nextState.params.page));
  }

  render() {
    const { articles, page, total, isFetching } = this.props;
    const isEmpty = articles.length === 0;
    return (
      isFetching ? <Loading /> :
        (
          isEmpty ? <div>没有更多了啦(= =##)</div> :
            <div>
              <Lists className={articlesCss.list} articles={articles} />
              <div style={{ textAlign: 'center' }}>
                <Pagination maxPage={total} currentPage={page} baseURL={`/articles`} />
              </div>
            </div>
        )
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