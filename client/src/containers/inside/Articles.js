import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Table from '../../components/inside/ArticleTable'
import Nav from '../../components/inside/ArticleNav'
import Search from '../../components/inside/ArticleSearch'
import Loading from '../../components/common/Loading'
import Pagination from '../../components/common/Pagination'
import { fetchInsideArticles, fetchInsideArticlesByTitle, fetchDeleteArticle } from '../../actions/articles'

class InsideArticles extends Component {
  componentWillMount() {
    this.props.dispatch(fetchInsideArticles());
  }

  handleClick = page => this.props.dispatch(fetchInsideArticles(page));

  handleSearch = (title, page) => this.props.dispatch(fetchInsideArticlesByTitle(title, page));

  handleDelete = id => this.props.dispatch(fetchDeleteArticle(id));

  render() {
    const { articles, page, total, isFetching, isUpdating, searchTitle } = this.props;
    const isEmpty = articles.length === 0;
    return (
      <div>
        <Nav />
        <Search onSearch={this.handleSearch} />
        {
          isEmpty ? <div>没有更多了啦(= =##)</div> :
            (isFetching ? <Loading /> :
              <div>
                <Table
                  items={articles}
                  isUpdating={isUpdating}
                  onDelete={this.handleDelete} />
                <div style={{ textAlign: 'center' }}>
                  <Pagination
                    maxPage={total}
                    currentPage={page}
                    onClick={page => searchTitle ? this.handleSearch(searchTitle, page) : this.handleClick(page)} />
                </div>
              </div>
            )
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { items: articles, page, total, isFetching, isUpdating, searchTitle } = state.articles.lists;
  return {
    articles,
    page,
    total,
    isFetching,
    isUpdating,
    searchTitle
  }
};

export default connect(mapStateToProps)(InsideArticles)