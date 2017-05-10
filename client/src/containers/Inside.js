import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Header from '../components/common/HeaderInside'
import Footer from '../components/common/Footer'
import Container from '../components/common/Container'
import { NotificationContainer } from 'react-notifications'
export default class Inside extends Component {
  render() {
    return (
      <div>
        <Header
          logo='/build/img/kato.jpg'
          navs={[
            {
              text: '文章管理',
              path: '/inside-world/articles'
            },
            {
              text: '用户管理',
              path: '/inside-world/users'
            }
          ]} />
        <main>
          <Container>
            {this.props.children}
          </Container>
        </main>
        <Footer />
        <NotificationContainer />
      </div>
    )
  }
}