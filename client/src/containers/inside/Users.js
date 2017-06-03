import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Search from '../../components/inside/Search';
import Table from '../../components/inside/UsersTable';
import Error from '../../components/common/Error';
import Loading from '../../components/common/Loading';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/inside/UserModal';
import { fetchUsers, fetchUsersByName, getEditUserData, fetchEditUser, fetchDeleteUser } from '../../actions/inside';
import { showModal, hideModal } from '../../actions/account';

class Users extends Component {
  componentWillMount () {
    this.props.dispatch(fetchUsers());
  }

  handleGetUsers = page => this.props.dispatch(fetchUsers(page));

  handleGetUsersByName = (name, page) => this.props.dispatch(fetchUsersByName(name, page));

  handleShowModal = (modalName, id) => {
    this.props.dispatch(showModal(modalName));
    this.props.dispatch(getEditUserData(id));
  };

  handleHideModal = () => this.props.dispatch(hideModal());

  handleEditUser = (id, password, email) => this.props.dispatch(fetchEditUser(id, password, email, this.handleHideModal));

  handleDeleteUser = id => this.props.dispatch(fetchDeleteUser(id));

  render () {
    const { items, page, total, isFetching, isEditing, isDeleting, errMsg, searchName, activeModal, editUser } = this.props;
    return (
      <div>
        <Search placeholder='Search users...' onSearch={name => this.handleGetUsersByName(name)} />
        {
          errMsg ? <Error msg={errMsg} />
            : (isFetching ? <Loading />
              : <div>
                <Table users={items} onEdit={this.handleShowModal} onDelete={this.handleDeleteUser} isUpdating={isDeleting} />
                <div style={{ textAlign: 'center' }}>
                  <Pagination maxPage={total} currentPage={page} onClick={page => searchName ? this.handleGetUsersByName(searchName, page) : this.handleGetUsers(page)} />
                </div>
              </div>)
        }
        <Modal
          visiable={activeModal === 'userEditModal'}
          user={editUser}
          onHideModal={this.handleHideModal}
          onEdit={this.handleEditUser}
          loading={isEditing} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { items, page, total, isFetching, isEditing, isDeleting, errMsg, searchName, current: editUser } = state.inside.users;
  const { activeModal } = state.account;
  return {
    items,
    page,
    total,
    isFetching,
    isEditing,
    isDeleting,
    errMsg,
    searchName,
    activeModal,
    editUser
  };
};

export default connect(mapStateToProps)(Users);
