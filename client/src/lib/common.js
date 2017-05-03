import config from './config'

const { api } = config;

/**
 * jQuery Deferred封装
 * @param {function} $ jQuery构造函数
 * @return {object} jQuery的ajax方法对象
 */
export const Defer = function ($) {
  /**
   * GET方法
   * @param {string} url API路径
   * @param {object} options 底层ajax的选项
   */
  const get = function (url, options = {}) {
    let def = $.Deferred();
    let opts = $.extend({
      type: "GET",
      url: url,
      dataType: "json",
      success: function (data) {
        if (data.code === api.successCode) {
          def.resolve(data.content);
        } else {
          def.reject(data.msg);
        }
      },
      error: function (jqXHR) {
        def.reject(jqXHR.responseText);
      }
    }, options);
    $.ajax(opts);
    return def;
  };
  /**
   * POST方法
   * @param {string} url API路径
   * @param {object} data post参数
   * @param {object} options 底层ajax的选项
   */
  const post = function (url, data = {}, options = {}) {
    let def = $.Deferred();
    let opts = $.extend({
      type: 'POST',
      url: url,
      data: data,
      dataType: 'json',
      success: function (data) {
        if (data.code === api.successCode) {
          def.resolve(data.content);
        } else {
          def.reject(data.msg);
        }
      },
      error: function (jqXHR) {
        def.reject(jqXHR.responseText);
      }
    }, options);
    $.ajax(opts);
    return def;
  };
  return {
    get,
    post
  };
};

/**
 * 动态加载单个script
 * @param  {string} url 脚本路径
 * @return {object} def Deferred对象
 */
export const loadScript = url => {
  if (typeof $ !== 'function') throw new Error('Method loadScript depended on jQuery!');
  let def = $.Deferred(),
    script = document.createElement('script');
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
  const hour = fixNumber(formatDate.getHours());
  const minute = fixNumber(formatDate.getMinutes());
  const seconds = fixNumber(formatDate.getSeconds());
  switch (formatStyle) {
    case 'yyyy/MM/dd':
      return year + '/' + month + '/' + date;
    default:
      return year + '-' + month + '-' + date;
  }
}
