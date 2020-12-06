/*
 * @Author: wzd
 * @Date: 2020-06-23 10:03:20
 * @Description:
 */
import React from 'react';
import ReactDom from 'react-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

import './styles/main.less';
import AppRouter from './routers/AppRouter';
import './assets/less/public.less';
import './assets/less/antdPublic.less';

moment.locale('zh-cn');

const App = () => (<ConfigProvider locale={zhCN}>
    <AppRouter />
                   </ConfigProvider>
);

ReactDom.render(<App />, document.getElementById('app'));

// 热更新
if (module.hot) {
  module.hot.accept((err) => {
    if (err) {
      console.error('module.hot，', err);
    }
  });
}
