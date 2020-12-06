import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { observer } from 'mobx-react';

const breadcrumbNameMap = {
  '/merchantManage': '商户管理',
  '/merchantManage/merchantManageList': '商家列表',
  '/purchase': '供应商管理',
  '/purchase/shopList': '供应商列表',
  '/insight': '智能财务',
  '/insight/RevenueStatement': '收支统计',
  '/insight/MaterialAnalysis': '营业报表',
  '/insight/orderManage': '订单管理',
  '/usermanage': '用户管理',
  '/usermanage/userInfo': '用户信息',
  '/jurisdictionManage': '权限管理',
  '/agency': '代理商管理',
  '/agency/new': '新增代理商',
  '/agency/list': '代理商列表',
  '/agency/order': '交易订单',
};

function UsePageViews() {
  const location = useLocation();
  console.log(location, 'location');
  let pathSnippets = null;
  let extraBreadcrumbItems = null;

  function getPath() {
    pathSnippets = location.pathname.split('/').filter((i) => i);
    extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      return (<Breadcrumb.Item key={url}>
                <Link to={url}> { breadcrumbNameMap[url] }
                </Link>
              </Breadcrumb.Item>
      );
    });
  }
  getPath();

  return (<div>
        <Breadcrumb style={
            { lineHeight: '64px' }
        }
        >
        { extraBreadcrumbItems }
        </Breadcrumb>
          </div>
  );
}
export default observer(UsePageViews);
