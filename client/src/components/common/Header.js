import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import SigninModal from './SigninModal'
import RegisterModal from './RegisterModal'
import commonClass from './common.css'

export default class Header extends Component {

  render() {
    const { logo, navs, accountInfo, onSignin, onRegister, activeModal, onModalShow } = this.props;
    console.log(accountInfo)
    return (
      <div className={commonClass.header}>
        <nav className="navbar navbar-inverse">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbarList" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <Link className="navbar-brand" to="/">
                <img src={logo || ''} alt="" />
              </Link>
            </div>
            <div className="collapse navbar-collapse" id="navbarList">
              <ul className="nav navbar-nav">
                {
                  navs.map((nav, i) => (<li key={i}><Link to={nav.path}>{nav.text}</Link></li>))
                }
              </ul>
              {
                accountInfo.isLogin ?
                  <ul className="nav navbar-nav navbar-right">
                    <li>
                      <form className="form-inline">
                        <div className="form-group">
                          <input type="text" className="form-control" name="title" placeholder="Search something..." />
                          <a href="#" className="glyphicon glyphicon-search"></a>
                        </div>
                      </form>
                    </li>
                    <li><a href="#" className="username">{accountInfo.username}</a></li>
                    <li><a href="#">退出</a></li>
                  </ul> :
                  <ul className="nav navbar-nav navbar-right">
                    <li>
                      <form className="form-inline">
                        <div className="form-group">
                          <input type="text" className="form-control" name="title" placeholder="Search something..." />
                          <a href="#" className="glyphicon glyphicon-search"></a>
                        </div>
                      </form>
                    </li>
                    <li>
                      <a href="#" onClick={e => {
                        e.preventDefault();
                        onModalShow('signin');
                      }}>登录</a>
                    </li>
                    <li>
                      <a href="#" onClick={e => {
                        e.preventDefault();
                        onModalShow('register');
                      }}>注册</a>
                    </li>
                  </ul>
              }
            </div>
          </div>
        </nav>
        <SigninModal onSignin={onSignin} visiable={activeModal === 'signin'} />
        <RegisterModal onRegister={onRegister} visiable={activeModal === 'register'} />
      </div>
    )
  }
}

Header.PropTypes = {
  logo: PropTypes.string,
  navs: PropTypes.arrayOf({
    text: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired
  }).isRequired,
  onSignin: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired,
  onModalShow: PropTypes.func.isRequired,
  activeModal: PropTypes.string.isRequired,
  accountInfo: {
    isLogin: PropTypes.bool,
    username: PropTypes.string
  }
};