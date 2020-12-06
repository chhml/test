import { createContext } from 'react';
import { observable, action, toJS } from 'mobx';
import { post } from '@/services/request.js';

class OrderStore {
    // 订单列表
    @observable orderList = [];

    // 分页
    @observable pagenation = {
      page: 1,
      page_size: 10,
      total: 0,
    }

    // 订单详情
    @observable orderDetail = {}

    // 产品信息
    @observable productList = []

    // 订单追踪tracking
    @observable tracking = []

    // 收获人信息 consignee
    @observable consignee = {}

    // 上级信息parent
    @observable parentMessage = []

    // 团队长信息team_leader
    @observable teamLeader = []

    // 获取到的订单信息列表
    @observable orderListMessage = {}

    // 物流公司的列表TransportList
    @observable transportList = []

    // 物流公司的列表TransportList
    @observable deliveryMessage = ''

    // 退货
    @observable backProductMessage = ''

    // 取消订单
    @observable cancelProductOrderMessage = ''

    /**
     * 获取订单列表
     * @param {*} payload
     */
    @action.bound
    async getOrderList(payload) {
      const result = await post('/api/v1/admin/order/list', payload, false);
      if (result) {
        this.orderList = result.data.list;
        console.log('获取到的订单列表', toJS(this.orderList));
        this.pagenation.total = result.data.total;
        return true;
      }
      return false;
    }

    // 订单详情的数据
    @action.bound
    setOrderDetail(payload) {
      this.orderDetail = payload;
    }

    // 获取订单详情数据
    @action.bound
    async getOrderListMessage(payload) {
      const result = await post('/api/v1/admin/order/detail', payload, false);
      if (result) {
        this.orderListMessage = result.data;
        console.log('获取列表数据ssss', toJS(this.orderListMessage));
        this.productList = [result.data.product];
        this.tracking = result.data.tracking;
        this.consignee = result.data.consignee;
        this.parentMessage = result.data.parent;
        this.teamLeader = result.data.team_leader;
        return true;
      }
      return false;
    }

    // 获取物流公司的列表
    @action.bound
    async getTransportList(payload) {
      const result = await post('/api/v1/admin/logistics/company/list', payload, false);
      if (result) {
        this.transportList = result.data;
        return true;
      }
      return false;
    }

    // 立即发货
    @action.bound
    async deliveryNow(payload) {
      const result = await post('/api/v1/admin/order/deliver', payload, false);
      if (result) {
        this.deliveryMessage = result.data;
        return true;
      }
      return false;
    }

    // 立即退货
    @action.bound
    async backProduct(payload) {
      const result = await post('/api/v1/admin/order/cancel', payload, false);
      if (result) {
        this.backProductMessage = result.data;
        return true;
      }
      return false;
    }

    // 取消订单
    @action.bound
    async cancelProductOrder(payload) {
      const result = await post('/api/v1/admin/order/cancel', payload, false);
      if (result) {
        this.cancelProductOrderMessage = result.data;
        return true;
      }
      return false;
    }
}

export default createContext(new OrderStore());
