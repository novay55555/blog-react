/* eslint-env mocha */
const fs = require('fs');
const chai = require('chai');
const md5 = require('blueimp-md5');
const utils = require('./utils');
const config = require('../lib/config');

const assert = chai.assert;
const { reqHandler, baseURL, publishArticle, signinByAdmin, register } = utils;
const apiStatus = config.api;

module.exports = () => {
  suite('Inside api test', () => {
    test('should be abled to publish an article', done => {
      signinByAdmin()
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
        })
        .then(data => {
          assert.equal(data.code, apiStatus.success.code, 'publish an article success');
          done();
        })
        .catch(err => done(err));
    });

    test('should be abled to update an article', done => {
      publishArticle()
        .then(data => Promise.resolve(data.content._id))
        .then(id => {
          const article = {
            id,
            title: `Api-test${Math.ceil(Math.random() * 100000)}`,
            author: 'admin',
            date: new Date().getTime(),
            description: 'Api-test for editting',
            articleType: 'nodejs',
            content: 'Api-test for editting'
          };
          return reqHandler.put(`${baseURL}/api/inside/article/update`, { body: article });
        })
        .then(data => {
          assert.equal(data.code, apiStatus.success.code, 'update an article success');
          done();
        })
        .catch(err => done(err));
    });

    test('should be abled to delete an article', done => {
      publishArticle()
        .then(data => Promise.resolve(data.content._id))
        .then(id => reqHandler.delete(`${baseURL}/api/inside/article/delete/${id}`))
        .then(data => {
          assert.equal(data.code, apiStatus.success.code, 'delete an article success');
          done();
        })
        .catch(err => done(err));
    });

    test('should be abled to get articles', done => {
      signinByAdmin()
        .then(() => reqHandler.get(`${baseURL}/api/inside/articles/1`))
        .then(data => {
          assert.equal(data.code, apiStatus.success.code, 'get articles success');
          done();
        })
        .catch(err => done(err));
    });

    test('should be abled to search articles by title', done => {
      signinByAdmin()
        .then(() => reqHandler.get(`${baseURL}/api/inside/articles/search/title/${'test'}/1`))
        .then(data => {
          assert.equal(data.code, apiStatus.success.code, 'search articles by title success');
          done();
        })
        .catch(err => done(err));
    });

    test('should be abled to get users', done => {
      signinByAdmin()
        .then(() => reqHandler.get(`${baseURL}/api/inside/users/1`))
        .then(data => {
          assert.equal(data.code, apiStatus.success.code, 'get users success');
          done();
        })
        .catch(err => done(err));
    });

    test('should be abled to search users by name', done => {
      signinByAdmin()
        .then(() => reqHandler.get(`${baseURL}/api/inside/users/search/${'user'}/1`))
        .then(data => {
          assert.equal(data.code, apiStatus.success.code, 'search users success');
          done();
        })
        .catch(err => done(err));
    });

    test('should be abled to delete a user', done => {
      register()
        .then(() => signinByAdmin())
        .then(() => reqHandler.get(`${baseURL}/api/inside/users/1`))
        .then(data => Promise.resolve(data.content.users[0]._id))
        .then(id => reqHandler.delete(`${baseURL}/api/inside/user/delete/${id}`))
        .then(data => {
          assert.equal(data.code, apiStatus.success.code, 'delete a user success');
          done();
        })
        .catch(err => done(err));
    });

    test('should be abled to update a user', done => {
      register()
        .then(() => signinByAdmin())
        .then(() => reqHandler.get(`${baseURL}/api/inside/users/1`))
        .then(data => Promise.resolve(data.content.users[0]._id))
        .then(id => {
          const userData = {
            id,
            password: md5('123456'),
            email: '123@abc.com'
          };
          return reqHandler.put(`${baseURL}/api/inside/user/edit`, { body: userData });
        })
        .then(data => {
          assert.equal(data.code, apiStatus.success.code, 'update a user success');
          done();
        })
        .catch(err => done(err));
    });

    test('should be abled to get admin info', done => {
      signinByAdmin()
        .then(() => reqHandler.get(`${baseURL}/api/inside/admin`))
        .then(data => {
          assert.equal(data.code, apiStatus.success.code, 'get admin info success');
          done();
        })
        .catch(err => done(err));
    });

    test('should be abled to update blog info', done => {
      signinByAdmin()
        .then(() => reqHandler.get(`${baseURL}/api/articles/types`))
        .then(data => Promise.resolve(data.content._id))
        .then(id => {
          const updateData = {
            admin: {
              name: 'admin',
              email: '123@gmail.com'
            },
            types: {
              id,
              data: ['javascript', 'nodejs', 'css']
            }
          };
          return reqHandler.put(`${baseURL}/api/inside/blog`, { body: updateData });
        })
        .then(data => {
          assert.equal(data.code, apiStatus.success.code, 'update blog success');
          done();
        })
        .catch(err => done(err));
    });

    test('should be abled to upload admin avatar', done => {
      const bitmap = fs.readFileSync(`${config.upload.path}/kato.jpg`);
      const base64 = 'data:image/jpg;base64,' + Buffer.from(bitmap).toString('base64');
      signinByAdmin()
        .then(() => reqHandler.get(`${baseURL}/api/inside/admin`))
        .then(data => reqHandler.put(`${baseURL}/api/user/avatar/${data.content._id}`, { body: { avatar: base64 } }))
        .then(data => {
          assert.equal(data.code, apiStatus.success.code, 'upload admin avatar success');
          done();
        })
        .catch(err => done(err));
    });

    test('should be abled to show admin introduce', done => {
      reqHandler.get(`${baseURL}/api/admin`)
        .then(data => {
          assert.equal(data.code, apiStatus.success.code, 'show admin introduce success');
          done();
        })
        .catch(err => done(err));
    })
  });
};
