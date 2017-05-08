import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal from './Modal'
import Input from './Input'

export default class SigninModal extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      usernameValidator: null,
      passwordValidator: null
    };
  }

  getUsernameValidator = usernameValidator => this.setState({ usernameValidator });

  getPasswordValidator = passwordValidator => this.setState({ passwordValidator });

  handleSignin = () => {
    const { username, password, usernameValidator, passwordValidator } = this.state;
    const { onSignin } = this.props;
    const usernamePass = usernameValidator.start();
    const passwordPass = passwordValidator.start();
    if (usernamePass && passwordPass) onSignin(username, password);
  };

  render() {
    const { visiable, onCancel, isFetching } = this.props;
    return (
      <Modal
        title='登录'
        visiable={visiable}
        onOk={this.handleSignin}
        onCancel={onCancel}
        loading={isFetching}
        size='small'>
        <form>
          <Input
            label='用户名'
            name='username'
            type='text'
            placeholder='请输入用户名'
            onChange={username => this.setState({ username })}
            onKeyUp={e => e.keyCode === 13 && this.handleSignin()}
            getValidator={this.getUsernameValidator}
            validates={
              [{
                rule: 'isNotEmpty',
                errMsg: '用户名不能为空'
              }]
            }
            maxLength='12'
          />
          <Input
            label='密码'
            name='password'
            type='password'
            placeholder='请输入密码'
            onChange={password => this.setState({ password })}
            onKeyUp={e => e.keyCode === 13 && this.handleSignin()}
            getValidator={this.getPasswordValidator}
            validates={
              [{
                rule: 'isNotEmpty',
                errMsg: '密码不能为空'
              }, {
                rule: 'minLength:6',
                errMsg: '密码长度不少于6个'
              }]
            }
            maxLength='16'
          />
        </form>
      </Modal>
    )
  }
}

SigninModal.PropTypes = {
  onSignin: PropTypes.func.isRequired,
  visiable: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired
};