import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Slidebar from '../components/common/Slidebar';
import ArticleTypesList from '../components/common/ListGroupLink';
import Search from '../components/common/SearchInput';
import { showModal, fetchSignout } from '../actions/account';
import { fetchArticleTypes, linkToSearchPath } from '../actions/articles';

class SlidebarBlog extends Component {
  componentWillMount () {
    this.props.types.length === 0 && this.props.dispatch(fetchArticleTypes());
  }

  makeFeatures = (types, accountInfo, isFetching) => {
    const features = [
      {
        btn: 'glyphicon-folder-open',
        content: () => {
          types.unshift({ link: '/', text: '/' });
          return (
            <ArticleTypesList lists={types} />
          );
        }
      },
      {
        btn: 'glyphicon-search',
        content: () => {
          return (
            <Search
              className='feature-search'
              placeholder='Search something...'
              onSearch={value => linkToSearchPath(value)}
              onKeyUp={e => e.keyCode === 13 && linkToSearchPath(e.target.value)} />
          );
        }
      },
      {
        btn: 'glyphicon-send',
        content: () => {
          return (
            <div className='list-group'>
              <Link className='list-group-item' to='/study'>スタディー</Link>
              {
                accountInfo.isAdmin ? <Link className='list-group-item' to='/inside-world'>里世界</Link> : ''
              }
            </div>
          );
        }
      },
      {
        btn: 'glyphicon-th',
        content: () => {
          return (
            <div className='list-group'>
              {
                !accountInfo.isLogin
                  ? <div>
                    <a className='list-group-item' href='#' onClick={e => {
                      e.preventDefault();
                      this.handleModalShow('signin');
                    }}>登录</a>
                    <a className='list-group-item' href='#' onClick={e => {
                      e.preventDefault();
                      this.handleModalShow('register');
                    }}>注册</a>
                  </div> : ''
              }
              {
                accountInfo.isLogin
                  ? <div>
                    <a href='#' className='list-group-item'>{accountInfo.username}</a>
                    <a
                      href='#'
                      className='list-group-item'
                      style={isFetching ? { pointerEvents: 'none' } : {}}
                      onClick={e => {
                        e.preventDefault();
                        this.handleSignout();
                      }}>{isFetching ? '正在登出...' : '登出'}</a>
                  </div> : ''
              }
            </div>
          );
        }
      }
    ];
    return features;
  }

  handleModalShow = modalName => this.props.dispatch(showModal(modalName));

  handleSignout = () => this.props.dispatch(fetchSignout());

  render () {
    const { types, accountInfo, isFetching } = this.props;
    return (
      <Slidebar features={this.makeFeatures(types, accountInfo, isFetching)} />
    );
  }
}

const mapStateToProps = state => {
  const { isLogin, username, isAdmin, isFetching } = state.account.user;
  const { items: types } = state.articles.types;
  return {
    accountInfo: {
      isLogin,
      username,
      isAdmin
    },
    isFetching,
    types: types.map(type => ({
      link: `/articles/${type}/1`,
      text: type
    }))
  };
};

export default connect(mapStateToProps)(SlidebarBlog);

SlidebarBlog.PropTypes = {
  accountInfo: {
    isLogin: PropTypes.bool,
    username: PropTypes.string,
    isAdmin: PropTypes.bool
  }.isRequired,
  types: PropTypes.arrayOf({
    link: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired,
  isFetching: PropTypes.bool.isRequired
};
