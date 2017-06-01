import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Form from '../../components/inside/ArticleForm'
import { fetchArticleTypes } from '../../actions/articles'
import { fetchAddArticle, fetchEditArticle, fetchAdmin } from '../../actions/inside'

class ArticleForm extends Component {
  componentWillMount() {
    if (this.props.types.length === 0) this.props.dispatch(fetchArticleTypes());
    if (!this.props.author) this.props.dispatch(fetchAdmin());
  }

  handleAddArticle = article => this.props.dispatch(fetchAddArticle(article));

  handEditArticle = article => this.props.dispatch(fetchEditArticle(article));

  render() {
    const { types, author, article, articleMode, isFetching, isUpdating } = this.props;
    return (
      <Form
        articleTypes={types}
        author={author}
        article={article}
        mode={articleMode}
        onSubmit={articleMode === 'add' ? this.handleAddArticle : this.handEditArticle}
        isFetching={isFetching}
        isUpdating={isUpdating} />
    )
  }
}

const mapStateToProps = state => {
  const { items: types } = state.articles.types;
  const { name: author } = state.inside.admin.item;
  const { activeIndex, articleMode } = state.inside.articles;
  const { item: article, isFetching, isUpdating } = state.articles.current;
  return {
    types,
    author,
    article,
    articleMode,
    isFetching,
    isUpdating
  }
};

export default connect(mapStateToProps)(ArticleForm)

ArticleForm.PropTypes = {
  types: PropTypes.array.isRequired,
  author: PropTypes.string.isRequired,
  article: PropTypes.object.isRequired,
  articleMode: PropTypes.number.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired
};