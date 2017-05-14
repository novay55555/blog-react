import { Defer, notification, loadScript, loadStylesheet } from '../lib/common'
import config from '../lib/config'

const { get, post } = Defer($);
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