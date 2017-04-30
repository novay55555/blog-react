import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Modal from './Modal'
import commonClass from './common.css'

export default class Header extends Component {

  constructor() {
    super();
    this.state = {
      modalName: '',
      modalVisiable: false
    };
  }

  handleModalShow = modalName => this.setState({ modalName, modalVisiable: true });

  render() {
    const { modalName } = this.state;
    const { logo, navs } = this.props;
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
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <form className="form-inline">
                    <div className="form-group">
                      <input type="text" className="form-control" name="title" placeholder="Search something..." />
                      <a href="#" className="glyphicon glyphicon-search"></a>
                    </div>
                  </form>
                </li>
                {/*<li><a href="#" className="username">用户名用户名用户名</a></li>
                <li><a href="#">退出</a></li>*/}
                <li>
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      this.handleModalShow('signin');
                    }}
                  >
                    登录
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      this.handleModalShow('register');
                    }}
                  >
                    注册
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {
          modalName ? (
            modalName === 'signin' ?
              <Modal
                title='登录'
                buttons={[{
                  text: '确定',
                  handler: () => {
                    alert('登录')
                    this.setState({modalVisiable: false});
                  }
                }, {
                  text: '取消'
                }]}
                visiable={this.state.modalVisiable}
                size='small'
              >
                这是个登录弹窗
              </Modal> :
              <Modal
                title='注册'
                buttons={[{
                  text: '确定',
                  handler: () => alert('注册')
                }, {
                  text: '取消'
                }]}
                visiable={this.state.modalVisiable}
                size='small'
              >
                这是个注册弹窗
              </Modal>
          ) : ''
        }


      </div>
    )
  }
}

Header.PropTypes = {
  logo: PropTypes.string,
  navs: PropTypes.arrayOf({
    text: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired
  }).isRequired
};