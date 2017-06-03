import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

export default class UserModal extends Component {
  constructor () {
    super();
    this.state = {
      id: '',
      password: '',
      email: '',
      passwordValidator: null,
      emailValidator: null,
      resetEmailComponent: null,
      resetPasswordComponent: null
    };
  }

  componentWillReceiveProps (nextState) {
    if (nextState.visiable && !nextState.loading) {
      this.setState({
        id: nextState.user.id,
        email: nextState.user.email,
        password: ''
      });
    }

    if (!nextState.visiable) {
      this.state.resetEmailComponent && this.state.resetEmailComponent();
      this.state.resetPasswordComponent && this.state.resetPasswordComponent();
    }
  }

  handleEditUser = () => {
    const { id, password, email, passwordValidator, emailValidator } = this.state;
    const passwordPass = passwordValidator.start();
    const emailPass = emailValidator.start();
    if (passwordPass && emailPass) this.props.onEdit(id, password, email);
  };

  render () {
    const { password, email } = this.state;
    const { visiable, loading, onHideModal } = this.props;
    return (
      <Modal
        title='修改用户'
        loading={loading}
        visiable={visiable}
        size='small'
        onOk={this.handleEditUser}
        onCancel={onHideModal} >
        <Input
          label='密码'
          type='password'
          placeholder='请输入用户密码'
          value={password}
          onChange={password => this.setState({ password })}
          onKeyUp={e => e.keyCode === 13 && this.handleEditUser()}
          onReset={resetFn => this.setState({ resetPasswordComponent: resetFn })}
          validates={[
            {
              rule: 'isNotEmpty',
              errMsg: '密码不能为空'
            },
            {
              rule: 'minLength:6',
              errMsg: '密码长度不少于6个'
            }
          ]}
          getValidator={passwordValidator => { this.setState({ passwordValidator }); }} />
        <Input
          label='邮箱'
          placeholder='请输入用户邮箱'
          value={email}
          onChange={email => this.setState({ email })}
          onKeyUp={e => e.keyCode === 13 && this.handleEditUser()}
          onReset={resetFn => this.setState({ resetEmailComponent: resetFn })}
          validates={[
            {
              rule: 'isNotEmpty',
              errMsg: '邮箱不能为空'
            },
            {
              rule: 'isEmail',
              errMsg: '请输入正确的邮箱格式'
            }
          ]}
          getValidator={emailValidator => { this.setState({ emailValidator }); }} />
      </Modal>
    );
  }
}

UserModal.PropTypes = {
  user: PropTypes.objectOf({
    id: PropTypes.number.isRequired,
    password: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,
  visiable: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onHideModal: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};
