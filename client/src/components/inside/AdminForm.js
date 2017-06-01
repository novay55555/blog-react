import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Input from '../common/Input'
import insideCss from './inside.css'
import { notification } from '../../lib/common'

export default class AdminForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: props.account || '',
      password: '',
      email: props.email || '',
      accountValidator: null,
      emailValidator: null,
      types: props.types || [],
      typeValue: '',
      typesId: props.typesId || ''
    };
  }

  componentWillReceiveProps(nextState) {
    if (nextState.account || nextState.types.length > 0) {
      this.setState({
        account: nextState.account,
        email: nextState.email,
        types: nextState.types,
        typesId: nextState.typesId
      });
    }
  }

  addType = name => {
    const { types } = this.state;
    types.push(name);
    this.setState({ types });
  };

  deleteType = name => {
    const { types } = this.state;
    types.splice(types.indexOf(name), 1);
    this.setState({ types });
  };

  handleAddClick = e => {
    e.preventDefault();
    $(e.target).closest('.types-add').addClass('active');
  };

  handleSubmit = () => {
    const { account, password, email, accountValidator, emailValidator, types, typesId } = this.state;
    const [accountIsPass, emailIsPass] = [accountValidator.start(), emailValidator.start()];
    if (accountIsPass && emailIsPass) {
      this.props.onSubmit({
        admin: {
          name: account,
          password,
          email
        },
        types: {
          id: typesId,
          data: types
        }
      })
    }
  }

  render() {
    const { account, password, email, types, typeValue } = this.state;
    const { isFetching, isUpdating } = this.props;
    return (
      <form
        style={isFetching ? { opacity: .5, pointerEvents: 'none' } : {}}
        className={insideCss.adminForm}
        onSubmit={e => e.preventDefault()}
        onKeyDown={e => e.keyCode === 13 && e.preventDefault()} >
        <Input
          label='管理员帐号'
          placeholder='管理员帐号'
          value={account}
          validates={
            [
              {
                rule: 'isNotEmpty',
                errMsg: '管理员帐号不能为空'
              }
            ]
          }
          getValidator={accountValidator => this.setState({ accountValidator })}
          onChange={account => this.setState({ account })} />
        <Input
          label='管理员密码'
          type='password'
          placeholder='管理员密码'
          maxLength='12'
          onChange={password => this.setState({ password })} />
        <Input
          label='管理员邮箱'
          placeholder='管理员邮箱'
          value={email}
          validates={
            [
              {
                rule: 'isNotEmpty',
                errMsg: '管理员邮箱不能为空'
              },
              {
                rule: 'isEmail',
                errMsg: '邮箱格式不正确'
              }
            ]
          }
          getValidator={emailValidator => this.setState({ emailValidator })}
          onChange={email => this.setState({ email })} />
        <div className="form-group">
          <label htmlFor="">文章类型</label>
          <p className="types-add">
            <input type="text" className='form-control' placeholder='输入文章类型, 回车以保存' value={typeValue}
              onChange={e => this.setState({ typeValue: e.target.value })}
              onKeyUp={e => {
                if (e.keyCode === 13) {
                  if (!typeValue.trim()) return notification({ type: 'info', message: '文章类型不能为空' });
                  if (types.indexOf(typeValue) !== -1) return notification({ type: 'info', message: '重复的类型' });
                  this.addType(typeValue);
                  this.setState({ typeValue: '' });
                }
              }} />
            <a href="#" onClick={this.handleAddClick}>新增类型</a>
          </p>
          <p>
            {
              types.map((type, i) => <span className='label' key={i}>{type}<a className='glyphicon glyphicon-remove' href="#" onClick={e => {
                e.preventDefault();
                this.deleteType(type);
              }} /></span>)
            }
          </p>
        </div>
        <div className='form-group'>
          <button
            style={isUpdating ? { opacity: .5, pointerEvents: 'none' } : {}}
            className='btn btn-info'
            onClick={this.handleSubmit}>
            {isUpdating ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    )
  }
}

AdminForm.PropTypes = {
  account: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  types: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  onSubmit: PropTypes.func.isRequired
};