import React, { Component } from 'react';
import Container from '../../components/common/Container';
import Author from '../../components/articles/Author';
import articlesCss from '../../components/articles/articles.css';

export default class Article extends Component {
  render () {
    return (
      <Container className={articlesCss.container} isFluid>
        <div className='col-lg-2 col-sm-3'>
          <Author />
        </div>
        <div className='col-lg-10 col-sm-9'>
          {this.props.children}
        </div>
      </Container>
    );
  }
}
