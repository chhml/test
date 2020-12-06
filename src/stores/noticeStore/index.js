/* eslint-disable class-methods-use-this */
import { createContext } from 'react';
import { observable, action } from 'mobx';
import { post } from '@/services/request.js';

class NoticeStore {
  // 订单列表
  @observable noticeList = [];

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
  async getNoticeList(payload) {
    const result = await post('/api/v1/admin/system/notice/list', payload, false);
    if (result.code === 0) {
      this.noticeList = result.data.list;
      this.pagenation.total = result.data.total;
      return true;
    }
    return false;
  }

  /**
   * 删除公告
   * @param {*} id
   */
  @action.bound
  async removeNotice(id) {
    const result = await post('/api/v1/admin/system/notice/delete', {
      notice_id: id,
    }, false);
    if (result.code === 0) {
      return true;
    }
    return false;
  }

  @action.bound
  async editNotive(payload) {
    const result = await post('/api/v1/admin/system/notice/edit', payload, false);
    if (result.code === 0) {
      return true;
    }
    return false;
  }

  @action.bound
  async addNotice(payload) {
    const result = await post('/api/v1/admin/system/notice/publish', payload, false);
    if (result.code === 0) {
      return true;
    }
    return false;
  }
}

export default createContext(new NoticeStore());
