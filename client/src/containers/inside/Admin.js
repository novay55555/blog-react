import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Form from '../../components/inside/AdminForm';
import { fetchArticleTypes } from '../../actions/articles';
import { fetchUpdateBlog, fetchAdmin } from '../../actions/inside';

class Admin extends Component {
  componentWillMount () {
    const { admin, types, dispatch } = this.props;
    if (!admin.name) dispatch(fetchAdmin());
    if (types.length === 0) dispatch(fetchArticleTypes());
  }

  handleSubmit = updateData => this.props.dispatch(fetchUpdateBlog(updateData));

  render () {
    const { admin, types, typesIsFetching, typesId, isUpdating } = this.props;
    return (
      <div>
        {
          Object.keys(admin).length === 0 ? ''
            : <Form
              account={admin.name}
              email={admin.email}
              types={types}
              typesId={typesId}
              isFetching={typesIsFetching}
              isUpdating={isUpdating}
              onSubmit={this.handleSubmit} />
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { item: admin, isUpdating } = state.inside.admin;
  const { items: types, isFetching: typesIsFetching, id: typesId } = state.articles.types;
  return {
    admin,
    types,
    typesIsFetching,
    typesId,
    isUpdating
  };
};

export default connect(mapStateToProps)(Admin);

Admin.PropTypes = {
  admin: PropTypes.object.isRequired,
  types: PropTypes.array.isRequired,
  typesIsFetching: PropTypes.bool.isRequired,
  typesId: PropTypes.number.isRequired,
  isUpdating: PropTypes.bool.isRequired
};
