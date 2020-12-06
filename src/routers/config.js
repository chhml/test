import { lazy } from 'react';

import BasicLayout from '@/layouts/BasicLayout';
import BlankLayout from '@/layouts/BlankLayout';

const config = [{
  path: '/',
  component: BlankLayout, // 空白页布局
  childRoutes: [
    // 子菜单路由
    {
      path: '/login', // 路由路径
      name: '登录页', // 菜单名称 (不设置,则不展示在菜单栏中）
      // icon: 'setting', // 菜单图标
      component: lazy(() => import('@/pages/Login')), // 懒加载 路由组件
    },
    {
      path: '/',
      // exact: true,
      component: BasicLayout, // 基本布局
      childRoutes: [{
        path: '/anchorManage',
        name: '主播管理',
        icon: 0,
        component: lazy(() => import('@/pages/anchorManage')),
      },
      {
        path: '/withdrawManage',
        name: '提现管理',
        icon: 0,
        component: lazy(() => import('@/pages/withdrawManage')),
      },
      {
        path: '/orderManage',
        name: '订单管理',
        icon: 0,
        component: lazy(() => import('@/pages/orderManage')),
      },
      {
        path: '/productManage',
        name: '商品管理',
        icon: 0,
        component: lazy(() => import('@/pages/productManage')),
        // childRoutes: [{
        //   path: '/productManage/addProduct',
        //   name: '添加商品',
        //   icon: 0,
        //   component: lazy(() => import('@/pages/addProduct')),
        // }],
      },
      {
        path: '/noticeManage',
        name: '公告管理',
        icon: 0,
        component: lazy(() => import('@/pages/noticeManage')),
      },
      {
        path: '/systemSet',
        name: '系统设置',
        icon: 0,
        component: lazy(() => import('@/pages/systemSet')),
      },
      {
        path: '/addProduct',
        name: '添加商品',
        icon: 0,
        unShow: true,
        component: lazy(() => import('@/pages/addProduct')),
      },
      {
        path: '/detailOrder',
        name: '订单详情',
        icon: 0,
        unShow: true,
        component: lazy(() => import('@/pages/detailOrder')),
      },
      ],
    },
  ],
},
{ path: '/', exact: true, redirect: '/anchorManage' },
];

export default config;
