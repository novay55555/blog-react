import React, { Component } from 'react';
import PropTypes from 'prop-types';
import commonCss from './common.css';

export default class Slidebar extends Component {
  constructor () {
    super();
    this.state = {
      liHeight: 0,
      liPaddingTop: 0
    };
  }

  componentDidMount () {
    const $li = $(this.container).find('li');
    this.setState({
      liHeight: $li.outerHeight(),
      liPaddingTop: parseInt($li.css('padding'))
    });
    document.addEventListener('click', this.hideFeatureChilren);
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.hideFeatureChilren);
  }

  handleClick = e => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const $target = $(e.target);
    const $parent = $target.parent();
    $parent.toggleClass('active').siblings().removeClass('active');
  }

  hideFeatureChilren = e => {
    const $parent = $(e.target).parents('li').eq(0);
    if ($parent.data('elem') !== '_feature') {
      const $li = $(this.container).find('li');
      $li.removeClass('active');
    }
  }

  toggleSlidebar = e => {
    const $target = $(e.target);
    $target.toggleClass('active').siblings().toggleClass('active');
  }

  render () {
    const { liHeight, liPaddingTop } = this.state;
    const { features, className } = this.props;
    return (
      <div ref={ref => { this.container = ref; }} className={className || ''}>
        <div className={commonCss.slidebar}>
          <ul>
            {
              features.map((feature, i) => (
                <li key={i} data-elem='_feature'>
                  <span className={`glyphicon ${feature.btn}`} onClick={feature.handler || this.handleClick} />
                  <div className='children' style={{ top: i === 0 ? i : i * liHeight + liPaddingTop }}>
                    {feature.content && feature.content()}
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
        <span
          className={`glyphicon glyphicon-align-justify ${commonCss.btnSlidebarMobile}`} onClick={this.toggleSlidebar} />
      </div>
    );
  }
}

Slidebar.PropTypes = {
  className: PropTypes.string,
  features: {
    btn: PropTypes.string.isRequired,
    content: PropTypes.func,
    handler: PropTypes.func
  }.isRequired
};
