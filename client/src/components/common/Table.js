import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Table extends Component {
  render () {
    const { columns, dataSource, className, ...props } = this.props;
    return (
      <table className={`table ${className}`} {...props}>
        <thead>
          <tr>
            {
							columns.map(column => <th key={column.key}>{column.title}</th>)
						}
          </tr>
        </thead>

        <tbody>
          {
						dataSource.map(data => (
  <tr key={data.id}>
    {
									columns.map(column => (
  <td key={column.key}>
    {
												column.render ? column.render(data[column.key], data) : data[column.key]
											}
  </td>
									))
								}
  </tr>
						))
					}
        </tbody>
      </table>
    );
  }
}

Table.PropTypes = {
  className: PropTypes.string,
  columns: PropTypes.arrayOf({
    title: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    render: PropTypes.func
  }).isRequired,
  dataSource: PropTypes.arrayOf({
    key: PropTypes.string.isRequired
  }).isRequired
};
