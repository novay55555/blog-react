import React, { Component } from 'react'
import commonClass from './common.css'
export default class Footer extends Component {
  render() {
    return (
      <div className={commonClass.footer}>
        <h5>Powered by <a href="http://www.bootcss.com/" target="_blank">Bootstrap</a>&#38;<a href="https://jquery.com/" target="_blank">jQuery</a>&#38;<a href="http://expressjs.com/" target="_blank">Express</a></h5>
        <p>Coding with my faith!</p>
      </div>
    )
  }
}