// import React, { useEffect, useState } from 'react';
// import { Layout, message } from 'antd';
// import { useHistory, useLocation } from 'react-router-dom';
// import { observer } from 'mobx-react';

// import SiderMenu from '../SiderMenu';
// import MainHeader from '../MainHeader';
// import TabPanes from '../TabPanes';

// import menu from '../../routers/routes';
// import globalStore from '../../stores/globalStore';

// import { getKeyName } from '../../assets/js/publicFunc';

// import './style.less';

// // const TabPane = Tabs.TabPane;

// const BasicLayout = () => {
//   const history = useHistory();
//   const location = useLocation();
//   const { pathname, search } = location;
//   const [tabActiveKey, setTabActiveKey] = useState('workbench');
//   const [panesItem, setPanesItem] = useState({});
//   const [noNewTab] = useState(['/login']);

//   // 组件初始化
//   useEffect(() => {
//     if (!localStorage.getItem('token')) {
//       message.warning('请先登录！');
//       history.replace('/login');
//     }

//     // 判断是否需要在窗口小于1366时隐藏菜单项
//     if (document.body.clientWidth <= 1366) {
//       globalStore.setData('collapsed', true);
//       return;
//     }
//     globalStore.setData('collapsed', false);
//   }, []);

//   // 监听URL上的地址的变化，当有变化时，将panesItem、tabActiveKey传给TabPanes
//   useEffect(() => {
//     const { tabKey, title, component: Content } = getKeyName(pathname);
//     // 新tab已存在或不需要新建tab，return
//     if (noNewTab.includes(pathname)) {
//       setTabActiveKey(tabKey);
//       return;
//     }

//     // 检查权限，比如直接从地址栏输入的，提示无权限
//     // const isHasAuth = this.checkAuth(newPathname);
//     // if (!isHasAuth) {
//     //   const errorUrl = '/403'
//     //   const {
//     //     tabKey: errorKey,
//     //     title: errorTitle,
//     //     component: errorContent
//     //   } = getKeyName(errorUrl)
//     //   this.setState({
//     //     panesItem: {
//     //       title: errorTitle,
//     //       content: errorContent,
//     //       key: errorKey,
//     //       closable: true,
//     //       path: errorUrl
//     //     },
//     //     tabActiveKey: errorKey
//     //   })
//     //   history.replace(errorUrl)
//     //   return
//     // }

//     setPanesItem({
//       title,
//       content: Content,
//       key: tabKey,
//       closable: tabKey !== 'home',
//       path: search ? pathname + search : pathname,
//     });
//     setTabActiveKey(tabKey);
//   }, [pathname, search]);

//   return (
//     <Layout className="main-layout">
//       <SiderMenu routes={menu} />
//       {/* 左侧菜单导航 */}
//       <Layout className="main-layout-right">
//         <MainHeader />
//         <Layout.Content className="main-layout-content">
//           {}
//           {/* <TabPanes
//             defaultActiveKey="home"
//             panesItem={panesItem}
//             tabActiveKey={tabActiveKey}
//           /> */}
//         </Layout.Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default observer(BasicLayout);

import React, { useEffect } from 'react';
import { Layout, message } from 'antd';
import { useHistory } from 'react-router-dom';

// import useInterval from '../../utils/useInterval';

import SiderMenu from '../SiderMenu';
import MainHeader from '../MainHeader';
// import MainTabs from '../MainTabs';

import './style.less';

const BasicLayout = ({ route, children }) => {
  const history = useHistory();

  // useInterval(() => {
  //   console.log(new Date());
  // }, 5000);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      message.warning('请先登录！');
      history.push('/login');
    }
  });

  return (
    <Layout className="main-layout">
      <SiderMenu routes={route.childRoutes} />
      {/* 左侧菜单导航 */}
      <Layout className="main-layout-right">
        <MainHeader />
        <Layout.Content className="main-layout-content">
          {children}
          {/* <MainFooter></MainFooter> */}
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
