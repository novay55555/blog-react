import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Slidebar from './SlidebarBlog';
import SigninModal from '../components/common/SigninModal';
import RegisterModal from '../components/common/RegisterModal';
import Footer from '../components/common/Footer';
import { NotificationContainer } from 'react-notifications';
import { fetchRegister, fetchSignin, fetchSignout, hideModal, fetchSession } from '../actions/account';
import { linkToSearchPath } from '../actions/articles';

class Blog extends Component {
  componentWillMount () {
    this.props.dispatch(fetchSession());
  }

  handleRegister = (username, password, email) => this.props.dispatch(fetchRegister(username, password, email, this.handleModalHide));

  handleSignin = (username, password) => this.props.dispatch(fetchSignin(username, password, this.handleModalHide));

  handleSignout = () => this.props.dispatch(fetchSignout());

  handleModalHide = () => this.props.dispatch(hideModal());

  handleSearch = title => linkToSearchPath(title);

  render () {
    const { activeModal, isFetching } = this.props;
    return (
      <div>
        <Slidebar />
        <main>
          {this.props.children}
        </main>
        <Footer />
        <SigninModal
          onSignin={this.handleSignin}
          onCancel={this.handleModalHide}
          visiable={activeModal === 'signin'}
          isFetching={isFetching} />
        <RegisterModal
          onRegister={this.handleRegister}
          onCancel={this.handleModalHide}
          visiable={activeModal === 'register'}
          isFetching={isFetching} />
        <NotificationContainer />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { activeModal, isFetching } = state.account;
  return {
    activeModal,
    isFetching
  };
};

export default connect(mapStateToProps)(Blog);

Blog.PropTypes = {
  activeModal: PropTypes.string.isRequired
};
