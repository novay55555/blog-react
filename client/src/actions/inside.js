import { Defer, dateFormatter, notification, loadScript, loadStylesheet } from '../lib/common'
import config from '../lib/config'
import { gettingArticles, gotArticles, errorGetArticles, gettingArticlesByTitle, gettingArticle, gotArticle, errorGetArticle } from './articles'

const { get, post } = Defer($);
const articleApi = config.api.articles;

export const actionTypes = {
  CHANGE_ARTICLE_TABS: 'CHANGE_ARTICLE_TABS',
  ADDING_ARTICLE: 'ADDING_ARTICLE',
  ADDED_ARTICLE: 'ADDED_ARTICLE',
  ERROR_ADD_ARTICLE: 'ERROR_ADD_ARTICLE',
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

const addingArticle = () => ({
  type: actionTypes.ADDING_ARTICLE
});

const addedArticle = (newArticle, articles) => ({
  type: actionTypes.ADDED_ARTICLE,
  getNewItems: () => {
    articles.unshift(newArticle);
    articles.pop();
    return articles;
  }
});

const errorAddArticle = () => ({
  type: actionTypes.ERROR_ADD_ARTICLE
});

export const changeArticleTabs = (tabIndex, mode = 'add') => ({
  type: actionTypes.CHANGE_ARTICLE_TABS,
  tabIndex,
  mode
});

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

export const fetchAddArticle = article => (dispatch, getState) => {
  dispatch(addingArticle());
  post(`${articleApi.add}`, article)
    .done(data => {
      dispatch(addedArticle(data, getState().articles.lists.items));
      notification({ message: '添加成功' });
    })
    .fail(errMsg => {
      dispatch(errorAddArticle());
      notification({ type: 'error', message: errMsg });
    });
};

export const loadMarkdownEditor = () => {
  const def = $.Deferred();
  const markdownPlugins = () => {
    const def = $.Deferred();
    if (typeof $.fn.markdown === 'undefined') {
      notification({ type: 'info', message: 'Loading markdown editor' });
      $.when(
          loadScript('/vendor/markdown-editor/bootstrap-markdown.js'),
          loadScript('/vendor/markdown-editor/jquery.hotkeys.js'),
          loadStylesheet('/vendor/markdown-editor/bootstrap-markdown.min.css')
        )
        .done(() => {
          notification({ message: 'Markdown editor loaded!' });
          def.resolve();
        })
        .fail(() => {
          notification({ type: 'error', message: 'Fail to load markdown editor, please refresh your page' });
        });
    } else {
      def.resolve();
    }
    return def;
  };

  const highlightPlugins = () => {
    const def = $.Deferred();
    if (!window.hasOwnProperty('hljs')) {
      notification({ type: 'info', message: 'Loading highlightjs' });
      $.when(
          loadScript('/vendor/highlightjs/highlight.js'),
          loadStylesheet('/vendor/highlightjs/monokai-sublime.css')
        )
        .done(() => {
          notification({ message: 'Highlightjs loaded!' });
          def.resolve();
        })
        .fail(() => {
          notification({ type: 'error', message: 'Fail to load highlightjs' });
        })
    } else {
      def.resolve();
    }
    return def;
  };

  $.when(markdownPlugins(), highlightPlugins()).done(() => def.resolve());
  return def;
};

export const fetchInsideArticle = id => dispatch => {
  dispatch(changeArticleTabs(1, 'edit'));
  dispatch(gettingArticle());
  get(`${articleApi.current(id)}`)
    .done(article => dispatch(gotArticle(article)))
    .fail(errMsg => {
      dispatch(errorGetArticle());
      notification({ type: 'error', message: errMsg });
    });
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
  post(`${articleApi.edit(article.id)}`, article)
    .done(() => {
      dispatch(editedArticle(article));
      notification({ message: '编辑成功' });
    })
    .fail(errMsg => {
      dispatch(errorEditArticle());
      notification({ type: 'error', message: errMsg });
    });
};