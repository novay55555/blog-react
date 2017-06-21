/* eslint-env mocha */

const chai = require('chai');
const utils = require('./utils');
const config = require('../lib/config');

const assert = chai.assert;
const { reqHandler, baseURL, publishArticle } = utils;
const apiStatus = config.api;

module.exports = () => {
  suite('Articles api test', () => {
    test('should be abled to get articles', done => {
      reqHandler.get(`${baseURL}/api/articles/1`)
        .then(data => {
          assert.equal(data.code, apiStatus.success.code, 'get articles success');
          done();
        });
    });

    test('should be abled to get article types', done => {
      reqHandler.get(`${baseURL}/api/articles/types`)
        .then(data => {
          assert.equal(data.code, apiStatus.success.code, 'get article typs success');
          done();
        });
    });

    test('should be abled to search articles by title', done => {
      reqHandler.get(`${baseURL}/api/articles/search/title/${'test'}/1`)
        .then(data => {
          assert.equal(data.code, apiStatus.success.code, 'search articles by title success');
          done();
        });
    });

    test('should be abled to search articles by type', done => {
      reqHandler.get(`${baseURL}/api/articles/search/type/${'javascript'}/1`)
        .then(data => {
          assert.equal(data.code, apiStatus.success.code, 'search articles by type success');
          done();
        });
    });

    test('should be abled to get an article', done => {
      publishArticle()
        .then(data => Promise.resolve(data.content._id))
        .then(id => reqHandler.get(`${baseURL}/api/article/${id}`))
        .then(data => {
          assert.equal(data.code, apiStatus.success.code, 'get an article success');
          done();
        });
    });
  });
};
