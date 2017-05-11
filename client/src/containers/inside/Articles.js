import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ArticleTable from '../../components/inside/ArticleTable'
import Loading from '../../components/common/Loading'
import Pagination from '../../components/common/Pagination'
import { fetchInsideArticles } from '../../actions/articles'

class InsideArticles extends Component {
  componentWillMount() {
    this.props.dispatch(fetchInsideArticles());
  }

  handleClick = page => this.props.dispatch(fetchInsideArticles(page));

  render() {
    const { articles, page, total, isFetching } = this.props;
    const isEmpty = articles.length === 0;
    return (
      isFetching ? <Loading /> :
      (
        isEmpty ? <div>没有更多了啦(= =##)</div> :
        <div>
              <ArticleTable items={articles} />
              <div style={{textAlign: 'center'}}>
                <Pagination maxPage={total} currentPage={page} onClick={this.handleClick} />
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

export default connect(mapStateToProps)(InsideArticles)