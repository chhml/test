import { observable, action } from 'mobx';
import { message } from 'antd';
import { post } from '../services/request';

class GlobalStore {
    @observable appTitle = '大树后台管理';

    @observable collapsed = false; // 菜单收起展开

    @observable curTab = []; // 当前打开的tab

    @observable reloadPath = ''; // 当前tab刷新的地址

    @observable userInfo = {
      // 当前用户信息
      loginName: 'nowThen',
    };

    @observable account = {};

    @observable basicInfoList = {};

    @action.bound toggleCollapsed() {
      this.collapsed = !this.collapsed;
    }

    @action.bound setData(data = {}) {
      Object.entries(data).forEach((item) => {
        this[item[0]] = item[1];
      });
    }

    @action.bound
    async login(mobile, password) {
      const res = await post('/api/v1/admin/index/login', {
        mobile,
        password,
      }, false);
      if (res) {
        console.log('result', res);
        this.userInfo.loginName = mobile;
        // localStorage.setItem('token', JSON.stringify(res.data));
        return true;
      }
      return false;
    }

    @action.bound
    quit() {
      this.userInfo.loginName = '';
      localStorage.clear();
    }

    // 获取账号信息
    @action.bound
    async getAccountInfo() {
      const data = await post('/platform/v1/account/detail');
      if (data) {
        this.account = data;
        this.basicInfoList = data;
        return true;
      } else {
        return false;
      }
    }

    // 修改密码
    @action.bound
    // eslint-disable-next-line class-methods-use-this
    async editPassword(obj) {
      const data = await post('/platform/v1/account/changePassword', obj);
      if (data) {
        message.success('密码修改成功');
        return true;
      } else {
        message.error('密码修改失败');
        return false;
      }
    }
}

export default new GlobalStore();
