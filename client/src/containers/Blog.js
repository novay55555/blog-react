import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ContainerFluid from '../components/common/ContainerFluid'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'

export default class Blog extends Component {
  render() {
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
        />
        <main>
          {this.props.children}
        </main>
        <Footer />
      </div>
    )
  }
}