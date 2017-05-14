import { browserHistory } from 'react-router'
import { Defer, dateFormatter, notification } from '../lib/common'
import config from '../lib/config'
import { loadScript, loadStylesheet } from '../lib/common'
const articleApi = config.api.articles;
const { get, post } = Defer($);

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
  GETTING_ARTICLES_BY_TITLE: 'GETTING_ARTICLES_BY_TITLE',
  GETTING_ARTICLES_BY_TYPE: 'GETTING_ARTICLES_BY_TYPE',
  DELETING_ARTICLE: 'DELETING_ARTICLE',
  DELETED_ARTICLE: 'DELETED_ARTICLE',
  ERROR_DELETE_ARTICLE: 'ERROR_DELETE_ARTICLE',
  EDITING_ARTICLE: 'EDITING_ARTICLE',
  EDITED_ARTICLE: 'EDITED_ARTICLE',
  ERROR_EDIT_ARTICLE: 'ERROR_EDIT_ARTICLE'
};

const editingArticle = () => ({
  type: actionTypes.EDITING_ARTICLE
});

const editedArticle = article => ({
  type: actionTypes.EDITED_ARTICLE,
  article
});

const errorEditArticle = () => ({
  type: actionTypes.ERROR_EDIT_ARTICLE
});

const deleteingArticle = () => ({
  type: actionTypes.DELETING_ARTICLE
});

const deletedArticle = (articles, id) => ({
  type: actionTypes.DELETED_ARTICLE,
  getItems: () => {
    articles.splice(articles.findIndex(article => article._id === id), 1);
    return articles;
  }
});

const errorDeleteArticle = () => ({
  type: actionTypes.ERROR_DELETE_ARTICLE
});

const gettingArticlesByTitle = title => ({
  type: actionTypes.GETTING_ARTICLES_BY_TITLE,
  searchTitle: title
});

const gettingArticlesByType = type => ({
  type: actionTypes.GETTING_ARTICLES_BY_TYPE,
  searchType: type
});

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
    article.link = `/articles/content/${article._id}`;
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
    link: `/articles/${type}/1`,
    text: type
  }))
});

const errGetArticleTypes = errMsg => ({
  type: actionTypes.ERROR_GET_ARTICLE_TYPES,
  items: [],
  errMsg
});

export const fetchArticles = (page = 1) => (dispatch, getState) => {
  const lists = getState().articles.lists;
  const { searchTitle, searchType } = lists;
  const currentPage = lists.page;
  if ((!searchTitle && !searchType) && page == currentPage) return Promise.resolve();
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
    $.when(get(`${articleApi.current(id)}`), loadScript('/vendor/highlightjs/highlight.js'), loadStylesheet('/vendor/highlightjs/monokai-sublime.css'))
      .done(article => dispatch(gotArticle(article)))
      .fail(errMsg => dispatch(errorGetArticle(errMsg)));
  }
};

export const fetchArticlesByTitle = (title, page = 1) => (dispatch, getState) => {
  const lists = getState().articles.lists;
  if (title === lists.searchTitle && page == lists.page) return Promise.resolve();
  dispatch(gettingArticlesByTitle(title));
  get(`${articleApi.searchByTitle(title, page)}`)
    .done(articles => dispatch(gotArticles(articles)))
    .fail(errMsg => dispatch(errorGetArticles(errMsg)));
};

export const fetchArticlesByType = (type, page = 1) => (dispatch, getState) => {
  const lists = getState().articles.lists;
  if (type === lists.searchType && page == lists.page) return Promise.resolve();
  dispatch(gettingArticlesByType(type));
  get(`${articleApi.searchByType(type, page)}`)
    .done(articles => dispatch(gotArticles(articles)))
    .fail(errMsg => dispatch(errorGetArticles(errMsg)));
};

export const linkToSearchPath = title => {
  if (title.trim() === '') {
    browserHistory.push(`/articles/1`);
  } else {
    browserHistory.push(`/articles/search/${title}/1`);
  }
};

export const fetchInsideArticles = (page = 1) => dispatch => {
  dispatch(gettingArticles());
  get(`${articleApi.inside(page)}`)
    .done(articles => dispatch(gotArticles(articles)))
    .fail(errMsg => dispatch(errorGetArticles(errMsg)));
};

export const fetchInsideArticlesByTitle = (title, page = 1) => dispatch => {
  if (title.trim() === '') return dispatch(fetchInsideArticles());
  dispatch(gettingArticlesByTitle(title));
  get(`${articleApi.insideSearchByTitle(title, page)}`)
    .done(articles => dispatch(gotArticles(articles)))
    .fail(errMsg => dispatch(errorGetArticles(errMsg)));
};

export const fetchDeleteArticle = id => (dispatch, getState) => {
  dispatch(deleteingArticle());
  get(`${articleApi.delete(id)}`)
    .done(() => dispatch(deletedArticle(getState().articles.lists.items, id)))
    .fail(errMsg => {
      dispatch(errorDeleteArticle())
      notification({ type: 'error', message: errMsg, timeout: 3000 });
    });
};

export const fetchEditArticle = article => dispatch => {
  dispatch(editingArticle());
  post(`${aticleApi.edit(article.id)}`, article)
    .done(() => {
      dispatch(editedArticle(article));
      notification({ message: '编辑成功' });
    })
    .fail(errMsg => {
      dispatch(errorEditArticle());
      notification({ type: 'error', message: errMsg });
    });
}