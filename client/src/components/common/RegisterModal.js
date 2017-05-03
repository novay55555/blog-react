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
      usernamePass: false,
      passwordPass: false,
      emailPass: false
    };
  }

  render() {
    const { username, password, email, usernamePass, passwordPass, emailPass } = this.state;
    const { onRegister, visiable, onCancel, isFetching } = this.props;
    return (
      <Modal
        title='注册'
        visiable={visiable}
        onOk={() => { if (usernamePass && passwordPass && emailPass) onRegister(username, password, email) }}
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
            validates={
              [{
                rule: 'isNotEmpty',
                errMsg: '用户名不能为空'
              }]
            }
            onChange={(username, usernamePass) => this.setState({ username, usernamePass })}
            maxLength='12'
          />
          <Input
            label='密码'
            name='password'
            type='password'
            placeholder='请输入密码'
            validates={
              [{
                rule: 'isNotEmpty',
                errMsg: '密码不能为空'
              }, {
                rule: 'minLength:6',
                errMsg: '密码长度不少于6个'
              }]
            }
            onChange={(password, passwordPass) => this.setState({ password, passwordPass })}
            maxLength='16'
          />
          <Input
            label='邮箱地址'
            name='text'
            type='text'
            placeholder='请输入邮箱地址'
            validates={
              [{
                rule: 'isNotEmpty',
                errMsg: '邮箱地址不能为空喔~'
              }, {
                rule: 'isEmail',
                errMsg: '邮箱地址格式有误喔~'
              }]
            }
            onChange={(email, emailPass) => this.setState({ email, emailPass })}
          />
        </form>
      </Modal>
    )
  }
}

RegisterModal.PropTypes = {
  onRegister: PropTypes.func.isRequired,
  visiable: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired
};