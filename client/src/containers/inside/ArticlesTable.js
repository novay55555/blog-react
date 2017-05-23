import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Table from '../../components/inside/ArticleTable'
import Pagination from '../../components/common/Pagination'
import Loading from '../../components/common/Loading'
import { fetchInsideArticles, fetchInsideArticlesByTitle, fetchInsideArticle, fetchDeleteArticle, fetchEditArticle } from '../../actions/inside'
class ArticleTable extends Component {
  componentWillMount() {
    !this.props.hasEntered && this.props.dispatch(fetchInsideArticles());
  }

  handleGetArticle = id => this.props.dispatch(fetchInsideArticle(id));

  handleDeleteArticle = id => this.props.dispatch(fetchDeleteArticle(id));

  handleClick = page => this.props.dispatch(fetchInsideArticles(page));

  handleSearch = (title, page) => this.props.dispatch(fetchInsideArticlesByTitle(title, page));

  render() {
    const { articles, isFetching, isUpdating, total, page, searchTitle, hasEntered, errMsg } = this.props;
    const isEmpty = articles.length === 0;
    return (
      <div>
        {
          isEmpty ? <div>没有更多了啦(= =##)</div> :
            (isFetching ? <Loading /> :
              <div>
                <Table
                  items={articles}
                  isUpdating={isUpdating}
                  onDelete={this.handleDeleteArticle}
                  onEdit={this.handleGetArticle} />
                <div style={{ textAlign: 'center' }}>
                  <Pagination
                    maxPage={total}
                    currentPage={page}
                    onClick={page => searchTitle ? this.handleSearch(searchTitle, page) : this.handleClick(page)} />
                </div>
              </div>)
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {
    items: articles,
    page,
    total,
    isUpdating,
    isFetching,
    searchTitle,
    errMsg
  } = state.articles.lists;
  const { hasEntered } = state.inside.admin;
  return {
    articles,
    page,
    total,
    isUpdating,
    isFetching,
    searchTitle,
    errMsg,
    hasEntered
  }
};

export default connect(mapStateToProps)(ArticleTable)

ArticleTable.PropTypes = {
  articles: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  searchTitle: PropTypes.string.isRequired,
  errMsg: PropTypes.string.isRequired,
  hasEntered: PropTypes.bool.isRequired
};