import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal from './Modal'
import Input from './Input'

export default class RegisterModal extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      email: '',
      usernameValidator: null,
      passwordValidator: null,
      emailValidator: null
    };
  }

  getUsernameValidator = usernameValidator => this.setState({ usernameValidator });

  getPasswordValidator = passwordValidator => this.setState({ passwordValidator });

  getEmailValidator = emailValidator => this.setState({ emailValidator });

  handleRegister = () => {
    const { username, password, email, usernameValidator, passwordValidator, emailValidator } = this.state;
    const { onRegister } = this.props;
    const usernamePass = usernameValidator.start();
    const passwordPass = passwordValidator.start();
    const emailPass = emailValidator.start();
    if (usernamePass && passwordPass && emailPass) onRegister(username, password, email)
  };

  render() {
    const { onRegister, visiable, onCancel, isFetching } = this.props;
    return (
      <Modal
        title='注册'
        visiable={visiable}
        onOk={this.handleRegister}
        onCancel={onCancel}
        loading={isFetching}
        size='small'
      >
        <form>
          <Input
            label='用户名'
            name='username'
            type='text'
            placeholder='请输入用户名'
            getValidator={this.getUsernameValidator}
            validates={
              [{
                rule: 'isNotEmpty',
                errMsg: '用户名不能为空'
              }]
            }
            onChange={username => this.setState({ username })}
            maxLength='12'
          />
          <Input
            label='密码'
            name='password'
            type='password'
            placeholder='请输入密码'
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
            onChange={password => this.setState({ password })}
            maxLength='16'
          />
          <Input
            label='邮箱地址'
            name='text'
            type='text'
            placeholder='请输入邮箱地址'
            getValidator={this.getEmailValidator}
            validates={
              [{
                rule: 'isNotEmpty',
                errMsg: '邮箱地址不能为空喔~'
              }, {
                rule: 'isEmail',
                errMsg: '邮箱地址格式有误喔~'
              }]
            }
            onChange={email => this.setState({ email })}
          />
        </form>
      </Modal>
    )
  }
}

RegisterModal.PropTypes = {
  onRegister: PropTypes.func.isRequired,
  visiable: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired
};