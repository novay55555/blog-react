import React from 'react'
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router'
import Blog from '../containers/Blog'
import Article from '../containers/Article'
import ArticleLists from '../containers/ArticleLists'
import ArticleContent from '../containers/ArticleContent'
import Error from '../components/common/Error'

const routes = (
  <Route path='/'>
    <IndexRedirect to='/articles/1' />
    <Route path='articles/' component={Blog}>
      <Route component={Article}>
        <Route path='content/:id' component={ArticleContent}></Route>
        <Route component={ArticleLists}>
          <Route path='search/:searchTitle/:page'></Route>
          <Route path=':page'></Route>
          <Route path=':searchType/:page'></Route>
        </Route>
      </Route>
    </Route>
    <Route path='inside-world' component={Blog}></Route>
    <Route component={Blog}>
      <Route path='*' component={Error}></Route>
    </Route>
  </Route>
);

export default routes