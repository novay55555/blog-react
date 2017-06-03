import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

export default class Pagination extends Component {
  selectPage = pageObj => {
    const { i, maxPage, currentPage } = pageObj;
    let { btn } = pageObj;
    if (typeof btn !== 'number') {
      if (i === 1) {
        btn = currentPage - 5 > 1 ? currentPage - 5 : 1;
      } else {
        btn = currentPage + 5 > maxPage ? maxPage : currentPage + 5;
      }
    }
    this.setState({
      currentPage: btn
    });
  };

  getCurrentURL = pageObj => {
    const { i, maxPage, currentPage, baseURL } = pageObj;
    let { btn } = pageObj;
    if (typeof btn !== 'number') {
      if (i === 1) {
        btn = currentPage - 5 > 1 ? currentPage - 5 : 1;
      } else {
        btn = currentPage + 5 > maxPage ? maxPage : currentPage + 5;
      }
    }
    return `${baseURL}/${btn}`;
  };

  getCurrentPage = pageObj => {
    const { i, maxPage, currentPage } = pageObj;
    let { btn } = pageObj;
    if (typeof btn !== 'number') {
      if (i === 1) {
        btn = currentPage - 5 > 1 ? currentPage - 5 : 1;
      } else {
        btn = currentPage + 5 > maxPage ? maxPage : currentPage + 5;
      }
    }
    return btn;
  };

  createButtons (maxPage) {
    const { currentPage } = this.props;
    let arr = [];
    if (maxPage <= 1) {
      arr.push(1);
    } else if (maxPage < 10) {
      for (let i = 1; i <= maxPage; i++) {
        arr.push(i);
      }
    } else {
      if (currentPage < 5) {
        arr.push(1, 2, 3, 4, 5, '...', maxPage);
      } else if (currentPage >= 5 && currentPage <= maxPage - 4) {
        arr.push(1, '...', currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, '...', maxPage);
      } else {
        arr.push(1, '...', maxPage - 4, maxPage - 3, maxPage - 2, maxPage - 1, maxPage);
      }
    }
    return arr;
  }

  render () {
    const { maxPage, currentPage, onClick, baseURL, ...props } = this.props;
    const btnArray = this.createButtons(maxPage);
    return (
      <ul className='pagination' {...props}>
        {btnArray.map((btn, i) => {
          const pageObj = { btn, i, maxPage, currentPage, baseURL };
          const currentURL = baseURL ? this.getCurrentURL(pageObj) : '';
          return btn === currentPage
            ? <li key={'page' + i} className='active'><span>{btn}<span
              className='sr-only'>(current)</span></span>
            </li>
            : <li key={'page' + i}><Link to={currentURL || '#'} onClick={e => {
              onClick && e.preventDefault();
              onClick && onClick.call(onClick, this.getCurrentPage(pageObj));
              e.target.blur();
              this.selectPage(pageObj);
            }}>{btn}</Link></li>;
        })}
      </ul>
    );
  }
}

Pagination.PropTypes = {
  maxPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  baseURL: PropTypes.string,
  onClick: PropTypes.func
};
