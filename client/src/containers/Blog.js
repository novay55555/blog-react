import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ContainerFluid from '../components/common/ContainerFluid'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import { fetchRegister, fetchSignin, showModal, hideModal } from '../actions/account'

class Blog extends Component {

  handleRegister = (username, password, email) => this.props.dispatch(fetchRegister(username, password, email, this.handleModalHide));

  handleSignin = (username, password) => this.props.dispatch(fetchSignin(username, password, this.handleModalHide));

  handleModalShow = modalName => this.props.dispatch(showModal(modalName));

  handleModalHide = () => this.props.dispatch(hideModal());

  render() {
    const { accountInfo, activeModal, isFetching } = this.props;
    return (
      <div>
        <Header
          logo='/build/img/kato.jpg'
          navs={
            accountInfo.isAdmin ?
              [
                {
                  text: '博客',
                  path: '/'
                },
                {
                  text: 'スタディー',
                  path: '/study'
                },
                {
                  text: '里世界',
                  path: '/inside-world'
                }
              ] : [
                {
                  text: '博客',
                  path: '/'
                },
                {
                  text: 'スタディー',
                  path: '/study'
                }
              ]}
          onSignin={this.handleSignin}
          onRegister={this.handleRegister}
          onModalShow={this.handleModalShow}
          onModalHide={this.handleModalHide}
          activeModal={activeModal}
          accountInfo={accountInfo}
          isFetching={isFetching}
        />
        <main>
          {this.props.children}
        </main>
        <Footer />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { isLogin, username, activeModal, isAdmin, isFetching } = state.account;
  return {
    accountInfo: {
      isLogin,
      username,
      isAdmin
    },
    activeModal,
    isFetching
  };
};

export default connect(mapStateToProps)(Blog)

Blog.PropTypes = {
  accountInfo: {
    isLogin: PropTypes.bool,
    username: PropTypes.string,
    isAdmin: PropTypes.bool
  },
  activeModal: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired
}