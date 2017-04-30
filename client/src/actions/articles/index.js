import { Defer, dateFormatter } from '../../lib/common'
const { get } = Defer($);

export const actionTypes = {
  GETTING_ARTICLES: 'GETTING_ARTICLES',
  GOT_ARTICLES: 'GOT_ARTICLES',
  ERROR_GET_ARTICLES: 'ERROR_GET_ARTICLES',
  GETTING_ARTICLE_TYPES: 'GETTING_ARTICLE_TYPES',
  GOT_ARTICLE_TYPES: 'GOT_ARTICLE_TYPES',
  ERROR_GET_ARTICLE_TYPES: 'ERROR_GET_ARTICLE_TYPES'
};

const gettingArticles = () => ({
  type: actionTypes.GETTING_ARTICLES
});

const gotArticles = articles => ({
  type: actionTypes.GOT_ARTICLES,
  items: articles.map(article => {
    article.date = dateFormatter(article.date);
    return article;
  })
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

export const fetchArticles = (page = 1) => dispatch => {
  dispatch(gettingArticles());
  get(`/api/articles/${page}`)
    .done(articles => dispatch(gotArticles(articles)))
    .fail(errMsg => dispatch(errorGetArticles(errMsg)));
};

export const fetchArticleTypes = () => dispatch => {
  dispatch(gettingArticles());
  get(`/api/types/articles`)
    .done(articleTypes => dispatch(gotArticleTypes(articleTypes)))
    .fail(errMsg => dispatch(errGetArticleTypes(errMsg)));
};