import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Search from '../../components/inside/Search'
import Table from '../../components/inside/UsersTable'
import Error from '../../components/common/Error'
import Loading from '../../components/common/Loading'
import Pagination from '../../components/common/Pagination'
import { fetchUsers } from '../../actions/inside'
class Users extends Component {
  componentWillMount() {
    this.props.dispatch(fetchUsers());
  }

  componentWillReceiveProps(nextState) {
    if (this.props.page !== nextState.page) this.props.dispatch(fetchUsers(nextState.page));
  }

  handleGetUsers = page => this.props.dispatch(fetchUsers(page));

  render() {
    const { items, page, total, isFetching, isEditing, isDeleting, errMsg } = this.props;
    return (
      <div>
        <Search placeholder='Search users...' />
        {
          errMsg ? <Error msg={errMsg} />
            : (isFetching ? <Loading /> :
              <div>
                <Table users={items} />
                <div style={{ textAlign: 'center' }}>
                  <Pagination maxPage={total} currentPage={page} onClick={page => this.handleGetUsers(page)} />
                </div>
              </div>)
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { items, page, total, isFetching, isEditing, isDeleting, errMsg } = state.inside.users;
  return {
    items,
    page,
    total,
    isFetching,
    isEditing,
    isDeleting,
    errMsg
  };
};

export default connect(mapStateToProps)(Users)