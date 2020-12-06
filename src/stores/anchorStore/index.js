/* eslint-disable class-methods-use-this */
import { createContext } from 'react';
import { observable, action, toJS } from 'mobx';
import { post } from '@/services/request.js';

class AnchorStore {
    // 主播列表
    @observable anchorList = [];

    // 活动列表
    @observable activeList = [];

    // 粉丝列表
    @observable fansList = [];

    // 订单列表
    @observable orderList = [];

    // 主播列表分页信息
    @observable pagenation = {
      page: 1,
      page_size: 10,
      total: 0,
    }

    // 活动列表分页
    @observable pagenationActive = {
      page: 1,
      page_size: 10,
      total: 0,
    }

    // 粉丝列表分析
    @observable pagenationFans = {
      page: 1,
      page_size: 10,
      total: 0,
    }

    // 订单列表分页
    @observable pagenationOrder = {
      page: 1,
      page_size: 10,
      total: 0,
    }

    /**
     * 获取主播列表
     */
    @action.bound
    async getAnchorList(payload) {
      const result = await post('/api/v1/admin/user/list', payload, false);
      if (result.code === 0) {
        this.anchorList = result.data.list;
        this.pagenation.total = result.data.total;
        console.log('主播的数据', toJS(this.anchorList));
        return true;
      }
      return false;
    }

    /**
     * 编辑主播信息
     * @param {*} payload
     */
    @action.bound
    async editAnchor(payload) {
      console.log('编辑的参数', toJS(payload));
      const result = await post('/api/v1/admin/user/edit', payload, false);
      if (result.code === 0) {
        return true;
      }
      return false;
    }

    /**
     * 获取双11活动列表
     * @param {*} payload
     */
    @action.bound
    async getActiveList() {
      const result = await post('/api/v1/admin/user/activity/ranking', {
        activity_id: '1',
      }, false);
      if (result.code === 0) {
        this.activeList = result.data.detail.rank;
        // this.pagenationActive.total = result.data.total;
        return true;
      }
      return false;
    }

    /**
     * 获取粉丝列表
     * @param {*} payload
     */
    @action.bound
    async getFansList(payload) {
      const result = await post('/api/v1/admin/user/fans/list', payload, false);
      if (result.code === 0) {
        this.fansList = result.data.list;
        this.pagenationFans = result.data.total;
        return true;
      }
      return false;
    }

    /**
     * 获取订单列表
     * @param {*} payload
     */
    @action.bound
    async getOrderList(payload) {
      const result = await post('/api/v1/admin/user/order/list', payload, false);
      if (result.code === 0) {
        this.orderList = result.data.list;
        this.pagenationOrder = result.data.total;
        return true;
      }
      return false;
    }

    /**
     * 冻结支付
     * @param {*} payload
     */
    @action.bound
    async frozenOrThaw(payload) {
      const result = await post('/api/v1/admin/user/handle', payload, false);
      if (result.code === 0) {
        return true;
      }
      return false;
    }
}

export default createContext(new AnchorStore());
