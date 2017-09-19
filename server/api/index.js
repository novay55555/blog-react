const express = require('express');
const accountApi = require('./account');
const articleApi = require('./articles');
const insideApi = require('./inside');

const Api = express.Router();

Api.use('/', accountApi);
Api.use('/', articleApi);
Api.use('/', insideApi);

module.exports = Api;
