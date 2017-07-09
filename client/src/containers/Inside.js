import React, { Component } from 'react';
import Header from '../components/common/HeaderInside';
import Footer from '../components/common/Footer';
import Container from '../components/common/Container';
import { NotificationContainer } from 'react-notifications';
export default class Inside extends Component {
  render () {
    return (
      <div>
        <Header
          logo='/img/kato.jpg'
          navs={[
            {
              text: '文章管理',
              path: '/inside-world/articles'
            },
            {
              text: '用户管理',
              path: '/inside-world/users'
            },
            {
              text: '博客管理',
              path: '/inside-world/admin'
            }
          ]} />
        <Container style={{paddingTop: 72}}>
          {this.props.children}
        </Container>
        <Footer />
        <NotificationContainer />
      </div>
    );
  }
}
