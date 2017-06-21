import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Container from '../../components/common/Container';
import Aside from '../../components/articles/Aside';
import { fetchArticleTypes } from '../../actions/articles';

class Article extends Component {
  componentWillMount () {
    this.props.types.length === 0 && this.props.dispatch(fetchArticleTypes());
  }

  render () {
    const { types, isFetching } = this.props;
    return (
      <Container isFluid>
        <div className='col-lg-2 col-sm-3'>
          <Aside lists={types} isFetching={isFetching} />
        </div>
        <div className='col-lg-8 col-sm-8'>
          {this.props.children}
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const { items: types, isFetching } = state.articles.types;
  return {
    types: types.map(type => ({
      link: `/articles/${type}/1`,
      text: type
    })),
    isFetching
  };
};

export default connect(mapStateToProps)(Article);

Article.PropTypes = {
  types: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired
};
