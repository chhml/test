const Mock = require('mockjs');

module.exports = {
  'POST /merchant/v1/prodct/material/getList': Mock.mock({ // 正确获取物料
    code: 0,
    msg: 'ok',
    'result|10': [{
      id: '@id',
      name: '@cword(5)',
      'stock|80-300': 80,
      'safety|200-300': 0,
      'early_warning|100-200': 100,
      unit: '500克@natural(1, 50)元',
      'count|100-500': 10,
      'status|1-100': 0,
      'dishes|6': [{
        'id|+1': 1002,
        name: '@cword(5)',
      }],
    }],
  }),
  // 'POST /merchant/v1/prodct/material/getList': { // 获取物料报错
  //   code: 999,
  //   msg: '获取错误',
  //   result: '',
  // },
};
