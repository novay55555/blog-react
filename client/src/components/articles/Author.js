import React, { Component } from 'react';
import PropTypes from 'prop-types';
import commonCss from '../common/common.css';
import articlesCss from './articles.css';

export default class Author extends Component {
  render () {
    const { className, photo, name, job, intro, isFetching, errMsg } = this.props;
    return (
      <div className={`${articlesCss.author} ${className || ''}`}>
        {
          isFetching ? <div className={commonCss.loading} style={{width: 100, height: 50, display: 'inline-block'}} />
            : (
              errMsg ? <h3>{errMsg}</h3>
                : <div>
                  <div className='photo'>
                    <img src={photo} alt={name} />
                  </div>
                  <div className='intro'>
                    <p>{name}</p>
                    <p>{job}</p>
                    <p>{intro}</p>
                  </div>
                </div>
            )
        }
      </div>
    );
  }
}

Author.PropTypes = {
  photo: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  job: PropTypes.string.isRequired,
  intro: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  errMsg: PropTypes.string
};
