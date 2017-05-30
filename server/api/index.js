const express = require('express');
const Api = express.Router();
const nodemailer = require('nodemailer');

const User = require('../models/user.js');
const Article = require('../models/article.js');
const ArticleTypes = require('../models/article-types');
const ObjectId = require('mongoose').Types.ObjectId;
const Comment = require('../models/comment');
const credenticals = require('../credenticals');
const config = require('../config');
const apiStatus = config.api;

/**
 * @callback 获取文章
 * 
 * @param {number} page 页码数
 */
Api.get('/api/articles/:page', (req, res) => {
  const page = parseInt(req.params.page);
  Article.find((err, articles) => {
    if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
    const data = {
      total: articles.length, // TODO: 这种总数量的取值性能绝对差, 以后要优化, 搜索接口同理
      page: page,
      articles: articles.splice((page - 1) * 10, 10)
    };
    res.json({ code: apiStatus.success.code, content: data })
  }).sort({ date: -1 });
});

/**
 * @callback 获取文章类型
 */
Api.get('/api/types/articles', (req, res) => {
  ArticleTypes.find((err, types) => {
    if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
    res.json({ code: apiStatus.success.code, content: types[0].type });
  });
});


/**
 * @callback 获取文章内容
 * 
 * @param {number} id 文章id
 */
Api.get('/api/article/:id', function (req, res) {
  Article.findById(req.params.id, function (err, article) {
    if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
    res.json({ code: apiStatus.success.code, content: article });
  });
});

/**
 * @callback 文章搜索(标题)
 * 
 * @param {string} title 搜索的标题
 * @param {number} page 分页页码
 */
Api.get('/api/search/title/:title/:page', (req, res) => {
  const page = parseInt(req.params.page);
  const condition = new RegExp(req.params.title, 'i');
  Article.find({ title: condition }, (err, articles) => {
    if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
    const data = {
      total: articles.length,
      page: page,
      articles: articles.splice((page - 1) * 10, 10)
    };
    res.json({ code: apiStatus.success.code, content: data });
  }).sort({ date: -1 });
});

/**
 * @callback 文章搜索(类型)
 * 
 * @param {string} type 搜索的类型
 * @param {number} page 分页页码
 */
Api.get('/api/search/type/:type/:page', (req, res) => {
  const page = parseInt(req.params.page);
  const condition = new RegExp(req.params.type, 'i');
  Article.find({ articleType: condition }, (err, articles) => {
    if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
    const data = {
      total: articles.length,
      page: page,
      articles: articles.splice((page - 1) * 10, 10)
    };
    res.json({ code: apiStatus.success.code, content: data });
  }).sort({ date: -1 });
});

/**
 * @callback 登录
 * 
 * @param {string} name        用户名
 * @param {string} password    密码
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
 * @callback 登出
 */
Api.get('/api/signout', (req, res) => {
  delete req.session.isLogin;
  delete req.session.isAdmin;
  delete req.session.username;
  res.json({ code: apiStatus.success.code, content: {} });
});

/**
 * @callback 验证session
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
 * @callback 注册
 * 
 * @param {string} name        用户名
 * @param {string} password    密码
 * @param {string} email       邮箱
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
 * @callback 后台获取文章列表
 * 
 * @param {number} page 分页页码
 */
Api.get('/api/inside/articles/:page', (req, res) => {
  checkAdmin(req.session).then(() => {
    const page = parseInt(req.params.page);
    Article.find((err, articles) => {
      if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
      const data = {
        total: articles.length, // TODO: 这种总数量的取值性能绝对差, 以后要优化, 搜索接口同理
        page: page,
        articles: articles.splice((page - 1) * 10, 10)
      };
      res.json({ code: apiStatus.success.code, content: data })
    }).sort({ date: -1 });
  }).catch(err => res.json(err));
});

/**
 * @callback 后台搜索文章列表
 * 
 * @param {string} title 搜索的标题
 * @param {number} page 分页页码
 */
Api.get('/api/inside/search/title/:title/:page', (req, res) => {
  checkAdmin(req.session).then(() => {
    const page = parseInt(req.params.page);
    const condition = new RegExp(req.params.title, 'i');
    Article.find({ title: condition }, (err, articles) => {
      if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
      const data = {
        total: articles.length,
        page: page,
        articles: articles.splice((page - 1) * 10, 10)
      };
      res.json({ code: apiStatus.success.code, content: data });
    }).sort({ date: -1 });
  }).catch(err => res.json(err));
});


/**
 * @callback 文章发表
 * 
 * @param {object} req.body 文章修改的数据
 * @param {string} req.body.title 标题
 * @param {string} req.body.author 作者
 * @param {string} req.body.date 更新时间
 * @param {string} req.body.description 描述
 * @param {string} req.body.articleType 文章类型
 * @param {string} req.body.content 文章内容
 */
