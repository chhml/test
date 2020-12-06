const Mock = require('mockjs');

module.exports = {
  // 用户登录
  'POST /platform/v1/login': Mock.mock({
    code: 0,
    msg: 'ok',
    result: {
      token: '@string(32)',
      refreshToken: '@string(16)',
    },
  }),
};
