const request = require('request');
const Promise = require('bluebird');
const md5 = require('blueimp-md5');

const baseUrl = 'http://localhost:3000';
const adminData = {
  name: 'admin',
  password: md5('123456')
};

const reqHandler = ((rq, Promise) => {
  const get = (url, options = {}) => {
    const opts = Object.assign({ uri: url, json: true }, options);
    return new Promise((resolve, reject) => {
      rq(opts, (err, res, data) => {
        if (err) reject(err.toString());
        if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve(data);
        } else {
          reject(res.responseText);
        }
      });
    });
  };
  const post = (url, options = {}) => {
    const opts = Object.assign({ method: 'POST', uri: url, json: true, jar: true }, options);
    return new Promise((resolve, reject) => {
      rq(opts, (err, res, data) => {
        if (err) return reject(err.toString());
        if (res.statusCode >= 200 && res.statusCode < 400) {
          return resolve(data);
        } else {
          return reject(res.responseText);
        }
      });
    });
  };
  return {
    get: get,
    post: post,
    put: null,
    delete: null
  };
})(request, Promise);

const promiseRegister = () => {
  const regData = {
    name: `user${Math.ceil(Math.random() * 100000)}`,
    password: md5('123456'),
    email: ''
  };
  return reqHandler.post(baseUrl + '/api/register', { body: regData })
    .then(data => {
      if (data.code === 1) return Promise.resolve(regData);
    });
};

const promiseSignin = () => {
  return promiseRegister()
    .then(regData => reqHandler.post(baseUrl + '/api/login', { body: regData }))
    .then(data => Promise.resolve(data));
};

const promiseSigninByAdmin = () => {
  return reqHandler.post(baseUrl + '/api/login', { body: adminData })
    .then(data => Promise.resolve(data));
};

const promiseAddArticle = () => {
  promiseSigninByAdmin()
    .then(() => {
      const article = {
        title: `Api-test${Math.ceil(Math.random() * 100000)}`,
        author: 'admin',
        date: new Date().getTime(),
        description: 'Api-test测试描述描述',
        articleType: 'javascript',
        content: 'Api-test测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容'
      };
      return reqHandler.post(`${baseUrl}/api/article-publish`, { body: article });
    })
};

module.exports = {
  reqHandler,
  promiseRegister,
  promiseSignin,
  promiseSigninByAdmin,
  promiseAddArticle
};