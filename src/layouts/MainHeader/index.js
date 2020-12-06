/* eslint-disable import/extensions */
import React, { useMemo, useEffect, useState } from 'react';
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
// import { Icon as LegacyIcon } from '@ant-design/compatible';
import {
  Layout, Dropdown, Menu, Row, Col, message, Modal, Form, Input, Button,
} from 'antd';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
// import { toJS } from 'mobx';
import UsePageViews from '../Breadcrumb';

import globalStore from '../../stores/globalStore';

import './style.less';

const MainHeader = () => {
  const [form] = Form.useForm();

  const history = useHistory();

  const menuFlod = useMemo(() => (
    <MenuFoldOutlined className="trigger" onClick={globalStore.toggleCollapsed} />
  ));

  const menuUnFlod = useMemo(() => (
    <MenuUnfoldOutlined className="trigger" onClick={globalStore.toggleCollapsed} />
  ));

  const [visible, setVisible] = useState(false);
  const [accountInfo] = useState(null);
  const quit = () => {
    globalStore.quit();
    history.replace('/login');
    window.localStorage.removeItem('loginInfo');
  };

  // const handleAccount = async () => {
  //   const data = await globalStore.getAccountInfo();
  //   if (data) {
  //     setAccountInfo(globalStore.account);
  //   } else {
  //     message.error('获取用户信息失败');
  //   }
  // };

  useEffect(() => {
    // handleAccount();
  }, []);

  const menu = (
    <Menu>
      <Menu.Item key="0">
        {/* <SmileOutlined /> */}
        &nbsp;
        {accountInfo && (
          <div className="account">
            <div className="line">
              {' '}
              <p>{accountInfo.nickname}</p>{' '}
            </div>
            {/* <div className="line"> <p>工号 : </p><span>{accountInfo.number}</span></div> */}
            <div className="line">
              {' '}
              <p style={{ display: 'inline-block' }}>登录账号 :</p>
              <span style={{ display: 'inline-block' }}>{accountInfo.account}</span>
              <span className="changePass" onClick={() => setVisible(true)}>
                修改密码
              </span>
            </div>
          </div>
        )}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1" onClick={quit} style={{ width: 200 }}>
        <LogoutOutlined />
        &nbsp;退出
      </Menu.Item>
    </Menu>
  );
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };

  const onFinish = async (values) => {
    if (values.oldPass !== values.newPass) {
      const data = await globalStore.editPassword({
        account_id: accountInfo.account_id,
        password: values.oldPass,
        newPassword: values.newPass,
        confirmPassword: values.vertifyPass,
      });
      if (data) {
        setVisible(false);
        form.resetFields();
        quit();
      }
    } else {
      message.error('旧密码不能与新密码一致');
    }
  };
  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };
  return (
    <Layout.Header className="main-header">
      <Row type="flex" style={{ paddingRight: 100 }}>
        <Col>{globalStore.collapsed ? menuUnFlod : menuFlod}</Col>
        <Col style={{ flex: 1 }}>
          {/* <Breadcrumb separator=">" routes={routes} /> */}
          <UsePageViews />
        </Col>
        {/* <Col>
          <UsePageViews />
        </Col> */}
        <Col>
          <div>
            <Dropdown overlay={menu} trigger={['click', 'hover']} placement="bottomCenter">
              <div className="user-info">
                <span className="user-img" />
                <span className="user-name">{accountInfo && accountInfo.nickname}</span>
              </div>
            </Dropdown>
          </div>
        </Col>
      </Row>
      <Modal title="修改密码" visible={visible} onCancel={handleCancel} footer={[]}>
        <p className="editinfo">您正在修改#账号名称#的密码</p>
        <Form {...layout} name="basic" onFinish={onFinish} form={form}>
          <Form.Item label="旧密码" name="oldPass" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="新密码" name="newPass" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="确认密码" name="vertifyPass" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item style={{ position: 'relative' }}>
            <div className="button">
              <Button className="btn" onClick={handleCancel}>
                取消
              </Button>
              <Button className="btn" type="primary" htmlType="submit">
                提交
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </Layout.Header>
  );
};

export default observer(MainHeader);
