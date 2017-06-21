const request = require('request');
const Promise = require('bluebird');
const md5 = require('blueimp-md5');
const baseURL = 'http://localhost:3000';
const adminData = {
  name: 'admin',
  password: md5('123456')
};

const reqHandler = ((request, Promise) => {
  const _request = (options, resolve, reject) => {
    request(options, (err, res, data) => {
      if (err) reject(err.toString());
      if (res.statusCode === 200 || res.statusCode === 304) {
        resolve(data);
      } else {
        reject({ msg: 'Somthing bad happend!' });
      }
    });
  };
  const get = (url, options = {}) => {
    const opts = Object.assign({ uri: url, json: true, jar: true }, options);
    return new Promise((resolve, reject) => _request(opts, resolve, reject));
  };
  const post = (url, options = {}) => {
    const opts = Object.assign({ method: 'POST', uri: url, json: true, jar: true }, options);
    return new Promise((resolve, reject) => _request(opts, resolve, reject));
  };
  const put = (url, options = {}) => {
    const opts = Object.assign({ method: 'PUT', uri: url, json: true, jar: true }, options);
    return new Promise((resolve, reject) => _request(opts, resolve, reject));
  };
  const del = (url, options = {}) => {
    const opts = Object.assign({ method: 'DELETE', uri: url, json: true, jar: true }, options);
    return new Promise((resolve, reject) => _request(opts, resolve, reject));
  };
  return {
    get,
    post,
    put,
    delete: del
  };
})(request, Promise);

const register = () => {
  const regData = {
    name: `user${Math.ceil(Math.random() * 100000)}`,
    password: md5('123456'),
    email: ''
  };
  return reqHandler.post(`${baseURL}/api/register`, { body: regData })
    .then(data => {
      if (data.code === 1) return Promise.resolve(regData);
    });
};

const signin = () => {
  return register()
    .then(data => reqHandler.post(`${baseURL}/api/login`, { body: data }))
    .then(data => Promise.resolve(data));
};

const signinByAdmin = () => reqHandler.post(`${baseURL}/api/login`, { body: adminData }).then(data => Promise.resolve(data));

const publishArticle = () => {
  return signinByAdmin()
    .then(() => {
      const article = {
        title: `Api-test${Math.ceil(Math.random() * 100000)}`,
        author: 'admin',
        date: new Date().getTime(),
        description: 'Api-test测试描述描述',
        articleType: 'javascript',
        content: 'Api-test测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容'
      };
      return reqHandler.post(`${baseURL}/api/inside/article/publish`, { body: article });
    });
};

module.exports = {
  reqHandler,
  register,
  signin,
  signinByAdmin,
  publishArticle,
  baseURL
};
