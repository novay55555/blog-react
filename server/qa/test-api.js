const chai = require('chai');
const md5 = require('blueimp-md5');
const utils = require('./test-util');

const assert = chai.assert;
const { reqHandler } = utils;
const baseUrl = 'http://localhost:3000';

suite('Api Tests', () => {

  // test('should be able to register an account', done => {
  //   const regData = {
  //     name: `user${Math.ceil(Math.random() * 100000)}`,
  //     password: md5('123456'),
  //     email: '174777723@qq.com'
  //   };
  //   reqHandler.post(baseUrl + '/api/register', { body: regData })
  //     .then(data => {
  //       assert(data.code === 1, 'Register success!');
  //       done();
  //     });
  // });

  // test('should be able to sign in', done => {
  //   utils.promiseSignin()
  //     .then(data => {
  //       assert(data.code === 1, 'Sign out success!');
  //       assert.deepProperty(data, 'content.username', 'Sign in feedback a username');
  //       assert.deepPropertyVal(data, 'content.isLogin', true, 'Sign in for true');
  //       assert.deepPropertyVal(data, 'content.isAdmin', false, 'Sign in for only a user');
  //       done();
  //     })
  //     .catch(err => done(err));
  // });

  // test('should be able to sign out', function (done) {
  //   utils.promiseSignin()
  //     .then(() => reqHandler.get(`${baseUrl}/api/signout`))
  //     .then(data => {
  //       assert(data.code === 1, 'Sign out success!');
  //       done();
  //     })
  //     .catch(err => done(err));
  // });

  test('should be able to publish an article', done => {
    utils.promiseSigninByAdmin()
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
      .then(data => {
        assert(data.code === 1, 'Publish an article success');
        done();
      })
      .catch(err => done(err));
  });

  // test('should be able to able to edit an article', function (done) {
  //   rest.post(baseUrl + '/api/login', { data: adminData }).on('success', function (data) {
  //     var newArticle = {
  //       title: '测试标题',
  //       author: 'admin',
  //       date: new Date().getTime(),
  //       description: '测试描述描述',
  //       articleType: 'javascript',
  //       content: '测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容'
  //     };
  //     chai.request(baseUrl).post('/api/article-publish')
  //       .send(newArticle)
  //       .end(function (err, res) {
  //         var articleId = (res.text.substr(res.text.indexOf('data-id')).substr(0, res.text.substr(res.text.indexOf('data-id')).indexOf('">') + 1).match(/\d+/))[0],   // 目前写过最长的获取字符串表达式= =#
  //           newArticle = {
  //             title: '测试标题 - 改',
  //             author: 'admin',
  //             date: new Date().getTime(),
  //             description: '测试描述描述 - 改',
  //             articleType: 'nodejs',
  //             content: '老司机where r u ?老司机where r u ?老司机where r u ?老司机where r u ?老司机where r u ?老司机where r u ?老司机where r u ? '
  //           };
  //         chai.request(baseUrl).post('/api/article-update/' + articleId)
  //           .send(newArticle)
  //           .end(function (err, res) {
  //             var newArticleReg = new RegExp('<td class="title-article">' + newArticle.title + '</td>', 'i');
  //             assert(res.text.match(newArticleReg).length > 0, 'publish article success');
  //             done();
  //           });
  //       });
  //   });
  // });

  //test('should be able to able to delete an article', function (done) {
  //    rest.post(baseUrl + '/api/login', {data: adminData}).on('success', function (data) {
  //        var newArticle = {
  //            title: '测试标题',
  //            author: 'admin',
  //            date: new Date().getTime(),
  //            description: '测试描述描述',
  //            articleType: 'javascript',
  //            content: '测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容'
  //        };
  //        chai.request(baseUrl).post('/api/article-publish')
  //            .send(newArticle)
  //            .end(function (err, res) {
  //                var articleId = (res.text.substr(res.text.indexOf('data-id')).substr(0, res.text.substr(res.text.indexOf('data-id')).indexOf('">') + 1).match(/\d+/))[0];   // 目前写过最长的获取字符串表达式= =#, TODO: 有更简单的思路, 先匹配第一个data-id="", 再获取数字, 有空搞
  //                rest.get(baseUrl + '/api/article-delete/' + articleId).on('success', function (data) {
  //                    assert(data.code === 1, 'delete article successfully');
  //                    done();
  //                });
  //            });
  //    });
  //});

  //test('should be able to edit a user', function (done) {
  //    var userName = 'user' + Math.ceil(Math.random() * 100000),
  //        regData = {
  //            name: userName,
  //            password: md5('123456'),
  //            email: ''
  //        };
  //    rest.post(baseUrl + '/api/register', {data: regData}).on('success', function (data) {
  //        var userId = data.userId;
  //        rest.post(baseUrl + '/api/login', {data: adminData}).on('success', function (data) {
  //            var editData = {
  //                id: userId,
  //                password: '99998',
  //                email: '998@gmail.com'
  //            };
  //            rest.post(baseUrl + '/api/user-edit', {data: editData}).on('success', function (data) {
  //                assert(data.code === 1, 'edit user successfully');
  //                done();
  //            });
  //        });
  //    });
  //});

  //test('should be able to delete a user', function (done) {
  //    var userName = 'user' + Math.ceil(Math.random() * 100000),
  //        regData = {
  //            name: userName,
  //            password: md5('123456'),
  //            email: ''
  //        };
  //    rest.post(baseUrl + '/api/register', {data: regData}).on('success', function (data) {
  //        var userId = data.userId;
  //        rest.post(baseUrl + '/api/login', {data: adminData}).on('success', function (data) {
  //            rest.get(baseUrl + '/api/user-delete/' + userId).on('success', function (data) {
  //                assert(data.code === 1, 'edit user successfully');
  //                done();
  //            });
  //        });
  //    });
  //});

  // 参考 https://github.com/chaijs/chai-http
  //test('should be able to search articles by title', function (done) {
  //    var searchTitle = {title: '测试'};
  //    chai.request(baseUrl).get('/search').query(searchTitle).end(function (err, res) {
  //        console.log(res);
  //        assert(res.status === 200, 'search article success');
  //        done();
  //    });
  //});

  // test('should be able to load more articles', function (done) {
  //     rest.get(baseUrl + '/api/load-more-article/1').on('success', function (data) {
  //         assert(data.code === 1, 'load articles successfully');
  //         done();
  //     });
  // });

  // test('should be able to change admin\'s account', function (done) {
  //     rest.get(baseUrl + '/api/change-admin-account/gunhawk').on('success', function (data) {
  //         assert(data.code === 1, 'change admin\s account successfully');
  //         done();
  //     });
  // });
  //
  // test('should be able to add an article type', function (done) {
  //     rest.get(baseUrl + '/api/add-article-type/570f84b00be67efb038631ab/test').on('success', function (data) {
  //         assert(data.code === 1, 'add an article type successfully');
  //         done();
  //     });
  // });

  // test('should be able to delete an article type', function (done) {
  //     rest.get(baseUrl + '/api/add-article-type/570f84b00be67efb038631ab/test').on('success', function () {
  //         rest.get(baseUrl + '/api/del-article-type/570f84b00be67efb038631ab/test').on('success', function (data) {
  //             assert(data.code === 1, 'delete an article type successfully');
  //             done();
  //         });
  //     });
  // });

  // test('should be abled to change admin\'s password', function (done) {
  //   rest.post(baseUrl + '/api/change-admin-password/', { data: { password: md5('111111') } }).on('success', function (data) {
  //     assert(data.code === 1, 'change admin\s password successfulluy');
  //     done();
  //   });
  // });

});