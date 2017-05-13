import { Defer, notification } from '../lib/common'
import config from '../lib/config'

const { post } = Defer($);
const articleApi = config.api.articles;

export const actionTypes = {
  CHANGE_ARTICLE_TABS: 'CHANGE_ARTICLE_TABS',
  ADDING_ARTICLE: 'ADDING_ARTICLE',
  ADDED_ARTICLE: 'ADDED_ARTICLE',
  ERROR_ADD_ARTICLE: 'ERROR_ADD_ARTICLE'
};

const addingArticle = () => ({
  type: actionTypes.ADDING_ARTICLE
});

const addedArticle = () => ({
  type: actionTypes.ADDED_ARTICLE
});

const errorAddArticle = () => ({
  type: actionTypes.ERROR_ADD_ARTICLE
});

export const changeArticleTabs = tabIndex => ({
  type: actionTypes.CHANGE_ARTICLE_TABS,
  tabIndex
});

export const fetchAddArticle = article => dispatch => {
  dispatch(addingArticle());
  post(`${articleApi.add}`, article)
    .done(data => {
      dispatch(addedArticle());
      notification({ message: '添加成功' });
    })
    .fail(errMsg => {
      dispatch(errorAddArticle());
      notification({ type: 'error', message: errMsg });
    });
};