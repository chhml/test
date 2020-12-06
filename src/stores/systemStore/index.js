/* eslint-disable class-methods-use-this */
import { createContext } from 'react';
import { observable, action } from 'mobx';
import { post } from '@/services/request.js';

class SystemStore {
    // 订单列表
    @observable systemList = [];

    // 分页
    @observable pagenation = {
      page: 1,
      page_size: 10,
      total: 0,
    }

    /**
     * 获取订单列表
     * @param {*} payload
     */
    @action.bound
    async getSystemList(payload) {
      const result = await post('/api/v1/admin/system/setting/list', payload, false);
      if (result) {
        this.systemList = result.data.list;
        this.pagenation.total = result.data.total;
        return true;
      }
      return false;
    }

    /**
     * 编辑系统设置
     * @param {*} payload
     */
    @action.bound
    async modifySystemSet(payload) {
      const result = await post('/api/v1/admin/system/setting/edit', payload, false);
      if (result.code === 0) {
        return true;
      }
      return false;
    }
}

export default createContext(new SystemStore());
