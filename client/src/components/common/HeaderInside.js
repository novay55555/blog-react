import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import commonClass from './common.css'

export default class InsideHeader extends Component {

  render() {
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
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

InsideHeader.PropTypes = {
  logo: PropTypes.string,
  navs: PropTypes.arrayOf({
    text: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired
  }).isRequired
};