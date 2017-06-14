const express = require('express');
const Api = express.Router();
const nodemailer = require('nodemailer');

const User = require('../models/user.js');
const Article = require('../models/article.js');
const ArticleTypes = require('../models/article-types');
const ObjectId = require('mongoose').Types.ObjectId;
const Comment = require('../models/comment');
const credenticals = require('../credenticals');
const config = require('../lib/config');
const apiStatus = config.api;

/**
 * @api {get} /api/articles/types 获取文章类型
 * @apiGroup Articles
 * @apiName Get article types
 * @apiSuccess {Array} content 文章类型
 * @apiSuccessExample {json} Example:
 * {
 *  code: 1,
 *  content: ['javascript', 'nodejs']
 * }
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

/**
 * @api {post} /api/login 登录
 * @apiGroup Account
 * @apiName Sign in by account
 * @apiParam {String} name        用户名
 * @apiParam {String} password    密码
 * @apiSuccess {Object} content 结果集
 * @apiSuccess {String} content.username 用户名
 * @apiSuccess {Boolean} content.isAdmin 是否为管理员身份
 * @apiSuccess {Boolean} content.isLogin 是否已登录
 * @apiVersion 1.0.0
 */
Api.post('/api/login', (req, res) => {
  User.find({ name: req.body.name, password: req.body.password }, (err, user) => {
    if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
    if (!user.length) return res.json({ code: apiStatus.illegalLogin.code, msg: apiStatus.illegalLogin.msg });
    user[0].role == 0 ? req.session.isAdmin = true : req.session.isAdmin = false;
    req.session.isLogin = true;
    req.session.username = user[0]['name'];
    res.json({
      code: apiStatus.success.code,
      content: {
        username: req.session.username,
        isAdmin: req.session.isAdmin,
        isLogin: req.session.isLogin
      }
    });
  });
});

/**
 * @api {get} /api/signout 登出
 * @apiGroup Account
 * @apiName Sign out
 * @apiSuccessExample {json} Example:
 * {
 *  code: 1,
 *  content: {}
 * }
 * @apiVersion 1.0.0
 */
Api.get('/api/signout', (req, res) => {
  delete req.session.isLogin;
  delete req.session.isAdmin;
  delete req.session.username;
  res.json({ code: apiStatus.success.code, content: {} });
});

/**
 * @api {get} /api/checkout 验证session
 * @apiGroup Account
 * @apiName Check out an account session is actived or not
 * @apiSuccess {Object} content 结果集
 * @apiSuccess {String} content.username 用户名
 * @apiSuccess {Boolean} content.isAdmin 是否为管理员身份
 * @apiSuccess {Boolean} content.isLogin 是否已登录
 * @apiVersion 1.0.0
 */
Api.get('/api/checkout', (req, res) => {
  req.session.isLogin ? res.json({
    code: apiStatus.success.code,
    content: {
      username: req.session.username,
      isAdmin: req.session.isAdmin,
      isLogin: req.session.isLogin
    }
  }) : res.json({ code: apiStatus.sessionTimeout.code, msg: apiStatus.sessionTimeout.msg });
});

/**
 * @api {post} /api/register 注册
 * @apiGroup Account
 * @apiName Register an account
 * @apiParam {String} name        用户名
 * @apiParam {String} password    密码
 * @apiParam {String} email       邮箱
 * @apiSuccess {Object} content 结果集
 * @apiSuccess {String} content.username 用户名
 * @apiSuccess {Boolean} content.isAdmin 是否为管理员身份
 * @apiSuccess {Boolean} content.isLogin 是否已登录
 * @apiVersion 1.0.0
 */
