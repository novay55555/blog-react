const apiAccount = require('./account');
const apiArticles = require('./articles');
const apiInside = require('./inside');

// 模块定义, 需要跑哪些测试用例的模块, 添加即可
[apiInside, apiArticles, apiAccount].forEach(apiModule => apiModule());
