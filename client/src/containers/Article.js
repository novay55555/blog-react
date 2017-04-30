import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ContainerFluid from '../components/common/ContainerFluid'
import Aside from '../components/articles/Aside'
import { fetchArticleTypes } from '../actions/articles'

class Article extends Component {

  constructor() {
    super();
  }

  componentWillMount() {
    this.props.dispatch(fetchArticleTypes());
  }

  render() {
    const { types, isFetching} = this.props;
    return (
      <ContainerFluid>
        <div className="col-lg-2 col-sm-3">
          <Aside lists={types} />
        </div>
        <div className="col-lg-8 col-sm-8">
          {this.props.children}
        </div>
      </ContainerFluid>
    )
  }
}

const mapStateToProps = state => {
  const { items: types, isFetching} = state.articles.types;
  return {
    types,
    isFetching
  }
};

export default connect(mapStateToProps)(Article)