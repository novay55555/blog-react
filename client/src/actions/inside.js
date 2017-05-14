import { Defer, dateFormatter, notification, loadScript, loadStylesheet } from '../lib/common'
import config from '../lib/config'

const { get, post } = Defer($);
const articleApi = config.api.articles;

export const actionTypes = {
  CHANGE_ARTICLE_TABS: 'CHANGE_ARTICLE_TABS',
  ADDING_ARTICLE: 'ADDING_ARTICLE',
  ADDED_ARTICLE: 'ADDED_ARTICLE',
  ERROR_ADD_ARTICLE: 'ERROR_ADD_ARTICLE',
  GETTING_EDIT_ARTICLE: 'GETTING_EDIT_ARTICLE',
  GOT_EDIT_ARTICLE: 'GOT_EDIT_ARTICLE',
  ERROR_GET_EDIT_ARTICLE: 'ERROR_GET_EDIT_ARTICLE'
};

const gettingArticle = () => ({
  type: actionTypes.GETTING_EDIT_ARTICLE
});

const gotArticle = article => ({
  type: actionTypes.GOT_EDIT_ARTICLE,
  item: {
    ...article,
    date: dateFormatter(article.date)
  }
});

const errorGetArticle = () => ({
  type: actionTypes.ERROR_GET_EDIT_ARTICLE
});

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

export const fetchEditArticle = id => dispatch => {
  dispatch(changeArticleTabs(1));
  dispatch(gettingArticle());
  get(`${articleApi.current(id)}`)
    .done(article => dispatch(gotArticle(article)))
    .fail(errMsg => {
      dispatch(errorGetArticle());
      notification({ type: 'error', message: errMsg });
    });
};