/* eslint-disable class-methods-use-this */
import { createContext } from 'react';
import { observable, action } from 'mobx';
import { message } from 'antd';
import { post } from '@/services/request.js';

class ProductStore {
    // 提现列表
    @observable productList = [];

    // 商品分类
    @observable productCategory = [];

    @observable pagenation = {
      page: 1,
      page_size: 10,
      total: 0,
    }

    @action.bound
    async getProductList(payload) {
      const result = await post('/api/v1/admin/product/list', payload, false);
      if (result.code === 0) {
        this.productList = result.data.list;
        this.pagenation.total = result.data.total;
        return true;
      }
      return false;
    }

    /**
     * 同步商品
     */
    @action.bound
    async synchronizationProduct() {
      const result = await post('/api/v1/admin/product/sync', {}, false);
      if (result.code === 0) {
        message.success(result.msg);
      } else {
        message.error(result.msg);
      }
    }

    /**
     * 编辑商品
     * @param {*} payload
     */
    @action.bound
    async editProduct(payload) {
      const result = await post('/api/v1/admin/product/edit', payload, false);
      if (result.code === 0) {
        return true;
      }
      return false;
    }

    /**
     * 删除商品
     * @param {*} id
     */
    @action.bound
    async removeProduct(id) {
      const result = await post('/api/v1/admin/product/delete', { product_id: id }, false);
      if (result.code === 0) {
        return true;
      }
      return false;
    }

    @action.bound
    async getCategories() {
      const result = await post('/api/v1/admin/product/category', {}, false);
      if (result.code === 0) {
        this.productCategory = result.data;
        return true;
      }
      return false;
    }
}

export default createContext(new ProductStore());
