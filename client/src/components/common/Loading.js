import React, { Component } from 'react';

export default class Loading extends Component {
  render () {
    return (
      <div>
        <h3 className='animated infinite bounce' style={{textAlign: 'center', lineHeight: '3em'}}>Now loading...</h3>
      </div>
    );
  }
}
