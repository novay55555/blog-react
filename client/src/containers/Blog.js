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
    const {accountInfo, activeModal} = this.props;
    return (
      <div>
        <Header
          logo='/build/img/kato.jpg'
          navs={[
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
  const { isLogin, username, activeModal } = state.account;
  return {
    accountInfo: {
      isLogin,
      username
    },
    activeModal
  };
};

export default connect(mapStateToProps)(Blog)