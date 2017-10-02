import $ from 'jquery';
import { NotificationManager } from 'react-notifications';
import config from './config';
import browserChecker from '../../vendor/browser';

const { api } = config;
const browser = browserChecker();

/**
 * jQuery Deferred封装
 */
export const $defer = (() => {
  /**
   * 内部公共defer方法封装
   * @param {object} options 底层ajax的选项
   */
  const _defer = options => {
    const def = $.Deferred();
    const opts = $.extend({
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: data => {
        if (data.code === api.successCode) {
          def.resolve(data.content);
        } else {
          def.reject(data.msg);
        }
      },
      error: () => def.reject(config.apiErrMsg)
    }, options);
    $.ajax(opts);
    return def;
  };
  /**
   * GET方法
   * @param {string} url API路径
   * @param {object} options 底层ajax的选项
   */
  const get = (url, options = {}) => {
    const opts = $.extend({
      url: browser.isIE9() ? `${url}?t=${Date.now()}` : url
    }, options);
    return _defer(opts);
  };
  /**
   * POST方法
   * @param {string} url API路径
   * @param {object} data post参数
   * @param {object} options 底层ajax的选项
   */
  const post = (url, data = {}, options = {}) => {
    const opts = $.extend({
      method: 'POST',
      url,
      data: JSON.stringify(data)
    }, options);
    return _defer(opts);
  };
  /**
   * PUT方法
   * @param {string} url API路径
   * @param {object} data post参数
   * @param {object} options 底层ajax的选项
   */
  const put = (url, data = {}, options = {}) => {
    const opts = $.extend({
      method: 'PUT',
      url,
      data: JSON.stringify(data)
    }, options);
    return _defer(opts);
  };
  /**
   * DELETE方法
   * @param {string} url API路径
   * @param {object} options 底层ajax的选项
   */
  const dele = (url, data = {}, options = {}) => {
    const opts = $.extend({ method: 'DELETE', url }, options);
    return _defer(opts);
  };
  return {
    get,
    post,
    put,
    dele
  };
})();

/**
 * 动态加载单个script
 * @param  {string} url 脚本路径
 * @return {object} def Deferred对象
 */
export const loadScript = url => {
  if (typeof $ !== 'function') throw new Error('Method loadScript depended on jQuery!');
  let def = $.Deferred();
  let script = document.createElement('script');
  script.src = url;
  script.addEventListener('load', () => def.resolve());
  document.body.appendChild(script);
  return def;
};

/**
 * 动态加载多个script
 * @param  {array} urls 脚本路径数组
 * @return {array} defs Deferred对象数组
 */
export const loadScripts = urls => {
  if (typeof $ !== 'function') throw new Error('Method loadScripts depended on jQuery!');
  let defs = urls.map(url => loadScript(url));
  return defs;
};

/**
 * 动态加载单个样式文件
 * @param  {string} url 脚本路径
 * @return {object} def Deferred对象
 */
export const loadStylesheet = url => {
  if (typeof $ !== 'function') throw new Error('Method loadScript depended on jQuery!');
  let def = $.Deferred();
  let stylesheet = document.createElement('link');
  stylesheet.href = url;
  stylesheet.rel = 'stylesheet';
  stylesheet.addEventListener('load', () => def.resolve());
  document.head.appendChild(stylesheet);
  return def;
};

/**
 * 动态加载多个样式文件
 * @param  {array} urls 脚本路径数组
 * @return {array} defs Deferred对象数组
 */
export const loadStylesheets = urls => {
  if (typeof $ !== 'function') throw new Error('Method loadScript depended on jQuery!');
  let defs = urls.map(url => loadStylesheet(url));
  return defs;
};

/**
 * 日期格式化
 * @param {number} timestamp 时间戳
 * @param {string} formatStyle 格式化形式
 * @return {string} 格式化的日期
 */
export const dateFormatter = (timestamp, formatStyle) => {
  const fixNumber = number => number.toString().length < 2 ? '0' + number : number;
  const formatDate = new Date(timestamp);
  const year = formatDate.getFullYear();
  const month = fixNumber(formatDate.getMonth() + 1);
  const date = fixNumber(formatDate.getDate());
  // const hour = fixNumber(formatDate.getHours());
  // const minute = fixNumber(formatDate.getMinutes());
  // const seconds = fixNumber(formatDate.getSeconds());
  switch (formatStyle) {
    case 'yyyy/MM/dd':
      return year + '/' + month + '/' + date;
    default:
      return year + '-' + month + '-' + date;
  }
};

/**
 * 提示插件封装, 文档详见
 * https://github.com/minhtranite/react-notifications
 */
export const notification = (options = {}) => {
  const opts = Object.assign({
    type: 'success',
    message: 'Hello world!',
    title: '',
    timeout: 1500,
    callback: null,
    priority: false
  }, options);
  NotificationManager[opts.type](opts.message, opts.title, opts.timeout, opts.callback, opts.priority);
};

/**
 * 对querySelectorAll的再次封装, 便于直接使用数组的方法
 * @param {string} selector 选择器
 * @param {DOM} context 原生DOM
 */
export const querySelectors = (selector, context = document) => Array.prototype.slice.call(context.querySelectorAll(selector));

/**
 * 节流函数
 * @param {function} func 执行的函数
 * @param {number} wait 触发执行函数的间隔
 */
export const throttleFunc = (func, wait) => {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(func, wait);
  };
};

export const loadCropper = () => {
  const def = $.Deferred();
  if (typeof $.fn.cropper === 'undefined') {
    notification({type: 'info', message: 'start to load cropper'});
    $.when(
      loadScript('/vendor/cropper/cropper.min.js'),
      loadStylesheet('/vendor/cropper/cropper.min.css')
    )
      .done(() => {
        notification({message: 'cropper loaded!'});
        def.resolve();
      })
      .fail(() => {
        notification({type: 'error', message: 'fail to load cropper'});
      });
  } else {
    def.resolve();
  }
  return def;
};
