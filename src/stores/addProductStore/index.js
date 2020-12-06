/* eslint-disable class-methods-use-this */
import {
  createContext,
} from 'react';
import {
  observable,
  action,
} from 'mobx';
// import { message } from 'antd';
import {
  post,
} from '@/services/request.js';

class AddProductStore {
  // 提现列表
  // @observable productList = [];

  // 商品分类
  @observable productCategory = [];

  // 图片的列表
  @observable imageParams = {}

  // 商品规格
  @observable skuList = [{
    key: 0,
    spec_desc: '',
    sku_price: '',
    sku_stock: '',
  }];

  @action.bound
  addSkuList(payload) {
    this.skuList = payload;
  }

  // @action.bound
  // async getProductList(payload) {
  //     const result = await post('/api/v1/admin/product/list', payload, false);
  //     if (result.code === 0) {
  //         this.productList = result.data.list;
  //         this.pagenation.total = result.data.total;
  //         return true;
  //     }
  //     return false;
  // }

  @action.bound
  async getCategories() {
    const result = await post('/api/v1/admin/product/category', {}, false);
    if (result.code === 0) {
      this.productCategory = result.data;
      return true;
    }
    return false;
  }

  @action.bound
  async getImageParams() {
    const result = await post('/api/v1/api/common/upload/url', {}, false);
    if (result.code === 0) {
      this.imageParams = result.data;
      return true;
    }
    return false;
  }

  // 新增商品
  @action.bound
  async addProduct(payload) {
    const result = await post('/api/v1/admin/product/create', payload, false);
    if (result.code === 0) {
      return true;
    }
    return false;
  }
}

export default createContext(new AddProductStore());
