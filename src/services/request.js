/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-param-reassign */

import axios from 'axios';
import Qs from 'qs';
import { message } from 'antd';

import Config from '../utils/common';

// 本地mock
let baseURL = '';
// 本地测试环境
if (process.env.NODE_ENV === 'development' && Config.OPEN_LOCAL_TEST) {
  baseURL = '/devApi';
}
// 生产环境
if (process.env.NODE_ENV === 'production' && !Config.USE_TEST_ENV && Config.PRODUCTION_BASE_URL) {
  baseURL = Config.PRODUCTION_BASE_URL;
}
// 线上测试环境
if (process.env.NODE_ENV === 'production' && Config.USE_TEST_ENV && Config.TEST_BASE_URL) {
  baseURL = Config.TEST_BASE_URL;
}

const refreshTokenURL = '/platform/v1/login/refreshToken'; // 刷新token接口
const loginURL = '/api/v1/admin/index/login'; // 登录接口

let needSaveToken = false;
let inError = false;
// let prevRequestUrl = '';
// let prevRequestData = null;

// axios的全局配置
axios.defaults.timeout = 20000;
axios.defaults.baseURL = baseURL;
axios.defaults.headers = {
  'Cache-Control': 'no-cache',
  'Content-Type': 'application/json; charset=UTF-8',
  Accept: 'application/json',
};
const instance = axios.create();
/**
 * request请求
 * @param {String} url 地址
 * @param {Object} data 请求体
 */
const request = async (url, data = {}, method = 'post') => {
  const options = {
    url,
    method,
    ifHandleError: true,
    data,
  };

  try {
    const res = await instance(options);
    return res;
  } catch (err) {
    if (options.ifHandleError) {
      message.error(err.message || err.msg || '请求处理失败！');
    }
    return err;
  }
};

/**
 * 发起post请求
 * @param {String} url 接口路径
 * @param {Object} data 请求参数
 * @param {Boolean} onlyData 只返回result数据
 */
export const post = async (url, data, onlyData = true) => {
  const result = await request(url, data);
  // console.log('result', result);
  if (result) {
    if (onlyData) {
      return result.result;
    } else {
      return result;
    }
  } else {
    throw result;
  }
};

/**
 * 发起get请求
 * @param {String} url 接口路径
 * @param {Object} param 请求参数
 * @param {Boolean} onlyData 只返回result数据
 */
export const get = async (url, param, onlyData = true) => {
  const result = await request(url, param, 'get');
  if (result) {
    if (onlyData) {
      return result.result;
    } else {
      return result;
    }
  } else {
    throw result;
  }
};

// 请求拦截器
instance.interceptors.request.use((config) => {
  // if (!config.url.includes(refreshTokenURL)) {
  //   prevRequestUrl = config.url.replace(config.baseURL, '');
  //   prevRequestData = config.data;
  // }

  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  // 如果是进行登录或刷新token  告诉响应拦截器需要更新localStorage
  if (
    config.url.includes(loginURL)
    || config.url.includes(refreshTokenURL)
  ) {
    needSaveToken = true;
  } else {
    needSaveToken = false;
  }

  if (config.method === 'post') {
    const contentType = config.headers['Content-Type'];
    // 根据Content-Type转换data格式
    if (contentType) {
      // 类型 'application/json;'
      // 服务器收到的raw body(原始数据) "{name:"nowThen",age:"18"}"（普通字符串）
      if (contentType.includes('json')) {
        config.data = JSON.stringify(config.data);
      }
      // 类型 'application/x-www-form-urlencoded;'
      // 服务器收到的raw body(原始数据) name=nowThen&age=18
      if (contentType.includes('x-www-form-urlencoded')) {
        config.data = Qs.stringify(config.data);
      }
    }
  }
  return Promise.resolve(config);
}, (err) => Promise.reject(err));

// 响应拦截器
instance.interceptors.response.use(async (res) => {
  // const refreshToken = localStorage.getItem('refreshToken');
  const { code, msg, data } = res.data || {};
  // token过期超时，需要用户重新登录
  if (code === 502) {
    if (!inError) {
      message.warning('登录超时，即将跳转到登录页面...');
      inError = true;
      setTimeout(() => {
        message.destroy();
        window.location.href = '/#/login';
        inError = false;
      }, 2000);
    }
    return Promise.resolve();
  } else if (code == 0) { // 接口返回成功
    // 如果是登录或刷新token接口正确返回
    console.log('needSaveToken', needSaveToken);
    if (needSaveToken) {
      console.log('data:', data);
      localStorage.setItem('token', data);
      // localStorage.setItem('refreshToken', data);
      needSaveToken = false;
    }
    return Promise.resolve(res.data);
  } else { // 其他错误
    message.error(msg.length > 10 ? '请求处理失败！' : msg);
    return Promise.resolve();
  }
}, (err) => {
  if (err.response) {
    return Promise.reject(err.response);
  } else if (err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
    return Promise.reject({ msg: '请求超时' });
  } else {
    return Promise.reject();
  }
});

export default request;
