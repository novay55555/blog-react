import React, { Component } from 'react';
import commonClass from './common.css';
export default class Footer extends Component {
  render () {
    return (
      <div className={commonClass.footer}>
        <h5>Powered by&nbsp;
          <a href='https://facebook.github.io/react/'>React</a>&nbsp;
          <a href='http://getbootstrap.com/' target='_blank'>Bootstrap</a>&nbsp;
          <a href='https://jquery.com/' target='_blank'>jQuery</a>&nbsp;
          <a href='http://expressjs.com/' target='_blank'>Express</a>
        </h5>
        <p>Coding with my faith!</p>
      </div>
    );
  }
}
