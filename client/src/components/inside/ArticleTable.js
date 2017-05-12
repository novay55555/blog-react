import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Table from '../../components/common/Table'
import insideCss from './inside.css'

export default class ArticleTable extends Component {
  constructor() {
    super();
    this.state = {
      columns: [{
        title: '标题',
        key: 'title'
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
        render: () => (
          <span>
						<a href="#">编辑</a>
						<a href="#">删除</a>
					</span>
        )
      }]
    }
  }
  render() {
    const { items } = this.props;
    return (
      <div>
				<Table className={insideCss.articles} columns={this.state.columns} dataSource={items} />
			</div>
    )
  }
}