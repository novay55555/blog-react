import { Defer, dateFormatter, notification, loadScript, loadStylesheet } from '../lib/common'
import config from '../lib/config'
import * as ArticlesActions from './articles'

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
  ERROR_EDIT_ARTICLE: 'ERROR_EDIT_ARTICLE',
  ENTERED_INSIDE: 'ENTERED_INSIDE' // 给定进入过里世界的标识, 以后再从博客进入无需在拉取数据 
};

const enteredInside = () => ({
  type: actionTypes.ENTERED_INSIDE
});

const editingArticle = () => ({
  type: actionTypes.EDITING_ARTICLE
});

const editedArticle = (editArticle, articles) => ({
  type: actionTypes.EDITED_ARTICLE,
  item: editArticle,
  getNewItems: () => {
    for (let i = 0, l = articles.length; i < l; i++) {
      let article = articles[i];
      if (article.id === editArticle.id) {
        articles[i] = Object.assign(article, editArticle);
        break;
      }
    }
    return articles;
  }
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
    articles.splice(articles.findIndex(article => article.id === id), 1);
    return articles;
  }
});

const errorDeleteArticle = () => ({
  type: actionTypes.ERROR_DELETE_ARTICLE
});

const addingArticle = article => ({
  type: actionTypes.ADDING_ARTICLE,
  item: article
});

const addedArticle = article => ({
  type: actionTypes.ADDED_ARTICLE,
  item: {
    ...article,
    id: article._id,
    date: dateFormatter(article.date)
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

export const fetchInsideArticles = (page = 1) => (dispatch, getState) => {
  dispatch(ArticlesActions.gettingArticles());
  get(`${articleApi.inside(page)}`)
    .done(articles => {
      dispatch(ArticlesActions.gotArticles(articles));
      !getState().inside.admin.hasEntered && dispatch(enteredInside());
    })
    .fail(errMsg => dispatch(ArticlesActions.errorGetArticles(errMsg)));
};

export const fetchInsideArticlesByTitle = (title, page = 1) => dispatch => {
  if (title.trim() === '') return dispatch(fetchInsideArticles());
  dispatch(ArticlesActions.gettingArticlesByTitle(title));
  get(`${articleApi.insideSearchByTitle(title, page)}`)
    .done(articles => dispatch(ArticlesActions.gotArticles(articles)))
    .fail(errMsg => dispatch(ArticlesActions.errorGetArticles(errMsg)));
};

export const fetchAddArticle = article => dispatch => {
  dispatch(addingArticle(article));
  post(`${articleApi.add}`, article)
    .done(data => {
      dispatch(addedArticle(data));
      dispatch(fetchInsideArticles());
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
  dispatch(ArticlesActions.gettingArticle());
  get(`${articleApi.current(id)}`)
    .done(article => dispatch(ArticlesActions.gotArticle(article)))
    .fail(errMsg => {
      dispatch(ArticlesActions.errorGetArticle());
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

export const fetchEditArticle = article => (dispatch, getState) => {
  dispatch(editingArticle());
  post(`${articleApi.edit(article.id)}`, article)
    .done(() => {
      dispatch(editedArticle(article, getState().articles.lists.items));
      notification({ message: '编辑成功' });
    })
    .fail(errMsg => {
      dispatch(errorEditArticle());
      notification({ type: 'error', message: errMsg });
    });
};