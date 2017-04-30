import React from 'react'
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router'
import Blog from '../containers/Blog'
import Article from '../containers/Article'
import ArticleLists from '../containers/ArticleLists'

export default
  <Router>
    <Route path='/' component={Blog}>
      <IndexRedirect to='/articles' />
      <Route path='articles' component={Article}>
        <IndexRoute component={ArticleLists} />
      </Route>
    </Route>
  </Router>