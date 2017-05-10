import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Content from '../../components/articles/Content'
import Loading from '../../components/common/Loading'
import { fetchArticle } from '../../actions/articles'

class ArticleContent extends Component {

  componentWillMount() {
    this.props.dispatch(fetchArticle(this.props.params.id));
  }

  render() {
    const { item, isFetching } = this.props;
    return (
      isFetching ? <Loading /> : <Content article={item} isFetching={isFetching} />
    )
  }
}

const mapStateToProps = state => {
  const { item, isFetching } = state.articles.current;
  return {
    item,
    isFetching
  };
};

export default connect(mapStateToProps)(ArticleContent)

ArticleContent.PropTypes = {
  item: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired
};