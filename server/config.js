const config = {
  api: {
    success: {
      code: 1,
      msg: '操作成功'
    },
    databaseError: {
      code: 0,
      msg: '数据库操作错误'
    },
    sessionTimeout: {
      code: 2,
      msg: 'Session过期'
    },
    illegalLogin: {
      code: 3,
      msg: '用户名或密码错误'
    },
    userExist: {
      code: 4,
      msg: '用户名已存在'
    },
    paramsRequired: {
      code: 5,
      msg: '参数缺失'
    },
    illegalSession: {
      code: 9,
      msg: '非法使用权限'
    },
    notFount: {
      code: 404,
      msg: 'Not Fount any :('
    },
    error: {
      code: 500,
      msg: 'Server has jjBooooom ;)'
    }
  }
};

module.exports = config;