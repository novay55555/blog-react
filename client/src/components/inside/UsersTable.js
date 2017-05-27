import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Search from '../common/SearchInput'
import Table from '../common/Table'
import insideCss from './inside.css'

export default class UsersTable extends Component {
  constructor() {
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
            <a href="#" onClick={e => {
              e.preventDefault();
              this.props.onEdit('userEditModal', record.id);
              }}>编辑</a>
            <a href="#">删除</a>
          </span>
        )
      }]
    }
  }
  render() {
    return (
      <Table className={insideCss.userTable} columns={this.state.columns} dataSource={this.props.users} />
    )
  }
}