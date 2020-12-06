/* eslint-disable class-methods-use-this */
import { createContext } from 'react';
import { observable, action, toJS } from 'mobx';
import { post } from '@/services/request.js';

class WithdrawStore {
    // 提现列表
    @observable withdrawList = [];

    @observable pagenation = {
      page: 1,
      page_size: 10,
      total: 0,
    }

    @action.bound
    async getWithdrawList(payload) {
      const result = await post('/api/v1/admin/withdraw/list', payload, false);
      if (result) {
        this.withdrawList = result.data.list;
        this.pagenation.total = result.data.total;
        console.log('获取的数据', toJS(this.withdrawList));
        return true;
      }
      return false;
    }

    /**
     * 通过提现申请
     * @param {*} id
     */
    @action.bound
    async passWithdraw(id) {
      const result = await post('/api/v1/admin/withdraw/pass', {
        record_id: id,
      }, false);
      if (result.code === 0) {
        return true;
      }
      return false;
    }

    /**
     * 拒绝提现申请
     * @param {*} id
     */
    @action.bound
    async rejectWithdraw(id, remark) {
      const result = await post('/api/v1/admin/withdraw/reject', {
        record_id: id,
        remark,
      }, false);
      if (result.code === 0) {
        return true;
      }
      return false;
    }
}

export default createContext(new WithdrawStore());
