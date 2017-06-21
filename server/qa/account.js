const chai = require('chai');
const md5 = require('blueimp-md5');
const utils = require('./utils');
const config = require('../lib/config');

const assert = chai.assert;
const { reqHandler, register, signin, baseURL } = utils;
const apiStatus = config.api;

module.exports = () => {
	suite('Account api test', () => {
		test('should be abled to register an account', done => {
			const regData = {
				name: `user${Math.ceil(Math.random() * 100000)}`,
				password: md5('123456'),
				email: ''
			};
			reqHandler.post(`${baseURL}/api/register`, { body: regData })
				.then(data => {
					assert.equal(data.code, apiStatus.success.code, 'register success');
					done();
				});
		});

		test('should be abled to sign in', done => {
			register()
				.then(data => reqHandler.post(`${baseURL}/api/login`, { body: data }))
				.then(data => {
					assert.equal(data.code, apiStatus.success.code, 'sign in success');
					done();
				});
		});

		test('should be abled to sign out', done => {
			signin()
				.then(() => reqHandler.get(`${baseURL}/api/signout`))
				.then(data => {
					assert.equal(data.code, apiStatus.success.code, 'sign out success');
					done();
				});
		});

		test('should be abled to check out session alived', done => {
			signin()
				.then(() => reqHandler.get(`${baseURL}/api/checkout`))
				.then(data => {
					assert.equal(data.code, apiStatus.success.code, 'session is alived');
					done();
				})
		});

		test('should be abled to check out session dead', done => {
			signin()
				.then(() => reqHandler.get(`${baseURL}/api/signout`))
				.then(() => reqHandler.get(`${baseURL}/api/checkout`))
				.then(data => {
					assert.equal(data.code, apiStatus.sessionTimeout.code, 'session is dead');
					done();
				})
		});
	});
};