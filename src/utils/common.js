const Config = {
  // 是否开启本地测试，为false使用mock文件夹下的mock服务，
  // 如果本地测试地址有改动，请在/build/webpack.dev.js里面修改proxy下"/devApi"的target值
  OPEN_LOCAL_TEST: true,

  // 是否使用线上测试环境，当为true时，build之后使用的是测试环境，为false使用的是生产环境
  USE_TEST_ENV: true,

  // TEST_BASE_URL: 'http://120.26.58.108:9501',
  // PRODUCTION_BASE_URL: 'http://120.26.58.108:9501', // 生产环境的接口地址
  TEST_BASE_URL: 'https://test.bigtree-goods.com',
  PRODUCTION_BASE_URL: 'https://test.bigtree-goods.com', // 生产环境的接口地址
  // TEST_BASE_URL: 'https://api.bigtree-goods.com', // 预发布地址
  // PRODUCTION_BASE_URL: 'https://api.bigtree-goods.com', // 预发布地址
};

export default Config;
