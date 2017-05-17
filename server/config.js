const config = {
  api: {
    success: {
      code: 1,
      msg: ''
    },
    databaseError: {
      code: 0,
      msg: '数据库操作错误'
    },
    sessionTimeout: {
      code: 2,
      msg: 'Session过期'
    },
    illegalSession: {
      code: 9,
      msg: '非法使用权限'
    }
  }
};

module.exports = config;