const express = require('express');
const Article = require('../models/article.js');
const ArticleTypes = require('../models/article-types');
const config = require('../lib/config');

const Api = express.Router();
const apiStatus = config.api;

/**
 * @api {get} /api/articles/types 获取文章类型
 * @apiGroup Articles
 * @apiName Get article types
 * @apiSuccess {Object} content 文章类型
 * @apiSuccess {String} content._id 文章类型id
 * @apiSuccess {String[]} content.type 文章类型数组
 * @apiVersion 1.0.0
 */
Api.get('/api/articles/types', (req, res) => {
  ArticleTypes.find((err, types) => {
    if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
    res.json({ code: apiStatus.success.code, content: types[0] });
  });
});

/**
 * @api {get} /api/articles/:page 获取文章
 * @apiGroup Articles
 * @apiName Get articles by page
 * @apiParam {Number} page 页码数
 * @apiSuccess {Object} content 结果集
 * @apiSuccess {Number} content.total 总页数
 * @apiSuccess {Number} content.page 当前页数
 * @apiSuccess {Object[]} content.articles 文章列表
 * @apiSuccess {Number} content.articles._id 文章id
 * @apiSuccess {String} content.articles.title 标题
 * @apiSuccess {String} content.articles.author 作者
 * @apiSuccess {Number} content.articles.date 文章更新的时间戳
 * @apiSuccess {String} content.articles.description 文章描述
 * @apiSuccess {String} content.articles.articleType 文章类型
 * @apiSuccess {String} content.articles.content 文章内容
 * @apiSuccessExample {json} Example:
 * {
 *  code: 1,
 *  content: {
 *    total: 258
 *    page: 1
 *    articles: [
 *      {
 *        _id: 262,
 *        title: '列表测试',
 *        author: 'admin',
 *        date: 1496880000000,
 *        articleType: 'javascript'
 *        description: '列表测试列表测试列表测试',
 *        content: '列表测试列表测试列表测试'
 *      }
 *    ]
 *  }
 * }
 * @apiVersion 1.0.0
 */
Api.get('/api/articles/:page', (req, res) => {
  const page = parseInt(req.params.page);
  const articlesPromise = new Promise((resolve, reject) => {
    Article.find((err, articles) => {
      if (err) return reject(apiStatus.databaseError.msg);
      resolve(articles);
    }).sort({ date: -1 }).limit(10).skip((page - 1) * 10);
  });
  const countPromise = new Promise((resolve, reject) => {
    Article.count({}, (err, count) => {
      if (err) return reject(apiStatus.databaseError.msg);
      resolve(count);
    });
  });
  Promise.all([articlesPromise, countPromise]).then(data => {
    const result = {
      total: data[1],
      page: page,
      articles: data[0]
    };
    res.json({ code: apiStatus.success.code, content: result });
  }).catch(reason => res.json({ code: apiStatus.databaseError.code, msg: reason }));
});

/**
 * @api {get} /api/article/:id 获取文章内容
 * @apiGroup Articles
 * @apiName Get an article by id
 * @apiParam {Number} id 文章id
 * @apiSuccess {Object} content 结果集
 * @apiSuccess {Number} content._id 文章id
 * @apiSuccess {String} content.title 标题
 * @apiSuccess {String} content.author 作者
 * @apiSuccess {Number} content.date 文章更新的时间戳
 * @apiSuccess {String} content.description 文章描述
 * @apiSuccess {String} content.articleType 文章类型
 * @apiSuccess {String} content.content 文章内容
 * @apiVersion 1.0.0
 */
Api.get('/api/article/:id', function (req, res) {
  Article.findById(req.params.id, function (err, article) {
    if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
    res.json({ code: apiStatus.success.code, content: article });
  });
});

/**
 * @api {get} /api/articles/search/title/:title/:page 文章搜索(标题)
 * @apiGroup Articles
 * @apiName Get articles by searching title
 * @apiParam {String} title 搜索的标题
 * @apiParam {Number} page 分页页码
 * @apiSuccess {Object} content 结果集
 * @apiSuccess {Number} content.total 总页数
 * @apiSuccess {Number} content.page 当前页数
 * @apiSuccess {Object[]} content.articles 文章列表
 * @apiSuccess {Number} content.articles._id 文章id
 * @apiSuccess {String} content.articles.title 标题
 * @apiSuccess {String} content.articles.author 作者
 * @apiSuccess {Number} content.articles.date 文章更新的时间戳
 * @apiSuccess {String} content.articles.description 文章描述
 * @apiSuccess {String} content.articles.articleType 文章类型
 * @apiSuccess {String} content.articles.content 文章内容
 * @apiVersion 1.0.0
 */
Api.get('/api/articles/search/title/:title/:page', (req, res) => {
  const page = parseInt(req.params.page);
  const condition = new RegExp(req.params.title, 'i');
  const articlesPromise = new Promise((resolve, reject) => {
    Article.find({ title: condition }, (err, articles) => {
      if (err) return reject(apiStatus.databaseError.msg);
      resolve(articles);
    }).sort({ date: -1 }).limit(10).skip((page - 1) * 10);
  });
  const countPromise = new Promise((resolve, reject) => {
    Article.count({ title: condition }, (err, count) => {
      if (err) return reject(apiStatus.databaseError.msg);
      resolve(count);
    });
  });
  Promise.all([articlesPromise, countPromise]).then(data => {
    const result = {
      total: data[1],
      page: page,
      articles: data[0]
    };
    res.json({ code: apiStatus.success.code, content: result });
  }).catch(reason => res.json({ code: apiStatus.databaseError.code, msg: reason }));
});

/**
 * @api {get} /api/articles/search/type/:type/:page 文章搜索(类型)
 * @apiGroup Articles
 * @apiName Get articles by searching type
 * @apiParam {String} type 搜索的类型
 * @apiParam {Number} page 分页页码
 * @apiSuccess {Object} content 结果集
 * @apiSuccess {Number} content.total 总页数
 * @apiSuccess {Number} content.page 当前页数
 * @apiSuccess {Object[]} content.articles 文章列表
 * @apiSuccess {Number} content.articles._id 文章id
 * @apiSuccess {String} content.articles.title 标题
 * @apiSuccess {String} content.articles.author 作者
 * @apiSuccess {Number} content.articles.date 文章更新的时间戳
 * @apiSuccess {String} content.articles.description 文章描述
 * @apiSuccess {String} content.articles.articleType 文章类型
 * @apiSuccess {String} content.articles.content 文章内容
 * @apiVersion 1.0.0
 */
Api.get('/api/articles/search/type/:type/:page', (req, res) => {
  const page = parseInt(req.params.page);
  const condition = new RegExp(req.params.type, 'i');
  const articlesPromise = new Promise((resolve, reject) => {
    Article.find({ articleType: condition }, (err, articles) => {
      if (err) return reject(apiStatus.databaseError.msg);
      resolve(articles);
    }).sort({ date: -1 }).limit(10).skip((page - 1) * 10);
  });
  const countPromise = new Promise((resolve, reject) => {
    Article.count({ articleType: condition }, (err, count) => {
      if (err) return reject(apiStatus.databaseError.msg);
      resolve(count);
    });
  });
  Promise.all([articlesPromise, countPromise]).then(data => {
    const result = {
      total: data[1],
      page: page,
      articles: data[0]
    };
    res.json({ code: apiStatus.success.code, content: result });
  }).catch(reason => res.json({ code: apiStatus.databaseError.code, msg: reason }));
});

module.exports = Api;
