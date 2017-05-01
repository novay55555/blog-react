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
      usernameValidate: null,
      passwordValidate: null,
      emailValidate: null
    };
  }

  render() {
    const { username, password, email, usernameValidate, passwordValidate, emailValidate } = this.state;
    const { onRegister } = this.props;
    return (
      <Modal
        title='注册'
        buttons={[{
          text: '确定',
          handler: () => {
            if (!usernameValidate() && !passwordValidate() && !emailValidate()) onRegister(username, password, email);
          }
        }, {
          text: '取消'
        }]}
        visiable={this.props.visiable}
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
            notifyPass={validator => this.setState({
              username: validator.getValue(),
              usernameValidate: () => validator.start()
            })}
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
            notifyPass={validator => this.setState({
              password: validator.getValue(),
              passwordValidate: () => validator.start()
            })}
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
            notifyPass={validator => this.setState({
              email: validator.value,
              emailValidate: () => validator.start()
            })}
          />
        </form>
      </Modal>
    )
  }
}