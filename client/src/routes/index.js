import React from 'react'
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router'
import Blog from '../containers/Blog'
import Article from '../containers/Article'
import ArticleLists from '../containers/ArticleLists'
import ArticleContent from '../containers/ArticleContent'

export default
  <Router>
    <Route path='/' component={Blog}>
      <IndexRedirect to='/articles' />
      <Route path='articles' component={Article}>
        <IndexRoute component={ArticleLists} />
        <Route path=':page' component={ArticleLists}></Route>
      </Route>
      <Route path='article' component={Article}>
        <Route path=':id' component={ArticleContent}></Route>
      </Route>
    </Route>
  </Router>