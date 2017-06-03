import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Nav from '../../components/inside/ArticleNav';
import Search from '../../components/inside/Search';
import Error from '../../components/common/Error';
import TableContainer from './ArticlesTable';
import FormContainer from './ArticleForm';
import { changeArticleTabs, fetchInsideArticlesByTitle } from '../../actions/inside';

class InsideArticles extends Component {
  componentWillMount () {
    this.props.dispatch(changeArticleTabs(0));
  }

  handleTabChange = index => this.props.dispatch(changeArticleTabs(index));

  handleSearch = (title, page) => this.props.dispatch(fetchInsideArticlesByTitle(title, page));

  render () {
    const { errMsg, activeIndex } = this.props;
    return (
      errMsg ? <Error msg={errMsg} />
      : <div>
        <Nav onClick={this.handleTabChange} activeIndex={activeIndex} />
        {
            activeIndex === 0 ? <Search onSearch={this.handleSearch} placeholder='Search articles...' /> : ''
          }
        {
            activeIndex === 0 ? <TableContainer /> : <FormContainer />
          }
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { errMsg } = state.articles.lists;
  const { activeIndex } = state.inside.articles;
  return {
    errMsg,
    activeIndex
  };
};

export default connect(mapStateToProps)(InsideArticles);

InsideArticles.PropTypes = {
  errMsg: PropTypes.bool.isRequired,
  activeIndex: PropTypes.number.isRequired
};