Api.post('/api/register', (req, res) => {
  User.find({ name: req.body.name }, (err, user) => {
    if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
    if (user.length) return res.json({ code: apiStatus.userExist.code, msg: apiStatus.userExist.msg });
    req.body.role = 1;
    new User(req.body).save((err, user) => {
      if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
      // 如果提交了邮箱, 则发送一封邮件
      if (req.body.email) {
        const mailTransport = nodemailer.createTransport({
          host: 'smtp.qq.com',
          secureConnection: true,
          port: 465,
          auth: {
            user: credenticals.email.qq.user,
            pass: credenticals.email.qq.password
          }
          //logger: true,
          //debug: true
        });
        mailTransport.sendMail({
          from: '174777723@qq.com',
          to: req.body.email,
          subject: 'Thank you to register my blog!',
          text: 'hello world!'
        }, (err, info) => {
          if (err) {
            console.error(err);
          } else {
            console.log(info.response);
          }
        });
      }
      req.session.isLogin = true;
      req.session.username = req.body.name;
      res.json({
        code: apiStatus.success.code,
        content: {
          username: req.session.username,
          isAdmin: false,
          isLogin: req.session.isLogin
        }
      });
    });
  });
});

/**
 * @api {get} /api/inside/articles/:page 后台获取文章列表
 * @apiGroup Inside
 * @apiName Get articles by page
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
 * @apiParam {Number} page 分页页码
 * @apiVersion 1.0.0
 */
