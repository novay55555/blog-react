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
    if (this.props.visiable !== nextState.visiable) nextState.visiable ? this.show() : this.hide();
  }

  componentDidMount() {
    this.props.visiable && this.show();
    $(this.container).on('hidden.bs.modal', () => {
      if (this.props.visiable) this.props.onCancel && this.props.onCancel();
    });
  }

  hide = () => $(this.container).modal('hide');

  show = () => $(this.container).modal('show');

  render() {
    const { className, title, size, onOk, okText, cancelText, loading } = this.props;
    return (
      <div ref={modal => this.container = modal} className={`modal fade ${className}`} tabIndex="-1">
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
            <div className="modal-footer">
              <button
                type="button"
                className={`btn btn-default`}
                onClick={this.hide}
              >
                {cancelText || '取消'}
              </button>
              {
                onOk ?
                  <button
                    type="button"
                    className={`btn btn-primary`}
                    onClick={onOk || this.hide}
                    style={loading ? { opacity: .5, pointerEvents: 'none' } : {}}
                  >
                    {okText || '确定'}
                  </button> : ''
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Modal.PropTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  visiable: PropTypes.bool.isRequired,
  size: PropTypes.string,
  onOK: PropTypes.func,
  onCancel: PropTypes.func,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  loading: PropTypes.bool
};