import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Form from '../../components/inside/AdminForm'
import { fetchArticleTypes } from '../../actions/articles'
import { fetchUpdateBlog, fetchAdmin } from '../../actions/inside'

class Admin extends Component {
  componentWillMount() {
    const { admin, types, dispatch } = this.props;
    if (!admin.name) dispatch(fetchAdmin());
    if (types.length === 0) dispatch(fetchArticleTypes());
  }

  handleSubmit = updateData => this.props.dispatch(fetchUpdateBlog(updateData));

  render() {
    const { admin, types, typesIsFetching, typesId } = this.props;
    return (
      <Form account={admin.name} email={admin.email} types={types} typesId={typesId} isFetching={typesIsFetching} onSubmit={this.handleSubmit} />
    )
  }
}

const mapStateToProps = state => {
  const { item: admin } = state.inside.admin;
  const { items: types, isFetching: typesIsFetching, id: typesId } = state.articles.types;
  return {
    admin,
    types: types.map(type => type.text),
    typesIsFetching,
    typesId
  };
};

export default connect(mapStateToProps)(Admin)