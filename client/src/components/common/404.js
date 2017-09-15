import React, { Component } from 'react';

export default class Error extends Component {
  constructor () {
    super();
    this.state = {
      progress: 0,
      max: 99.99,
      isBack: false
    };
  }

  timer = null;

  componentDidMount () {
    this.animate();
    this.progressBar.addEventListener('transitionend', () => {
      if (!this.state.isBack) return;
      this.setState({ isBack: false });
      this.animate();
    });
    this.progressBar.addEventListener('webkitTransitionEnd', () => {
      if (!this.state.isBack) return;
      this.setState({ isBack: false });
      this.animate();
    });
  }

  increase = () => {
    const { progress, max } = this.state;
    const random = Math.round(Math.random() * 100) / 100;
    let nextProgress = Math.round((progress + random) * 100) / 100;
    if (nextProgress > max) {
      nextProgress = Math.round((Math.random() * max) * 100) / 100;
      this.setState({ isBack: true, progress: nextProgress });
      return clearTimeout(this.timer);
    } else {
      this.setState({ progress: nextProgress });
      this.animate();
    }
  }

  animate = () => { this.timer = setTimeout(this.increase, 99.8); };

  render () {
    const { progress, isBack } = this.state;
    return (
      <div style={{ textAlign: 'center', padding: '0 15px' }}>
        <h1>Never Mind :P</h1>
        <h4>The longest distance in the world is not just only 404</h4>
        <p>I'll find it out sooner or later</p>
        <div className='progress' style={{ maxWidth: 998, margin: '0 auto', position: 'relative' }}>
          <div ref={ref => { this.progressBar = ref; }} className='progress-bar progress-bar-info' role='progressbar' aria-valuenow={progress} aria-valuemin='0' aria-valuemax='100' style={{ width: `${progress}%` }} />
          <div className='progress-text' style={{ position: 'absolute', top: 0, left: '50%', textAlign: 'center', lineHeight: '20px', transform: 'translateX(-50%)', WebkitTransform: 'translateX(-50%)', color: '#9900cc' }}>
            {isBack ? 'Holy shit :(' : `${progress}%`}
          </div>
        </div>
      </div>
    );
  }
}
