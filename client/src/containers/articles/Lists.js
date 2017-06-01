import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Lists from '../../components/articles/List'
import Loading from '../../components/common/Loading'
import Error from '../../components/common/Error'
import Pagination from '../../components/common/Pagination'
import { fetchArticles, fetchArticlesByTitle, fetchArticlesByType } from '../../actions/articles'
import articlesCss from '../../components/articles/articles.css'

class ArticleLists extends Component {

  componentWillMount() {
    const { searchTitle, searchType, page } = this.props.params;
    if (searchTitle) return this.props.dispatch(fetchArticlesByTitle(searchTitle, page));
    if (searchType) return this.props.dispatch(fetchArticlesByType(searchType, page));
    this.props.dispatch(fetchArticles(page));
  }

  componentWillReceiveProps(nextState) {
    // TODO: 感觉逻辑很复杂的样子, 应该有优化空间
    const { searchTitle, searchType, page } = nextState.params;
    if (searchTitle && (searchTitle !== this.props.params.searchTitle || this.props.params.page !== page)) {
      return this.props.dispatch(fetchArticlesByTitle(searchTitle, page));
    }
    if (searchType && (searchType !== this.props.params.searchType || this.props.params.page !== page)) {
      return this.props.dispatch(fetchArticlesByType(searchType, page));
    }
    if (!searchTitle && !searchType) {
      if (this.props.params.page !== page || this.props.params.searchTitle !== searchTitle || this.props.params.searchType !== searchType) return this.props.dispatch(fetchArticles(page));
    }
  }

  render() {
    const { articles, page, total, isFetching, errMsg, location } = this.props;
    const baseURL = location.pathname.slice(0, location.pathname.lastIndexOf('/'));
    const isEmpty = articles.length === 0;
    return (
      errMsg ? <Error msg={errMsg} /> : (
        isFetching ? <Loading /> :
          (
            isEmpty ? <div>没有更多了啦(= =##)</div> :
              <div>
                <Lists articles={articles} />
                <div style={{ textAlign: 'center' }}>
                  <Pagination maxPage={total} currentPage={page} baseURL={baseURL} />
                </div>
              </div>
          )
      )
    )
  }
}

const mapStateToProps = state => {
  const { items: articles, page, total, isFetching, errMsg } = state.articles.lists;
  return {
    articles,
    page,
    total,
    isFetching,
    errMsg
  }
};

export default connect(mapStateToProps)(ArticleLists)

ArticleLists.PropTypes = {
  articles: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  isFetching: PropTypes.bool.isRequired,
  errMsg: PropTypes.string
};