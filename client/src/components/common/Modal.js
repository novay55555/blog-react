import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Modal extends Component {

  constructor() {
    super();
    this.state = {
      container: null,
      sizeClass: {
        large: 'modal-lg',
        small: 'modal-sm'
      }
    };
  }

  componentWillReceiveProps(nextState) {
    nextState.visiable ? this.show() : this.hide();
  }

  componentDidMount() {
    this.props.visiable && this.show();
  }

  hide = () => $(this.container).modal('hide');

  show = () => $(this.container).modal('show');

  render() {
    const { title, buttons, visiable, size } = this.props;
    return (
      <div ref={modal => this.container = modal} className="modal fade" tabIndex="-1">
        <div className={`modal-dialog ${size ? this.state.sizeClass[size] : ''}`}>
          <div className="modal-content">
            {
              title ?
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title">{title}</h4>
                </div> : ''
            }
            <div className="modal-body">
              {this.props.children}
            </div>
            {
              buttons ?
                <div className="modal-footer">
                  {
                    buttons.reverse().map((button, i, array) => (
                      <button
                        type="button"
                        key={i}
                        className={`btn ${i === 0 ? 'btn-default' : 'btn-primary'}`}
                        onClick={button.handler || this.hide}
                      >
                        {button.text}
                      </button>
                    ))
                  }
                </div> : ''
            }
          </div>
        </div>
      </div>
    )
  }
}

Modal.PropTypes = {
  title: PropTypes.string,
  buttons: PropTypes.arrayOf({
    text: PropTypes.string.isRequired,
    handler: PropTypes.func
  }),
  visiable: PropTypes.bool.isRequired,
  size: PropTypes.string
};