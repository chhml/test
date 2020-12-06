### 技术栈

涉及的技术栈均采用当前最新的版本和语法：

- 使用 Webpack4.0 构建项目（不使用 create-react-app、umi 等脚手架）；
- 使用 Babel7 配置转换 ES6、React、Mobx 等语法；
- React 版本 V16.12.0，全部采用函数化 Hooks 特性开发项目组件；
- 采用 React-router5 工具 配置项目路由；
- 采用 Mobx5 + Hooks 实现项目数据状态管理；
- 封装 Axios 库实现与后台 http 请求交互；
- UI 库采用流行的 Ant-design4.0 组件库；
- 完整项目实现及模块结构拆分；

### 目录结构

```
├── build                   // webpack配置
│   ├── webpack.common.js   // webpack通用配置
│   ├── webpack.dev.js      // webpack开发环境配置
│   └── webpack.prod.js     // webpack生产环境配置
├── dist                    // 打包输出目录
├── public                  // 项目公开目录
├── src                     // src开发目录
│   ├── assets              // 静态资源
│   ├── components          // 公共组件
│   ├── layouts             // 页面布局组件
│   ├── modules             // 公共业务模块
│   ├── pages               // 具体业务页面
│   ├── routers             // 项目路由配置
│   ├── services            // axios服务等相关
│   ├── stores              // 全局公共 mobx store
│   ├── styles              // 存放公共样式
│   ├── utils               // 工具库/通用函数
│   ├── index.html          // 入口html页面
│   └── main.js             // 项目入口文件
├── .babelrc                // babel配置
├── .editorconfig           // 项目格式配置
├── .eslintrc.js            // ESLint配置
├── .gitignore              // git 忽略配置
├── .postcssrc.js           // postcss配置
├── package.json            // 依赖包配置
└── README.md               // 项目说明
```


### 初始化依赖配置

```bash
yarn install
```

### 开发环境 启动运行

```bash
yarn start
```

### 生产环境 打包构建

> 注意！build的时候，请查看src/utils/common内的配置是否正确

```bash
yarn build  //生产环境 打包构建

yarn build:report // 图形化分析打包文件大小；

yarn build:watch // 方便排查生产环境打包后文件的错误信息（文件source map）；
```

## 网络请求

所有的网络请求进行了一次封装，请使用`src/utils/request.js`文件封装的post或get方法。这两个方法均只接收两个参数：url和data(param)，url指接口地址，data为前端参数

## 前端Mock服务和本地测试服务的切换

在src/utils/common.js里面，进行了一些项目的全局配置，当OPEN_LOCAL_TEST为true的时候，可以开启本地的一个测试，否则使用的是./mock文件夹下的所有前端Mock数据。如如果本地测试环境地址有变动，请在`build/webpack.dev.js`下的devServer/proxy修改`'/devApi'`的target值为新的本地测试接口

## mock文件添加规范

一般来说，mock中一个文件表示某一个模块相关的所有接口，比如user.js里面就是用户相关的接口，格式按照如下所示：
```js
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
```
在mock目录下添加了新的文件就必须在mock/index.js进行注册（引用），引用方式例如：
```js
const user = require('./user');

module.exports = {
  ...user,
};
```
