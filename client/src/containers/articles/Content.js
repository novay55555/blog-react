import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Content from '../../components/articles/Content';
import Loading from '../../components/common/Loading';
import Error from '../../components/common/Error';
import { fetchArticle } from '../../actions/articles';

class ArticleContent extends Component {
  componentWillMount () {
    this.props.dispatch(fetchArticle(parseInt(this.props.params.id)));
    document.addEventListener('click', this.openImage);
  }

  openImage = e => {
    const elem = e.target;
    if (elem.tagName.toLowerCase() === 'img') window.open(elem.src);
  };

  componentWillUnmount () {
    document.removeEventListener('click', this.openImage);
  }

  render () {
    const { item, isFetching, errMsg } = this.props;
    return (
      errMsg ? <Error msg={errMsg} /> : (
        isFetching ? <Loading /> : <Content article={item} isFetching={isFetching} />
      )
    );
  }
}

const mapStateToProps = state => {
  const { item, isFetching, errMsg } = state.articles.current;
  return {
    item,
    isFetching,
    errMsg
  };
};

export default connect(mapStateToProps)(ArticleContent);

ArticleContent.PropTypes = {
  item: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  errMsg: PropTypes.string
};
