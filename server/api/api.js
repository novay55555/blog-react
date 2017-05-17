var User = require('../models/user.js');
var Article = require('../models/article.js');
var ArticleTypes = require('../models/article-types');
var ObjectId = require('mongoose').Types.ObjectId;
var Comment = require('../models/comment');
module.exports = function(app, credenticals, nodemailer) {
  /**
   * 获取文章
   */
  app.get('/api/articles/:page', function(req, res) {
    var page = parseInt(req.params.page);
    Article.find(function(err, articles) {
      if (err) return res.json({ code: 0, msg: '数据库查询失败' });
      var data = {
        total: articles.length, // TODO: 这种总数量的取值性能绝对差, 以后要优化, 搜索接口同理
        page: page,
        articles: articles.splice((page - 1) * 10, 10)
      };
      res.json({ code: 1, content: data })
    }).sort({ date: -1 });
  });

  /**
   * 获取文章类型
   */
  app.get('/api/types/articles', function(req, res) {
    ArticleTypes.find(function(err, types) {
      if (err) return res.json({ code: 0, msg: '数据库查询失败' });
      res.json({ code: 1, content: types[0].type });
    });
  });

  /**
   * 文章内容
   */
  app.get('/api/article/:id', function(req, res) {
    Article.findById(req.params.id, function(err, article) {
      if (err) return res.json({ code: 0, msg: '数据库查询失败' });
      res.json({ code: 1, content: article });
    });
  });

  /**
   * 文章搜索(标题)
   */
  app.get('/api/search/title/:title/:page', function(req, res) {
    var page = parseInt(req.params.page);
    var condition = new RegExp(req.params.title, 'i');
    Article.find({ title: condition }, function(err, articles) {
      if (err) return res.json({ code: 0, msg: '数据库查询失败' });
      var data = {
        total: articles.length,
        page: page,
        articles: articles.splice((page - 1) * 10, 10)
      };
      res.json({ code: 1, content: data });
    }).sort({ date: -1 });
  });

  /**
   * 文章搜索(类型)
   */
  app.get('/api/search/type/:type/:page', function(req, res) {
    var page = parseInt(req.params.page);
    var condition = new RegExp(req.params.type, 'i');
    Article.find({ articleType: condition }, function(err, articles) {
      if (err) return res.json({ code: 0, msg: '数据库查询失败' });
      var data = {
        total: articles.length,
        page: page,
        articles: articles.splice((page - 1) * 10, 10)
      };
      res.json({ code: 1, content: data });
    }).sort({ date: -1 });
  });

  /**
   * 登录
   * @param {String} name        用户名
   * @param {String} password    密码
   */
  app.post('/api/login', function(req, res) {
    User.find({ name: req.body.name, password: req.body.password }, function(err, user) {
      if (err) return res.json({ code: 0, msg: '数据库查询失败' });
      if (!user.length) return res.json({ code: 0, msg: '用户名或密码错误' });
      user[0].role == 0 ? req.session.isAdmin = true : req.session.isAdmin = false;
      req.session.isLogin = true;
      req.session.username = user[0]['name'];
      res.json({
        code: 1,
        content: {
          username: req.session.username,
          isAdmin: req.session.isAdmin,
          isLogin: req.session.isLogin
        }
      });
    });
  });

  /**
   * 登出
   */
  app.get('/api/signout', function(req, res) {
    delete req.session.isLogin;
    delete req.session.isAdmin;
    res.json({ code: 1, content: {} });
  });

  /**
   * 验证session
   */
  app.get('/api/checkout', (req, res) => {
    req.session.isLogin ? res.json({
      code: 1,
      content: {
        username: req.session.username,
        isAdmin: req.session.isAdmin,
        isLogin: req.session.isLogin
      }
    }) : res.json({
      code: 2,
      msg: 'session已过期'
    });
  });

  /**
   * 注册
   * @param {String} name        用户名
   * @param {String} password    密码
   * @param {String} email       邮箱
   */
  app.post('/api/register', function(req, res) {
    User.find({ name: req.body.name }, function(err, user) {
      if (err) return res.json({ code: 0, msg: '数据库查询失败' });
      if (user.length) return res.json({ code: 0, msg: '用户名已存在' });
      req.body.role = 1;
      new User(req.body).save(function(err, user) {
        if (err) return res.json({ code: 0, msg: '数据库添加失败' });
        // 如果提交了邮箱, 则发送一封邮件
        if (req.body.email) {
          var mailTransport = nodemailer.createTransport({
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
          }, function(err, info) {
            if (err) {
              console.error(err);
            } else {
              console.log(info.response);
            }
          });
        }
        req.session.isLogin = true;
        req.session.username = req.body.name;
        res.json({ code: 1, userId: user._id });
      });
    });
  });

  /**
   * 后台获取文章列表
   */
  app.get('/api/inside/articles/:page', (req, res) => {
    checkAdmin(req.session).then(() => {
      const page = parseInt(req.params.page);
      Article.find(function(err, articles) {
        if (err) return res.json({ code: 0, msg: '数据库查询失败' });
        const data = {
          total: articles.length, // TODO: 这种总数量的取值性能绝对差, 以后要优化, 搜索接口同理
          page: page,
          articles: articles.splice((page - 1) * 10, 10)
        };
        res.json({ code: 1, content: data })
      }).sort({ date: -1 });
    }).catch(err => res.json(err));
  });

  /**
   * 后台搜索文章列表
   */
  app.get('/api/inside/search/title/:title/:page', function(req, res) {
    checkAdmin(req.session).then(() => {
      var page = parseInt(req.params.page);
      var condition = new RegExp(req.params.title, 'i');
      Article.find({ title: condition }, function(err, articles) {
        if (err) return res.json({ code: 0, msg: '数据库查询失败' });
        var data = {
          total: articles.length,
          page: page,
          articles: articles.splice((page - 1) * 10, 10)
        };
        res.json({ code: 1, content: data });
      }).sort({ date: -1 });
    }).catch(err => res.json(err));

  });

  /**
   * 文章发表表单处理
   */
  app.post('/api/article-publish', function(req, res) {
    for (var x in req.body) {
      if (!req.body[x]) {
        return res.json({ code: 0, msg: '休想绕过前端验证' })
      }
    }
    req.body.date = (new Date(req.body.date)).getTime();
    new Article(req.body).save(function(err, newArticle) {
      if (err) {
        console.log(err.message)
        return res.json({ code: 0, msg: '保存文章时出现了问题TAT' })
      }
      res.json({ code: 1, content: newArticle });
    });
  });

  /**
   * 修改文章
   * 此处为表单提交
   */
  app.post('/api/article-update/:id', function(req, res) {
    Article.update({ _id: req.params.id }, {
      title: req.body.title,
      author: req.body.author,
      date: (new Date(req.body.date)).getTime(),
      description: req.body.description,
      articleType: req.body.articleType,
      content: req.body.content
    }, function(err, raw) {
      if (err) return res.send(500, 'database error');
      req.session.result = {
        class: 'success',
        msg: '修改成功- .-'
      };
      res.redirect(303, '../../admin/ctrl-article');
    });
  });

  /**
   * 删除文章
   * @param {Number}  id  文章id
   */
  app.get('/api/article-delete/:id', function(req, res) {
    Article.remove({ _id: req.params.id }, function(err) {
      if (err) return res.json({ code: 0, msg: '数据库删除失败' });
      res.json({ code: 1 });
    });
  });

  /**
   * 编辑用户密码, 邮箱
   * @param {Number}  id         用户id
   * @param {String}  password   密码
   * @param {String}  email      邮箱
   */
  app.post('/api/user-edit', function(req, res) {
    var fn = function() {
      User.update({ _id: req.body.id }, {
        password: req.body.password,
        email: req.body.email
      }, function(err) {
        if (err) return res.json({ code: 0, msg: '数据库保存失败' });
        res.json({ code: 1 });
      });
    };
    checkIdentity(req, res, fn);
  });

  /**
   * 删除用户
   * @param {Number}  id  用户id
   */
  app.get('/api/user-delete/:id', function(req, res) {
    var fn = function() {
      User.remove({ _id: req.params.id }, function(err) {
        if (err) return res.json({ code: 0, msg: '数据库删除失败' });
        res.json({ code: 1 });
      });
    };
    checkIdentity(req, res, fn);
  });

  /**
   * 加载更多文章(首页)
   * @param {Number}  times  点击加载的次数
   */
  app.get('/api/load-more-article/:times', function(req, res) {
    Article.find(function(err, articles) {
      if (err) return res.json({ code: 0, msg: '数据库查询失败' });
      res.json({ code: 1, content: articles });
    }).sort({ date: -1 }).limit(10).skip(10 * req.params.times + 1);
  });

  /**
   * 加载更多文章(搜索结果)
   * @param {String}  type           搜索的类型
   * @param {String}  typeContent    搜索类型的值
   * @param {Number}  times          点击加载的次数
   */
  app.get('/api/load-more-article/:type/:typeContent/:times', function(req, res) {
    var type = req.params.type,
      typeContent = req.params.typeContent,
      times = req.params.times,
      condition = new RegExp(typeContent, 'i');
    if (type == 'title') {
      Article.find({ title: condition }, function(err, articles) {
        if (err) return res.json({ code: 0, msg: '数据库查询失败' });
        res.json({ code: 1, content: articles });
      }).sort({ date: -1 }).limit(10).skip(10 * times + 1);
    } else {
      Article.find({ articleType: condition }, function(err, articles) {
        if (err) return res.json({ code: 0, msg: '数据库查询失败' });
        res.json({ code: 1, content: articles });
      }).sort({ date: -1 }).limit(10).skip(10 * times + 1);
    }
  });

  /**
   * 加载更多用户
   * @param {Number}  times  点击加载的次数
   */
  app.get('/api/load-more-user/:times', function(req, res) {
    User.find(function(err, articles) {
      if (err) return res.json({ code: 0, msg: '数据库查询失败' });
      res.json({ code: 1, content: articles });
    }).limit(10).skip(10 * req.params.times + 1);
  });

  /**
   * 搜索用户(后台)
   * @param {String}  name   用户名
   */
  app.get('/api/search-user/:name', function(req, res) {
    var condition = new RegExp(req.params.name, 'i');
    User.find({ name: condition }, function(err, users) {
      if (err) return res.json({ code: 0, msg: '数据库查询失败' });
      res.json({ code: 1, content: users });
    });
  });

  /**
   * 搜索文章(后台)
   * @param {String} name 文章名
   */
  app.get('/api/search-article/:name', function(req, res) {
    var condition = new RegExp(req.params.name, 'i');
    Article.find({ title: condition }, function(err, articles) {
      if (err) return res.json({ code: 0, msg: '数据库查询失败' });
      res.json({ code: 1, content: articles });
    });
  });

  /**
   * 修改管理员帐号
   * @param {String} name 帐号名
   */
  app.get('/api/change-admin-account/:name', function(req, res) {
    var fn = function() {
      var newAccount = req.params.name;
      User.findOneAndUpdate({ role: 0 }, { name: newAccount }, function(err, doc) {
        if (err) return res.json({ code: 0, msg: '数据库更新失败' });
        req.session.username = newAccount;
        Article.update({ author: doc.name }, { author: newAccount }, { multi: true }, function(err) {
          if (err) return res.json({ code: 0, msg: '数据库更新失败' });
          res.json({ code: 1 });
        });
      });
    };
    checkIdentity(req, res, fn);
  });

  /**
   * 修改管理员密码
   * @param {String} password md5后的密码
   */
  app.post('/api/change-admin-password/', function(req, res) {
    var fn = function() {
      User.update({ role: 0 }, { password: req.body.password }, function(err) {
        if (err) return res.json({ code: 0, msg: '数据库更新失败' });
        res.json({ code: 1 });
      });
    };
    checkIdentity(req, res, fn);
  });

  /**
   * 新增文章类型
   * @param {String} id 保存所有文章类型数据的id
   * @param {String} name 文章类型名
   */
  app.get('/api/add-article-type/:id/:name', function(req, res) {
    var fn = function() {
      ArticleTypes.findOneAndUpdate({ _id: ObjectId(req.params.id) }, { $push: { type: req.params.name } }, { new: true }, function(err, doc) {
        if (err) return res.json({ code: 0, msg: '数据库更新失败' });
        res.json({ code: 1, content: doc.type });
      });
    };
    checkIdentity(req, res, fn);
  });

  /**
   * 删除文章类型
   * @param {String} id 保存所有文章类型数据的id
   * @param {String} name 文章类型名
   */
  app.get('/api/del-article-type/:id/:name', function(req, res) {
    var fn = function() {
      ArticleTypes.findOneAndUpdate({ _id: ObjectId(req.params.id) }, { $pull: { type: req.params.name } }, { new: true }, function(err, doc) {
        if (err) return res.json({ code: 0, msg: '数据库删除失败' });
        res.json({ code: 1, content: doc.type });
      });
    };
    checkIdentity(req, res, fn);
  });

  /**
   * 对文章留言
   * @param {String} id 文章id
   */
  app.post('/api/reply/:id', function(req, res) {
    var userId = req.body.userId,
      content = req.body.reply;
    // 对用户提交的信息进行验证
    if (userId != req.session.user._id || content.trim() === '' || content.length > 150) {
      return res.redirect(303, '/article/' + req.params.id);
    }
    Article.findById(req.params.id, function(err, article) {
      if (err) return res.send(500, 'database error');
      var newComment = new Comment({
        _article: req.params.id,
        replyUserId: userId,
        content: content,
        date: new Date().getTime()
      });
      newComment.save(function(err) {
        if (err) return res.render(500, 'database error');
        res.redirect(303, '/article/' + req.params.id);
      });
    });
  });

  /**
   * 对留言者的回复
   * @param {String} id 留言者留言的id
   */
  app.post('/api/reply-someone/:id', function(req, res) {
    var userId = req.body.fromUser,
      content = req.body.content,
      articleId = req.body.articleId;
    if (userId != req.session.user._id || content.trim() === '' || content.length > 150) {
      return res.redirect(303, '/article/' + articleId);
    }
    Comment.findById(ObjectId(req.params.id), function(err, comment) {
      if (err) return res.render(500, 'database error');
      comment.reply.push({
        from: req.body.fromUser,
        to: req.body.toUser,
        content: content,
        date: new Date().getTime()
      });
      comment.save(function(err, comment) {
        if (err) return res.render(500, 'database error');
        res.redirect(303, '/article/' + articleId); // TODO: 可以考虑ajax
      });
    });
  });
};

/**
 * 后台api的身份验证
 * @param req   request对象
 * @param res   response对象
 * @param callback  相关业务的处理方法
 */
function checkIdentity(req, res, callback) {
  if (!req.session.isAdmin) return res.json({ code: 0, msg: '身份非法' });
  callback();
}

function checkAdmin(session) {
  if (!session.isAdmin) return Promise.reject({ code: 9, msg: '身份非法' });
  return Promise.resolve();
}