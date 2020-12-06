/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable camelcase */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { observer } from 'mobx-react';
import OrderStore from '@/stores/orderStore';
// import InnerPageHead from '@/components/InnerPageHead';
import { toJS } from 'mobx';
import {
  Button,
  Modal,
  Form,
  Select,
  Input,
  message,
} from 'antd';

import './style.less';

const { Option } = Select;

const detailOrder = () => {
  const {
    orderDetail,
    getOrderListMessage,
    orderListMessage,
    getTransportList,
    transportList,
    deliveryNow,
  } = useContext(OrderStore);
  const editCateForm = useRef(null);
  // 物流信息弹窗
  const [editCateModal, setEditCateModal] = useState(true);

  // 选则的是那个物流公司
  const [deliveryChoose, seDeliveryChoose] = useState('');
  // 获取订单的信息数据
  const getTransportListAsync = async () => {
    await getTransportList();
  };

  // 获取物流公司的列表
  const getOrderListMessageAsync = async (orderId) => {
    await getOrderListMessage({
      orderId,
    });
  };

  useEffect(() => {
    // console.log('订单详情', toJS(orderDetail.order_id));
    // 获取订单信息
    getOrderListMessageAsync(orderDetail.order_id);
    // 获取物流信息
    getTransportListAsync();
  }, []);

  const handleChange = (value) => {
    seDeliveryChoose(value);
  };
  // 弹窗确定立即发货
  const modelDeliver = async () => {
    // // console.log(editForm.current.getFieldValue());
    const values = editCateForm.current.getFieldValue();
    if (!deliveryChoose) {
      message.error('请选择物流公司～');
      return;
    }
    if (!values.cate_id) {
      message.error('请输入订单号～');
      return;
    }
    // 立即发货
    // await deliveryNow({
    //   product_id: currentRecord1.product_id,
    //   data: values,
    // });
    setEditCateModal(false);
  };

  const selectBefore = (
    <Select placeholder="请选择物流公司" className="select-before" onChange={handleChange}>
      {/* {transportList.map(item=>{

      })} */}
      <Option value="http://">http://</Option>
      <Option value="https://">https://</Option>
    </Select>
  );

  return (<div className="order-detail">
    <div className="list-content">
      <div className="detail-title">
        订单详情
      </div>
      <div className="order-detail-content">
        <div className="order-detail-item">订单号：xxxxxxx</div>
        <div className="order-detail-item">订单类型：平台自营</div>
        <div className="order-detail-item">拥金状态：未结账</div>
        <div className="order-detail-item">物流状态：未结账</div>
        <div className="order-detail-btn">
          <Button
            type="primary"
            className="btn"
            onClick={() => {
              setEditCateModal(true);
            }}
          >立即发货
          </Button>
          <Button danger className="btn"> 退货</Button>
          <Button danger className="btn">取消订单</Button>
        </div>
      </div>
      <div className="order-track">
        <div className="order-track-title">订单追踪</div>
        <div className="order-track-content">
          <div className="order-track-item order-track-border">
            <div className="order-track-child">处理时间</div>
            <div className="order-track-child">处理信息</div>
            <div className="order-track-child">制作人</div>
          </div>
          <div className="order-track-item">
            <div className="order-track-child">处理时间</div>
            <div className="order-track-child">处理信息</div>
            <div className="order-track-child">制作人</div>
          </div>
        </div>
      </div>

      <div className="order-message">
        <div className="order-message-title">订单信息</div>
        <div className="order-message-content">
          <div className="order-message-item">
            <div className="order-message-item-title">收获人信息</div>
            <div className="order-message-des">收货人：xxx</div>
            <div className="order-message-des">地址：xxxxxxx</div>
            <div className="order-message-des">手机号码：xxx</div>
          </div>
          <div className="order-message-item">
            <div className="order-message-item-title">上级信息</div>
            <div className="order-message-des">上级名称：xxx</div>
            <div className="order-message-des">上级uid：xxxxxxx</div>
            <div className="order-message-des">手机号码：xxx</div>
          </div>
          <div className="order-message-item">
            <div className="order-message-item-title">团队长信息</div>
            <div className="order-message-des">上级名称：xxx</div>
            <div className="order-message-des">上级uid：xxxxxxx</div>
            <div className="order-message-des">手机号码：xxx</div>
          </div>
          <div className="order-message-item">
            <div className="order-message-item-title">配送方式</div>
            <div className="order-message-des">物流公司：xxx</div>
            <div className="order-message-des">物流单号：xxxxxxx</div>
            <div className="order-message-des">发货日期：xxx</div>
            <div className="order-message-des">运费：xxx</div>
          </div>
          <div className="order-message-item">
            <div className="order-message-item-title">商品清单</div>
                        表格
          </div>
        </div>
      </div>
      <div className="list-content-inner" />
    </div>
    {/* 立即发货 */}
    <Modal
      visible={editCateModal}
      width="600px"
      onOk={modelDeliver}
      onCancel={() => {
        setEditCateModal(false);
      }}
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        ref={editCateForm}
      >
        <Form.Item
          label="物流信息"
          name="cate_id"
          rules={[{ required: true, message: '商品分类不能为空' }]}
        >
          <Input addonBefore={selectBefore} placeholder="请输入快递单号" size="middle" width="300px" />
        </Form.Item>
      </Form>
    </Modal>
    {/* 设置分类 */}
          </div>);
};

export default observer(detailOrder);
