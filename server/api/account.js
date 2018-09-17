const fs = require('fs');
const express = require('express');
const nodemailer = require('nodemailer');
const svgCaptcha = require('svg-captcha');
const User = require('../models/user.js');
const credenticals = require('../credenticals');
const config = require('../lib/config');

const Api = express.Router();
const apiStatus = config.api;

/**
 * @api {put} /api/user/avatar/:id 上传用户头像
 * @apiGroup Account
 * @apiName Upload user avatar
 * @apiParam {String} id 用户id
 * @apiParam {Object} avatar 用户选择的图片
 * @apiSuccessExample {json} Example:
 * {
 *  code: 1,
 *  content: {
 *    avatar: ''
 *  }
 * }
 * @apiVersion 1.0.0
 */
Api.put('/api/user/avatar/:id', (req, res) => {
  const userId = req.params.id;
  const avatarBase64 = req.body.avatar;
  checkLogin(req.session)
    .then(() => {
      const match = avatarBase64.match(/data:image\/\w+/);
      if (!match) return res.json(apiStatus.illegalType);
      const type = match[0].split('/')[1];
      const data = Buffer.from(avatarBase64.replace(/^data:image\/(png|gif|jpeg|jpg);base64,/, ''), 'base64');
      const filePath = `${config.upload.path}/avatar-${Date.now()}.${type}`;
      const photoUrl = filePath.replace(config.upload.path, '/img');
      fs.writeFile(filePath, data, err => {
        if (err) return res.json({ code: apiStatus.error.code, msg: err.message });
        User.findByIdAndUpdate(userId, { photoUrl }, err => {
          if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
          res.json({ code: apiStatus.success.code, content: { avatar: photoUrl } });
        });
      });
    })
    .catch(err => res.json({ code: apiStatus.illegalSession.code, msg: err.message }));
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
Api.post('/api/login', checkCaptcha, (req, res) => {
  User.find({ name: req.body.name, password: req.body.password }, (err, user) => {
    if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
    if (!user.length) return res.json({ code: apiStatus.illegalLogin.code, msg: apiStatus.illegalLogin.msg });
    user[0].role === 0 ? req.session.isAdmin = true : req.session.isAdmin = false;
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
Api.post('/api/register', checkCaptcha, (req, res) => {
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
          // logger: true,
          // debug: true
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
 * @api {get} /api/admin 获取用于展示博主的信息
 * @apiGroup Account
 * @apiName Get bloger info to show
 * @apiSuccess {Object} content 结果集
 * @apiSuccess {String} content.name 帐号
 * @apiSuccess {String} content.photoUrl 图片
 * @apiSuccess {String} content.job 工作
 * @apiSuccess {String} content.intro 简介
 * @apiVersion 1.0.0
 */
Api.get('/api/admin', (req, res) => {
  User.findOne({ role: 0 }, 'name job intro photoUrl', (err, admin) => {
    if (err) return res.json({ code: apiStatus.databaseError.code, msg: apiStatus.databaseError.msg });
    res.json({ code: apiStatus.success.code, content: admin });
  });
});

Api.get('/api/captcha', (req, res) => {
  const captcha = svgCaptcha.create(req.query || {});
  req.session.captcha = captcha.text.toLowerCase();

  res.json({code: apiStatus.success.code, content: captcha.data});
})

module.exports = Api;

function checkLogin (session) {
  if (!session.isLogin) return Promise.reject(new Error(apiStatus.illegalSession.msg));
  return Promise.resolve();
}

function checkCaptcha(req, res, next) {
  if(req.body.captcha === undefined) {
    return res.json(apiStatus.paramsRequired);
  }
  
  if(req.body.captcha.toLowerCase() !== req.session.captcha) {
    return res.json(apiStatus.illegalCaptcha);
  }

  next();
}