Api.get('/api/inside/articles/:page', (req, res) => {
  const page = parseInt(req.params.page);
  checkAdmin(req.session).then(() => {
    const articlesPromise = new Promise((resolve, reject) => {
      Article.find((err, articles) => {
        if (err) return reject({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
        resolve(articles);
      }).sort({ date: -1 }).limit(10).skip((page - 1) * 10);
    });
    const countPromise = new Promise((resolve, reject) => {
      Article.count({}, (err, count) => {
        if (err) return reject({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
        resolve(count);
      });
    });
    return Promise.all([articlesPromise, countPromise]);
  })
    .then(data => {
      const result = {
        total: data[1],
        page: page,
        articles: data[0]
      };
      res.json({ code: apiStatus.success.code, content: result });
    })
    .catch(err =>
      res.json(err));
});

/**
 * @api {get} /api/inside/articles/search/title/:title/:page 后台搜索文章列表
 * @apiGroup Inside
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
Api.get('/api/inside/articles/search/title/:title/:page', (req, res) => {
  const page = parseInt(req.params.page);
  checkAdmin(req.session).then(() => {
    const condition = new RegExp(req.params.title, 'i');
    const articlesPromise = new Promise((resolve, reject) => {
      Article.find({ title: condition }, (err, articles) => {
        if (err) return reject({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
        resolve(articles);
      }).sort({ date: -1 }).limit(10).skip((page - 1) * 10);
    });
    const countPromise = new Promise((resolve, reject) => {
      Article.count({ title: condition }, (err, count) => {
        if (err) return reject({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
        resolve(count);
      });
    });
    return Promise.all([articlesPromise, countPromise]);
  })
    .then(data => {
      const result = {
        total: data[1],
        page: page,
        articles: data[0]
      };
      res.json({ code: apiStatus.success.code, content: result });
    })
    .catch(err =>
      res.json(err));
});

/**
 * @api {get} /api/inside/article/publish 文章发表
 * @apiGroup Inside
 * @apiName Publish an article
 * @apiParam {String} title 标题
 * @apiParam {String} author 作者
 * @apiParam {String} date 更新时间
 * @apiParam {String} description 描述
 * @apiParam {String} articleType 文章类型
 * @apiParam {String} content 文章内容
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
Api.post('/api/inside/article/publish', (req, res) => {
  for (let x in req.body) {
    if (!req.body[x]) {
      return res.json({ code: apiStatus.paramsRequired.code, msg: apiStatus.paramsRequired.msg })
    }
  }
  checkAdmin(req.session).then(() => {
    req.body.date = (new Date(req.body.date)).getTime();
    new Article(req.body).save((err, newArticle) => {
      if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
      res.json({ code: apiStatus.success.code, content: newArticle });
    });
  }).catch(err => res.json(err));
});

/**
 * @api {post} /api/inside/article/update/:id 修改文章
 * @apiGroup Inside
 * @apiName Update an article
 * @apiParam {Number} id 文章id
 * @apiParam {String} title 标题
 * @apiParam {String} author 作者
 * @apiParam {String} date 更新时间
 * @apiParam {String} description 描述
 * @apiParam {String} articleType 文章类型
 * @apiParam {String} content 文章内容
 * @apiSuccessExample {json} Example:
 * {
 *  code: 1,
 *  content: {}
 * }
 * @apiVersion 1.0.0
 */
Api.post('/api/inside/article/update/:id', (req, res) => {
  checkAdmin(req.session).then(() => {
    Article.update({ _id: req.params.id }, {
      title: req.body.title,
      author: req.body.author,
      date: (new Date(req.body.date)).getTime(),
      description: req.body.description,
      articleType: req.body.articleType,
      content: req.body.content
    }, (err, raw) => {
      if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
      res.json({ code: apiStatus.success.code, content: {} })
    });
  }).catch(err => res.json(err));
});

/**
 * @api {get} /api/inside/article/delete/:id 删除文章
 * @apiGroup Inside
 * @apiName Delete an article
 * @apiParam {Number}  id  文章id
 * @apiSuccessExample {json} Example:
 * {
 *  code: 1,
 *  content: {}
 * }
 * @apiVersion 1.0.0
 */
Api.get('/api/inside/article/delete/:id', (req, res) => {
  checkAdmin(req.session).then(() => {
    Article.remove({ _id: req.params.id }, (err) => {
      if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
      res.json({ code: apiStatus.success.code, content: {} });
    });
  }).catch(err => res.json(err));
});

/**
 * @api {get} /api/inside/users/:page 获取用户列表
 * @apiGroup Inside
 * @apiName Get users by page
 * @apiParam {Number} page 分页页码
 * @apiSuccess {Object} content 结果集
 * @apiSuccess {Number} content.page 当前页码
 * @apiSuccess {Number} content.total 当前页码
 * @apiSuccess {Object[]} content.users 当前页码
 * @apiSuccess {String} content.users.email 邮箱
 * @apiSuccess {String} content.users.name 用户名
 * @apiSuccess {String} content.users.password 密码
 * @apiSuccess {Number} content.users.role 角色
 * @apiVersion 1.0.0
 */
Api.get('/api/inside/users/:page', (req, res) => {
  const page = parseInt(req.params.page);
  checkAdmin(req.session).then(() => {
    const usersPromise = new Promise((resolve, reject) => {
      User.find({role: 1}, (err, articles) => {
        if (err) return reject({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
        resolve(articles);
      }).sort({ date: -1 }).limit(10).skip((page - 1) * 10);
    });
    const countPromise = new Promise((resolve, reject) => {
      User.count({role: 1}, (err, count) => {
        if (err) return reject({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
        resolve(count);
      });
    });
    return Promise.all([usersPromise, countPromise]);
  })
    .then(data => {
      const result = {
        total: data[1],
        page: page,
        users: data[0]
      };
      res.json({ code: apiStatus.success.code, content: result });
    })
    .catch(err => res.json(err));
});

/**
 * @api {post} /api/inside/user/edit 编辑用户密码, 邮箱
 * @apiGroup Inside
 * @apiName Update a user password & email
 * @apiParam {Number}  id         用户id
 * @apiParam {String}  password   密码
 * @apiParam {String}  email      邮箱
 * @apiSuccessExample 
 * {
 *  code: 1,
 *  content: {}
 * }
 * @apiVersion 1.0.0
 */
Api.post('/api/inside/user/edit', (req, res) => {
  checkAdmin(req.session).then(() => {
    User.update({ _id: req.body.id }, {
      password: req.body.password,
      email: req.body.email
    }, (err) => {
      if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
      res.json({ code: apiStatus.success.code, content: {} });
    });
  }).catch(err => res.json(err));
});

/**
 * @api {get} /api/inside/user/delete/:id 删除用户
 * @apiGroup Inside
 * @apiName Delete a user
 * @apiParam {Number}  id  用户id
 * @apiSuccessExample 
 * {
 *  code: 1,
 *  content: {}
 * }
 * @apiVersion 1.0.0
 */
Api.get('/api/inside/user/delete/:id', (req, res) => {
  checkAdmin(req.session).then(() => {
    User.remove({ _id: req.params.id }, err => {
      if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
      res.json({ code: apiStatus.success.code, content: {} });
    });
  }).catch(err => res.json(err));
});

/**
 * @api {get} /api/inside/users/search/:name/:page 搜索用户
 * @apiGroup Inside
 * @apiName Get users by searching name
 * @apiParam {String} name   用户名
 * @apiParam {Number} page 分页页码
 * @apiSuccess {Object} content 结果集
 * @apiSuccess {Number} content.page 当前页码
 * @apiSuccess {Number} content.total 当前页码
 * @apiSuccess {Object[]} content.users 当前页码
 * @apiSuccess {String} content.users.email 邮箱
 * @apiSuccess {String} content.users.name 用户名
 * @apiSuccess {String} content.users.password 密码
 * @apiSuccess {Number} content.users.role 角色
 * @apiVersion 1.0.0
 */
Api.get('/api/inside/users/search/:name/:page', (req, res) => {
  const page = parseInt(req.params.page);
  checkAdmin(req.session).then(() => {
    const condition = new RegExp(req.params.name, 'i');
    const usersPromise = new Promise((resolve, reject) => {
      User.find({ name: condition, role: 1 }, (err, articles) => {
        if (err) return reject({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
        resolve(articles);
      }).sort({ date: -1 }).limit(10).skip((page - 1) * 10);
    });
    const countPromise = new Promise((resolve, reject) => {
      User.count({ name: condition, role: 1 }, (err, count) => {
        if (err) return reject({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
        resolve(count);
      });
    });
    return Promise.all([usersPromise, countPromise]);
  })
    .then(data => {
      const result = {
        total: data[1],
        page: page,
        users: data[0]
      };
      res.json({ code: apiStatus.success.code, content: result });
    })
    .catch(err => res.json(err));
});

/**
 * @api {post} /api/inside/blog 更新博客
 * @apiGroup Inside
 * @apiName Update blog settings
 * @apiParam (group) {object} admin 管理员帐号数据
 * @apiParam {String} admin.name 帐号
 * @apiParam {String} admin.password 密码(可选)
 * @apiParam {String} admin.email 邮箱
 * @apiParam (group) {object} types 文章类型数据
 * @apiParam {String} types.id 文章类型的ObjectId
 * @apiParam {array} types.data 文章类型集合 
 * @apiSuccessExample 
 * {
 *  code: 1,
 *  content: {}
 * }
 * @apiVersion 1.0.0
 */
Api.post('/api/inside/blog', (req, res) => {
  checkAdmin(req.session).then(() => {
    const { admin, types } = req.body;
    const adminUpdate = new Promise((resolve, reject) => {
      User.findOneAndUpdate({ role: 0 }, admin, (err, doc) => {
        if (err) return reject({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
        req.session.username = admin.name;
        resolve(doc);
      });
    }).then(doc => {
      Article.update({ author: doc.name }, { author: admin.name }, { multi: true }, err => {
        if (err) return Promise.reject({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
        return Promise.resolve();
      });
    });
    const typesUpdate = new Promise((resolve, reject) => {
      ArticleTypes.findOneAndUpdate({ _id: ObjectId(types.id) }, { type: types.data }, err => {
        if (err) return reject({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
        resolve();
      });
    });
    return Promise.all([adminUpdate, typesUpdate]);
  })
    .then(() => res.json({ code: apiStatus.success.code, content: {} }))
    .catch(err => res.json(err));
});

/**
 * @api {get} /api/inside/admin 获取管理员的相关信息
 * @apiGroup Inside
 * @apiName Get admin info
 * @apiSuccess {Object} content 结果集
 * @apiSuccess {String} content.email 邮箱
 * @apiSuccess {String} content.name 用户名
 * @apiSuccess {String} content.password 密码
 * @apiSuccess {Number} content.role 角色
 * @apiVersion 1.0.0
 */
Api.get('/api/inside/admin', (req, res) => {
  checkAdmin(req.session).then(() => {
    User.findOne({ role: 0 }, (err, admin) => {
      if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
      res.json({ code: apiStatus.success.code, content: admin });
    });
  }).catch(err => res.json(err));
});

module.exports = Api;

/**
 * @function 后台管理员身份验证
 * 
 * @param {object} session 用户session对象
 * @returns {Promise} Promise对象
 * 
 */
function checkAdmin(session) {
  if (!session.isAdmin) return Promise.reject({ code: 9, msg: '身份非法' });
  return Promise.resolve();
}