/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable camelcase */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { observer } from 'mobx-react';
import OrderStore from '@/stores/orderStore';
// import InnerPageHead from '@/components/InnerPageHead';
// import { toJS } from 'mobx';
import {
  Button,
  Modal,
  Form,
  Select,
  Input,
  message,
  Image,
  Table,
} from 'antd';

import './style.less';

const detailOrder = () => {
  const {
    orderDetail,
    getOrderListMessage,
    orderListMessage,
    productList,
    tracking,
    getTransportList,
    transportList,
    deliveryNow,
    backProduct,
    cancelProductOrder,
  } = useContext(OrderStore);
  const editCateForm = useRef(null);
  // 物流信息弹窗
  const [editCateModal, setEditCateModal] = useState(false);

  // 选则的是那个物流公司
  const [deliveryChoose, setDeliveryChoose] = useState('');
  // 获取物流公司的列表
  const getTransportListAsync = async () => {
    await getTransportList();
  };

  // 获取订单的信息数据
  const getOrderListMessageAsync = async (orderId) => {
    await getOrderListMessage({
      order_id: orderId,
    });
  };

  useEffect(() => {
    // console.log('订单详情2222111', toJS(orderDetail.order_id));
    // 获取订单信息
    getOrderListMessageAsync(orderDetail.order_id);
    // 获取物流信息
    getTransportListAsync();
  }, []);

  const handleChange = (value) => {
    setDeliveryChoose(value);
  };
  // 弹窗确定立即发货
  const modelDeliver = async () => {
    const values = editCateForm.current.getFieldValue();
    if (!deliveryChoose) {
      message.error('请选择物流公司～');
      return;
    }
    if (!values.logistics_number) {
      message.error('请输入订单号～');
      return;
    }
    // 立即发货

    const result = await deliveryNow({
      order_id: orderDetail.order_id,
      company_id: deliveryChoose,
      logistics_number: values.logistics_number,
    });
    if (result) {
      message.success('发货成功');
    } else {
      message.error('发货失败');
    }
    setEditCateModal(false);
  };

  const productColmns = [
    {
      title: '商品图片',
      // dataIndex: 'cover',
      key: '1',
      width: 220,
      render: (record) => (
        <Image
          width={200}
          src={record.cover}
        />
      ),
    },
    {
      title: '商品名称',
      dataIndex: 'product_name',
      key: '2',
      width: 230,
    },
    {
      title: '商品规格',
      dataIndex: 'category_name',
      key: '3',
      width: 130,
      // ellipsis: true,
    },
    {
      title: '商品价格',
      key: '4',
      width: 230,
      dataIndex: 'total_amount',
    },
    {
      title: '购买数量',
      dataIndex: 'number',
      key: '5',
      width: 130,
    },
    {
      title: '订单金额',
      dataIndex: 'total_amount',
      key: '5',
      width: 130,
    },
    {
      title: '一级佣金比例',
      dataIndex: 'bonus_rate',
      key: '6',
      width: 91,
    },
    {
      title: '二级佣金比例',
      dataIndex: 'sec_bonus_rate',
      key: '7',
      width: 130,
    },
    {
      title: '团队长佣金比例',
      dataIndex: 'trd_bonus_rate',
      key: '9',
      width: 140,
    },
    // {
    //   title: '操作',
    //   key: 'operactor',
    //   fixed: 'right',
    //   width: 70,
    //   render: (record) => (
    //     <Dropdown overlay={() => menu(record)}>
    //       <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
    //         菜单
    //       </a>
    //     </Dropdown>
    //   ),
    // },
  ];

  const selectBefore = (
    <Select placeholder="请选择物流公司" className="select-before" onChange={handleChange}>
      {
        transportList.map((item) => (
          <Select.Option
            value={item.company_id}
            key={item.company_id}
          >{item.company_name}
          </Select.Option>
        ))
      }
    </Select>
  );

  return (<div className="order-detail">
    <div className="list-content">
      <div className="detail-title">
        订单详情
      </div>
      <div className="order-detail-content">
        <div className="order-detail-item">订单号：{orderListMessage.order_id}</div>
        <div className="order-detail-item">订单类型：{orderListMessage.source_txt}</div>
        <div className="order-detail-item">拥金状态：xxxx</div>
        <div className="order-detail-item">物流状态：{orderListMessage.status_txt}</div>
        <div className="order-detail-btn">
          <Button
            type="primary"
            className="btn"
            onClick={() => {
              setEditCateModal(true);
            }}
          >立即发货
          </Button>
          <Button
            danger
            className="btn"
            onClick={async () => {
              const result = await backProduct({ order_id: orderDetail.order_id });
              if (result) {
                message.success('退货成功');
              } else {
                message.error('退货失败');
              }
            }}
          > 退货
          </Button>
          <Button
            danger
            className="btn"
            onClick={async () => {
              const result = await cancelProductOrder({ order_id: orderDetail.order_id });
              if (result) {
                message.success('取消订单成功');
              } else {
                message.error('取消订单失败');
              }
            }}
          >取消订单
          </Button>
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
          {
           tracking.length === 0 ? <div className="no-data">暂无无数据</div>
             : tracking.map((item) => (
              <div className="order-track-item">
                <div className="order-track-child">处理时间</div>
                <div className="order-track-child">处理信息</div>
                <div className="order-track-child">制作人</div>
              </div>
             ))
          }
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
            <div className="order-message-item-title">其他信息</div>
        <div className="order-message-des">总商品金额：{orderListMessage.total_amount}</div>
            <div className="order-message-des">+运费：xxxxxxx</div>
            <div className="order-message-des">-优惠：xxx</div>
        <div className="order-message-des">订单总金额：{orderListMessage.total_amount}</div>
            <div className="order-message-des">拥金：{orderListMessage.bonus_rate}</div>
            <div className="order-message-des">二级拥金：{orderListMessage.sec_bonus_rate}</div>
            <div className="order-message-des">团队长拥金：{orderListMessage.trd_bonus_rate}</div>
          </div>

          <div className="order-message-item">
            <div className="order-message-item-title">商品清单</div>
            <div className="inner-wrap-content">
              <Table
                rowKey={(row) => row.order_id}
                columns={productColmns}
                dataSource={productList}
                scroll={{ y: '100%', x: '100%' }}
              />
            </div>
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
          name="logistics_number"
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
