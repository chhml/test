/*
 * @Author: wzd
 * @Date: 2020-06-17 18:18:07
 * @Description:
 */

import React from 'react';
import { useHistory } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  Input, Button, Form, Carousel,
} from 'antd';
import { observer } from 'mobx-react';

import globalStore from '../../stores/globalStore';
import './style.less';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
  labelAlign: 'left',
};

const LoginPage = () => {
  const history = useHistory();

  const onFinish = async (values) => {
    const { username, password } = values;
    const result = await globalStore.login(username, password);
    if (result) {
      history.push('/anchorManage');
      // window.location.reload = '/anchorManage/anchorManageList';
    }
  };

  const onFinishFailed = (err) => {
    console.log('err', err);
  };

  return (
    <div className="page-login">
      <div className="login-wrap">
        <div className="login-box">
          <Form
            className="login-form"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            {...layout}
          >
            <p className="welcome">欢迎使用，</p>
            <p className="title">大树精选管理后台</p>
            <Form.Item
              label="账号"
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="用户名"
              />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>
            <div className="ant-row ant-form-item">
              <Button className="form-button" shape="round" type="primary" htmlType="submit">
                登录
              </Button>
            </div>
          </Form>
        </div>
        <div className="login-box login-bg">
          <Carousel className="slogen-box" autoplay>
            <div className="banner-item">
              <h1>一步到位，让你的管理更智能</h1>
              {/* <p>鱼付通为您提供便捷点餐、立体营销、智能管理等多功能服务，在高峰期有效分流顾客，精准运营沉淀优质用户，简化管理步骤提升经营效率。</p> */}
            </div>
            {/* <div className="banner-item">
              <h1>这是一句Slogan</h1>
              <p>这是一段宣传文字这是一段宣传文字这是一段宣传文字这是一段宣传文字这是一段宣传文字</p>
            </div>
            <div className="banner-item">
              <h1>这是一句Slogan</h1>
              <p>这是一段宣传文字这是一段宣传文字这是一段宣传文字这是一段宣传文字这是一段宣传文字</p>
            </div> */}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default observer(LoginPage);
