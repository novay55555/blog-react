import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Table from '../../components/inside/ArticleTable'
import Nav from '../../components/inside/ArticleNav'
import Search from '../../components/inside/ArticleSearch'
import Loading from '../../components/common/Loading'
import Pagination from '../../components/common/Pagination'
import Form from '../../components/inside/ArticleForm'
import { fetchInsideArticles, fetchInsideArticlesByTitle, fetchDeleteArticle, fetchArticleTypes } from '../../actions/articles'
import { changeArticleTabs, fetchAddArticle } from '../../actions/inside'

class InsideArticles extends Component {
  componentWillMount() {
    const { dispatch, types } = this.props;
    if (types.length === 0) dispatch(fetchArticleTypes());
    dispatch(fetchInsideArticles());
    dispatch(changeArticleTabs(0));
  }

  handleClick = page => this.props.dispatch(fetchInsideArticles(page));

  handleSearch = (title, page) => this.props.dispatch(fetchInsideArticlesByTitle(title, page));

  handleDeleteArticle = id => this.props.dispatch(fetchDeleteArticle(id));

  handleTabChange = index => this.props.dispatch(changeArticleTabs(index));

  handleAddArticle = article => this.props.dispatch(fetchAddArticle(article));

  render() {
    const {
      articles,
      page,
      total,
      isFetching,
      isUpdating,
      searchTitle,
      activeIndex,
      types,
      author
    } = this.props;
    const isEmpty = articles.length === 0;
    return (
      <div>
        <Nav onClick={this.handleTabChange} />
        {
          activeIndex === 0 ? <Search onSearch={this.handleSearch} /> : ''
        }
        {
          activeIndex === 0 ?
            (isEmpty ? <div>没有更多了啦(= =##)</div> :
              (isFetching ? <Loading /> :
                <div>
                  <Table
                    items={articles}
                    isUpdating={isUpdating}
                    onDelete={this.handleDeleteArticle} />
                  <div style={{ textAlign: 'center' }}>
                    <Pagination
                      maxPage={total}
                      currentPage={page}
                      onClick={page => searchTitle ? this.handleSearch(searchTitle, page) : this.handleClick(page)} />
                  </div>
                </div>)
            ) :
            <Form
              articleTypes={types}
              author={author}
              onSubmit={this.handleAddArticle} />
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
    isFetching,
    isUpdating,
    searchTitle
  } = state.articles.lists;
  const { activeIndex } = state.inside.articles;
  const { items: types } = state.articles.types;
  const { username: author } = state.account;
  return {
    articles,
    page,
    total,
    isFetching,
    isUpdating,
    searchTitle,
    activeIndex,
    types,
    author
  }
};

export default connect(mapStateToProps)(InsideArticles)