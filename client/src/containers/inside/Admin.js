import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Form from '../../components/inside/AdminForm';
import { fetchArticleTypes } from '../../actions/articles';
import { fetchUpdateBlog, fetchAdmin, fetchUploadAdminAvatar } from '../../actions/inside';

class Admin extends Component {
  componentWillMount () {
    const { admin, types, dispatch } = this.props;
    if (!admin.name) dispatch(fetchAdmin());
    if (types.length === 0) dispatch(fetchArticleTypes());
  }

  handleSubmit = updateData => this.props.dispatch(fetchUpdateBlog(updateData));

  handleUpload = (id, avatar) => this.props.dispatch(fetchUploadAdminAvatar(id, avatar));

  render () {
    const { admin, types, typesIsFetching, typesId, isUpdating, isUploading } = this.props;
    return (
      <div>
        {
          Object.keys(admin).length === 0 ? ''
            : <Form
              account={admin.name}
              email={admin.email}
              job={admin.job}
              intro={admin.intro}
              types={types}
              typesId={typesId}
              isFetching={typesIsFetching}
              isUpdating={isUpdating}
              isUploading={isUploading}
              photo={admin.photoUrl}
              id={admin.id}
              onSubmit={this.handleSubmit}
              onUpload={this.handleUpload} />
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { item: admin, isUpdating, isUploading } = state.inside.admin;
  const { items: types, isFetching: typesIsFetching, id: typesId } = state.articles.types;
  return {
    admin,
    types,
    typesIsFetching,
    typesId,
    isUpdating,
    isUploading
  };
};

export default connect(mapStateToProps)(Admin);

Admin.PropTypes = {
  admin: PropTypes.object.isRequired,
  types: PropTypes.array.isRequired,
  typesIsFetching: PropTypes.bool.isRequired,
  typesId: PropTypes.number.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  isUploading: PropTypes.bool.isRequired
};
