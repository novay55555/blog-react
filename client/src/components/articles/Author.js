import React, { Component } from 'react';
import PropTypes from 'prop-types';
import articlesCss from './articles.css';

export default class Author extends Component {
  constructor () {
    super();
    this.state = {  // TODO: 以后后台配置
      photo: '/img/kato.jpg',
      username: 'gunhawk',
      job: 'Frontend developer',
      words: 'Coding is part of my life, 加藤恵は大好き＝。＝',
      connect: [{github: 'https://github.com/novay55555'}]
    };
  }
  render () {
    const {photo, username, job, words} = this.state;
    const { className } = this.props;
    return (
      <div className={`${articlesCss.author} ${className || ''}`}>
        <div className='photo'>
          <img src={photo} alt={username} />
        </div>
        <div className='intro'>
          <p>{username}</p>
          <p>{job}</p>
          <p>{words}</p>
        </div>
      </div>
    );
  }
}

Author.PropTypes = {
  photo: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  job: PropTypes.string.isRequired,
  words: PropTypes.string.isRequired
};
