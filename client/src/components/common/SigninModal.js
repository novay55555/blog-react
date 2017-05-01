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
      usernamePass: false,
      passwordPass: false
    };
  }

  handleUsernameChange = (username, usernamePass) => this.setState({ username, usernamePass });

  handlePasswordChange = (password, passwordPass) => this.setState({ password, passwordPass });

  render() {
    const { username, password, usernamePass, passwordPass } = this.state;
    const { onSignin, visiable } = this.props;
    return (
      <Modal
        title='登录'
        buttons={[{
          text: '确定',
          handler: () => {
            if (usernamePass && passwordPass) onSignin(username, password);
          }
        }, {
          text: '取消'
        }]}
        visiable={visiable}
        size='small'>
        <form>
          <Input
            label='用户名'
            name='username'
            type='text'
            placeholder='请输入用户名'
            onChange={this.handleUsernameChange}
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
            onChange={this.handlePasswordChange}
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
  visiable: PropTypes.bool.isRequired
};