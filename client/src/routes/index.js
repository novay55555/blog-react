import React from 'react';
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router';
import Blog from '../containers/Blog';
import Article from '../containers/articles/Article';
import ArticleLists from '../containers/articles/Lists';
import ArticleContent from '../containers/articles/Content';
import NonePage from '../components/common/404';
import Inside from '../containers/Inside';
import InsideArticles from '../containers/inside/Articles';
import InsideUsers from '../containers/inside/Users';
import InsideAdmin from '../containers/inside/Admin';

const routes = (
  <Route path='/'>
    <IndexRedirect to='/articles/1' />
    <Route path='articles/' component={Blog}>
      <Route component={Article}>
        <Route path='content/:id' component={ArticleContent} />
        <Route component={ArticleLists}>
          <Route path='search/:searchTitle/:page' />
          <Route path=':page' />
          <Route path=':searchType/:page' />
        </Route>
      </Route>
    </Route>
    <Route path='inside-world' component={Inside}>
      <IndexRedirect to='/inside-world/articles' />
      <Route path='articles' component={InsideArticles} />
      <Route path='users' component={InsideUsers} />
      <Route path='admin' component={InsideAdmin} />
    </Route>
    <Route component={Blog}>
      <Route path='*' component={NonePage} />
    </Route>
  </Route>
);

export default routes;