Api.post('/api/article-publish', (req, res) => {
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
 * @callback 修改文章
 * 
 * @param {number} id 文章id
 * @param {object} req.body 文章修改的数据
 * @param {string} req.body.title 标题
 * @param {string} req.body.author 作者
 * @param {string} req.body.date 更新时间
 * @param {string} req.body.description 描述
 * @param {string} req.body.articleType 文章类型
 * @param {string} req.body.content 文章内容
 */
Api.post('/api/article-update/:id', (req, res) => {
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
      console.log(`'The raw response from Mongo was ${raw}`);
      res.json({ code: apiStatus.success.code, content: {} })
    });
  }).catch(err => res.json(err));
});

/**
 * @callback 删除文章
 * 
 * @param {number}  id  文章id
 */
Api.get('/api/article-delete/:id', (req, res) => {
  checkAdmin(req.session).then(() => {
    Article.remove({ _id: req.params.id }, (err) => {
      if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
      res.json({ code: apiStatus.success.code, content: {} });
    });
  }).catch(err => res.json(err));
});

/**
 * @callback 编辑用户密码, 邮箱
 * 
 * @param {number}  id         用户id
 * @param {string}  password   密码
 * @param {string}  email      邮箱
 */
Api.post('/api/user-edit', (req, res) => {
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
 * @callback 删除用户
 * 
 * @param {number}  id  用户id
 */
Api.get('/api/user-delete/:id', (req, res) => {
  checkAdmin(req.session).then(() => {
    User.remove({ _id: req.params.id }, err => {
      if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
      res.json({ code: apiStatus.success.code, content: {} });
    });
  }).catch(err => res.json(err));
});

/**
 * @callback 搜索用户
 * 
 * @param {string}  name   用户名
 */
Api.get('/api/search-user/:name', (req, res) => {
  checkAdmin(req.session).then(() => {
    User.find({ name: condition }, (err, users) => {
      if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
      res.json({ code: apiStatus.success.code, content: users });
    });
  }).catch(err => res.json(err));
});

/**
 * @callback 修改管理员帐号
 * 
 * @param {string} name 帐号名
 */
Api.get('/api/change-admin-account/:name', (req, res) => {
  checkAdmin(req.session).then(() => {
    const newAccount = req.params.name;
    User.findOneAndUpdate({ role: 0 }, { name: newAccount }, (err, doc) => {
      if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
      req.session.username = newAccount;
      Article.update({ author: doc.name }, { author: newAccount }, { multi: true }, (err) => {
        if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
        res.json({ code: apiStatus.success.code, content: { username: req.session.username } });
      });
    });
  }).catch(err => res.json(err));
});

/**
 * @callback 修改管理员密码
 * 
 * @param {string} password md5后的密码
 */
Api.post('/api/change-admin-password/', (req, res) => {
  checkAdmin(req.session).then(() => {
    User.update({ role: 0 }, { password: req.body.password }, (err) => {
      if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
      res.json({ code: apiStatus.success.code });
    });
  }).catch(err => res.json(err));
});

/**
 * @callback 新增文章类型
 * 
 * @param {string} id 保存所有文章类型数据的id
 * @param {string} name 文章类型名
 */
Api.get('/api/add-article-type/:id/:name', (req, res) => {
  checkAdmin(req.session).then(() => {
    ArticleTypes.findOneAndUpdate({ _id: ObjectId(req.params.id) }, { $push: { type: req.params.name } }, { new: true }, (err, doc) => {
      if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
      res.json({ code: apiStatus.success.code, content: doc.type });
    });
  }).catch(err => res.json(err));
});

/**
 * @callback 删除文章类型
 * 
 * @param {string} id 保存所有文章类型数据的id
 * @param {string} name 文章类型名
 */
Api.get('/api/del-article-type/:id/:name', (req, res) => {
  checkAdmin(req.session).then(() => {
    ArticleTypes.findOneAndUpdate({ _id: ObjectId(req.params.id) }, { $pull: { type: req.params.name } }, { new: true }, (err, doc) => {
      if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
      res.json({ code: apiStatus.success.code, content: doc.type });
    });
  }).catch(err => res.json(err));
});


Api.use((req, res) => {
  res.status(404).send(apiStatus.notFount.msg);
});

Api.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json(apiStatus.error.msg);
});

module.exports = Api;

/**
 * @callback 后台管理员身份验证
 * 
 * @param {object} session 用户session对象
 * @returns {Promise} Promise对象
 * 
 */
function checkAdmin(session) {
  if (!session.isAdmin) return Promise.reject({ code: 9, msg: '身份非法' });
  return Promise.resolve();
}