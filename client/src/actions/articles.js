import { Defer, dateFormatter } from '../lib/common'
import config from '../lib/config'
import { loadScript, loadStyleSheet } from '../lib/common'
const articleApi = config.api.articles;
const { get } = Defer($);

export const actionTypes = {
  GETTING_ARTICLES: 'GETTING_ARTICLES',
  GOT_ARTICLES: 'GOT_ARTICLES',
  ERROR_GET_ARTICLES: 'ERROR_GET_ARTICLES',
  GETTING_ARTICLE_TYPES: 'GETTING_ARTICLE_TYPES',
  GOT_ARTICLE_TYPES: 'GOT_ARTICLE_TYPES',
  ERROR_GET_ARTICLE_TYPES: 'ERROR_GET_ARTICLE_TYPES',
  GETTING_ARTICLE: 'GETTING_ARTICLE',
  GOT_ARTICLE: 'GOT_ARTICLE',
  ERROR_GET_ARTICLE: 'ERROR_GET_ARTICLE',
};

const gettingArticle = () => ({
  type: actionTypes.GETTING_ARTICLE
});

const gotArticle = article => ({
  type: actionTypes.GOT_ARTICLE,
  item: {
    ...article,
    date: dateFormatter(article.date)
  }
});

const errorGetArticle = errMsg => ({
  type: actionTypes.ERROR_GET_ARTICLE,
  item: [],
  errMsg
});

const gettingArticles = () => ({
  type: actionTypes.GETTING_ARTICLES
});

const gotArticles = lists => ({
  type: actionTypes.GOT_ARTICLES,
  items: lists.articles.map(article => {
    article.date = dateFormatter(article.date);
    article.link = `/article/${article._id}`;
    return article;
  }),
  total: Math.ceil(lists.total / 10),
  page: lists.page
});

const errorGetArticles = errMsg => ({
  type: actionTypes.ERROR_GET_ARTICLES,
  items: [],
  errMsg
});

const gettingArticleTypes = () => ({
  type: actionTypes.GETTING_ARTICLE_TYPES
});

const gotArticleTypes = types => ({
  type: actionTypes.GOT_ARTICLE_TYPES,
  items: types.map(type => ({
    link: `/types/${type}`,
    text: `${type}`
  }))
});

const errGetArticleTypes = errMsg => ({
  type: actionTypes.ERROR_GET_ARTICLE_TYPES,
  items: [],
  errMsg
});

export const fetchArticles = (page = 1) => (dispatch, getState) => {
  const currentPage = getState().articles.lists.page;
  if (page == currentPage) return Promise.resolve();
  dispatch(gettingArticles());
  get(`${articleApi.lists(page)}`)
    .done(lists => dispatch(gotArticles(lists)))
    .fail(errMsg => dispatch(errorGetArticles(errMsg)));

};

export const fetchArticleTypes = () => dispatch => {
  dispatch(gettingArticleTypes());
  get(`${articleApi.types}`)
    .done(articleTypes => dispatch(gotArticleTypes(articleTypes)))
    .fail(errMsg => dispatch(errGetArticleTypes(errMsg)));
};

export const fetchArticle = id => (dispatch, getState) => {
  const currentId = getState().articles.current.item._id;
  if (id == currentId) return Promise.resolve();
  dispatch(gettingArticle());
  if (window.hasOwnProperty('hljs')) {
    get(`${articleApi.current(id)}`)
      .done(article => dispatch(gotArticle(article)))
      .fail(errMsg => dispatch(errorGetArticle(errMsg)));
  } else {
    $.when(get(`${articleApi.current(id)}`), loadScript('/vendor/highlightjs/highlight.js'), loadStyleSheet('/vendor/highlightjs/monokai-sublime.css'))
      .done(article => dispatch(gotArticle(article)))
      .fail(errMsg => dispatch(errorGetArticle(errMsg)));
  }
};