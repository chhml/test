import React, {
  useEffect, useState, useMemo, useCallback,
} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import {
  SmileOutlined,
  HomeOutlined,
  TableOutlined,
  DesktopOutlined,
  WarningOutlined,
  PieChartOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  FileDoneOutlined,
  SettingOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Row } from 'antd';
// import logo from '@/assets/images/logo.png';
import globalStore from '../../stores/globalStore';
import './style.less';

const renderMenuItem = (target, setIcon = null) => target
  .filter((item) => item.path && item.name)
  .map((subMenu) => {
    if (subMenu.childRoutes && !!subMenu.childRoutes.find((child) => child.path && child.name)) {
      return (
        <Menu.SubMenu
          key={subMenu.path}
          title={
            <div>
              {/* {subMenu.icon && <Icon type={subMenu.icon} />} */}
              {setIcon && setIcon(subMenu.icon)}
              <span>{subMenu.name}</span>
            </div>
          }
        >
          {renderMenuItem(subMenu.childRoutes)}
        </Menu.SubMenu>
      );
    }
    if (subMenu.unShow) {
      return null;
    }
    return (
      <Menu.Item key={subMenu.path}>
        <Link to={subMenu.path}>
          <span>
            {setIcon && setIcon(subMenu.icon)}
            <span>{subMenu.name}</span>
          </span>
        </Link>
      </Menu.Item>
    );
  });

const SiderMenu = ({ routes }) => {
  // console.log(routes)
  const { pathname } = useLocation();
  // console.log(pathname);
  const [openKeys, setOpenKeys] = useState([]);
  // 第一层路由
  const [rootSubmenuKeys, setRootSubmenuKeys] = useState([]);

  useEffect(() => {
    const list = pathname.split('/').splice(1);
    setOpenKeys(list.map((item, index) => `/${list.slice(0, index + 1).join('/')}`));
  }, []);

  // 获取第一层Menu
  useEffect(() => {
    const rootSubmenuKeysTemp = [];
    routes.forEach((route) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, val] of Object.entries(route)) {
        if (key === 'path') {
          rootSubmenuKeysTemp.push(val);
        }
      }
    });
    setRootSubmenuKeys(rootSubmenuKeysTemp);
  }, []);

  const getSelectedKeys = useMemo(() => {
    const list = pathname.split('/').splice(1);
    return list.map((item, index) => `/${list.slice(0, index + 1).join('/')}`);
  }, [pathname]);

  const setIcon = useCallback((i) => {
    switch (i) {
      case 0:
        return <SmileOutlined />;
      case 1:
        return <HomeOutlined />;
      case 2:
        return <TableOutlined />;
      case 3:
        return <DesktopOutlined />;
      case 4:
        return <WarningOutlined />;
      case 5:
        return <PieChartOutlined />;
      case 6:
        return <TeamOutlined />;
      case 7:
        return <ShoppingCartOutlined />;
      case 8:
        return <FileDoneOutlined />;
      case 9:
        return <SettingOutlined />;
      case 10:
        return <DatabaseOutlined />;
      default:
        return null;
    }
  }, []);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(
        latestOpenKey ? [latestOpenKey] : [],
      );
    }
  };

  return (
    <Layout.Sider
      trigger={null}
      collapsible
      collapsed={globalStore.collapsed}
      className="main-left-slider"
    >
      <Link to="/">
        <Row type="flex" align="middle" className="main-logo">
          {/* <AndroidOutlined style={{ color: '#13e367' }} />
           */}
          {/* <img src={logo} alt="" style={{ width: 20, height: 20 }} /> */}
          {!globalStore.collapsed && <span className="app-name">{globalStore.appTitle}</span>}
        </Row>
      </Link>
      <Menu
        mode="inline"
        theme="dark"
        style={{ paddingLeft: 0, marginBottom: 0 }}
        className="main-menu"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        selectedKeys={getSelectedKeys}
      >
        {renderMenuItem(routes, setIcon)}
      </Menu>
    </Layout.Sider>
  );
};

export default observer(SiderMenu);
