import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Panel from '../common/Panel';
import ArticleTypeList from '../common/ListGroupLink';
import articlesCss from './articles.css';

export default class Aside extends Component {
  render () {
    const { lists, isFetching } = this.props;
    return (
      <Panel className={articlesCss.types} title='文章分类'>
        {
          isFetching ? <div className={articlesCss.loading} /> : <ArticleTypeList className='animated fadeIn' lists={lists} />
        }
      </Panel>
    );
  }
}

Aside.PropTypes = {
  lists: PropTypes.arrayOf({
    text: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    count: PropTypes.number
  }).isRequired
};
