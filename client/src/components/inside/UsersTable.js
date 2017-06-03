import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from '../common/Table';
import insideCss from './inside.css';

export default class UsersTable extends Component {
  constructor () {
    super();
    this.state = {
      columns: [{
        title: '用户名',
        key: 'name'
      }, {
        title: '邮箱地址',
        key: 'email'
      }, {
        title: '操作',
        key: 'operate',
        render: (text, record) => (
          <span>
            <a href='#' onClick={e => {
              e.preventDefault();
              this.props.onEdit('userEditModal', record.id);
            }}>编辑</a>
            <a href='#' onClick={this.handleDelete(record.id)}>删除</a>
          </span>
        )
      }]
    };
  }

  handleDelete = id => {
    let _clickTime = 0;
    let _target = null;
    let _timer;
    return e => {
      e.preventDefault();
      if (!_target) {
        _target = $(e.target).popover({
          placement: 'top',
          content: '再次点击确认删除',
          trigger: 'manual'
        });
      }
      if (_clickTime++ === 0) {
        _target.popover('show');
        _timer = setTimeout(() => {
          _target.popover('hide');
          _clickTime = 0;
        }, 3000);
      } else {
        this.props.onDelete(id);
        _target.popover('hide');
        clearTimeout(_timer);
      }
    };
  };

  render () {
    const { isUpdating, users } = this.props;
    return (
      <Table
        style={isUpdating ? {opacity: 0.5, pointEvent: 'none'} : {}}
        className={insideCss.userTable}
        columns={this.state.columns}
        dataSource={users} />
    );
  }
}

UsersTable.PropTypes = {
  users: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool.isRequired
};
