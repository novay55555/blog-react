import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { Link } from 'react-router';
import Table from '../../components/common/Table';
import insideCss from './inside.css';

export default class ArticleTable extends Component {
  constructor () {
    super();
    this.state = {
      columns: [{
        title: '标题',
        key: 'title',
        render: (text, record) => (<Link to={record.link}>{record.title}</Link>)
      }, {
        title: '文章类型',
        key: 'articleType'
      }, {
        title: '发表时间',
        key: 'date'
      }, {
        title: '文章描述',
        key: 'description'
      }, {
        title: '操作',
        key: 'operate',
        render: (text, record) => (
          <span>
            <a href='#' onClick={e => {
              e.preventDefault();
              this.props.onEdit(record.id);
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
    const { items, isUpdating } = this.props;
    return (
      <div style={isUpdating ? { opacity: 0.5, pointerEvents: 'none' } : {}}>
        <Table className={insideCss.articles} columns={this.state.columns} dataSource={items} />
      </div>
    );
  }
}

ArticleTable.PropTypes = {
  items: PropTypes.array.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};
