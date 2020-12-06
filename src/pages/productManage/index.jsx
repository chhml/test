/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable camelcase */
import React, {
  useState, useEffect, useContext, useRef,
} from 'react';
import { useHistory } from 'react-router-dom';
import {
  Input,
  InputNumber,
  Button,
  Table,
  Dropdown,
  Menu,
  Modal,
  Form,
  message,
  Select,
  Tabs,
} from 'antd';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import moment from 'moment';
import ProductStore from '@/stores/productStore';

import InnerPageHead from '@/components/InnerPageHead';
import './style.less';

const { TabPane } = Tabs;
const ProductManage = () => {
  const {
    productList,
    getProductList,
    pagenation,
    synchronizationProduct,
    editProduct,
    removeProduct,
    getCategories,
    productCategory,
  } = useContext(ProductStore);

  const editForm = useRef(null);

  const editCateForm = useRef(null);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [currentRecord1, setCurrentRecord1] = useState({});

  const [editRateModal, setEditRateModal] = useState(false);

  const [confirmRemoveModal, setConfirmRemoveModal] = useState(false);

  const [editCateModal, setEditCateModal] = useState(false);

  const [currentPid, setCurrentPid] = useState('');

  // 分类赛选
  const [currentOrderId, setCurrentOrderId] = useState('');
  // 当前的页码
  const [currentPages, setCurrentPages] = useState(1);
  // 商品详情
  // const [editDetailModal, setEditDetailModal] = useState(false);

  // tab页面
  const [currentTabs, setCurrentTabs] = useState('1');

  const history = useHistory();

  /**
   * 分页获取主播列表
   * @param {*} page
   * @param {*} page_size
   * @param {*} search
   */
  const getProductListAsync = async (page = 1, page_size = 10, search = {}) => {
    await getProductList({
      page,
      page_size,
      search,
      source: +currentTabs,
    });
  };

  const editProductAsync = async (payload) => {
    const result = await editProduct(payload);
    if (result) {
      message.success('修改成功');
      await getProductListAsync();
    } else {
      message.error('修改失败');
    }
  };

  const removeProductAsync = async (id) => {
    const res = await removeProduct(id);
    if (res) {
      message.success('删除成功');
      await getProductListAsync();
    } else {
      message.error('删除失败');
    }
  };
  // tab切换
  const tabsChange = (key) => {
    // console.log('tab切换', key);
    setCurrentTabs(key);
    setCurrentPages(1);
    setCurrentPid('');
    setCurrentOrderId('');
  };

  useEffect(() => { console.log(currentRecord1); }, [currentRecord1]);
  // 查看详情
  // const editDetail = (record) => {
  //   console.log('查看详情', record);
  //   // 设置当前的数据
  //   setCurrentRecord1(record);
  //   // 打开弹窗
  //   setEditDetailModal(true);
  // };

  // 编辑佣金比例
  const editRate = (record) => {
    setCurrentRecord1(record);
    setEditRateModal(true);
    setTimeout(() => {
      editForm.current.setFieldsValue({
        bonus_rate: record.bonus_rate,
        sec_bonus_rate: record.sec_bonus_rate,
        trd_bonus_rate: record.trd_bonus_rate,
      });
    }, 200);
  };

  const setCategory = (record) => {
    setCurrentRecord1(record);
    setEditCateModal(true);
    setTimeout(() => {
      editCateForm.current.setFieldsValue({
        cate_id: record.cate_id,
      });
    }, 200);
  };

  const removeItem = async (record) => {
    setCurrentRecord1(record);
    setConfirmRemoveModal(true);
  };

  const menu = (record) => (
    <Menu style={{ width: '120px', textAlign: 'center', overflow: 'hidden' }}>
      <Menu.Item
        style={{ width: '100%' }}
        onClick={() => editRate(record)}
      >
        <span>
          编辑佣金比例
        </span>
      </Menu.Item>
      {/* <Menu.Item
        style={{ width: '100%' }}
        onClick={() => editDetail(record)}
      >
        <span>
          查看详情
        </span>
      </Menu.Item> */}
      <Menu.Item
        style={{ width: '100%' }}
        onClick={() => setCategory(record)}
      >
        <span>
          设置分类
        </span>
      </Menu.Item>
      <Menu.Item
        style={{ width: '100%' }}
        onClick={() => removeItem(record)}
      >
        <span>
          删除
        </span>
      </Menu.Item>
    </Menu>
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectKeys, selectedRows) => {
      setSelectedRowKeys(selectKeys);
      // setPartProduct(toJS(selectedRows));
      console.log(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.disabled,
    }),
  };

  const productColmns = [
    {
      title: '商品id',
      dataIndex: 'product_id',
      key: '1',
      width: 220,
    },
    {
      title: '商品名称',
      dataIndex: 'product_name',
      key: '2',
      width: 230,
    },
    {
      title: '所在分类',
      dataIndex: 'category_name',
      key: '3',
      width: 130,
      // ellipsis: true,
    },
    {
      title: '商品抖音店id',
      dataIndex: 'tiktok_shop_id',
      key: '4',
      width: 130,
    },
    {
      title: '商品价格',
      key: '5',
      width: 230,
      render: (record) => (
        <div>
          {
            record.sku.map((skuItem) => (
              <p key={skuItem.sku_id}>
                <span>{skuItem.spec_desc}</span>
                <span> ¥ {skuItem.sku_price}</span>
              </p>
            ))
          }
        </div>
      ),
    },
    {
      title: '佣金比例',
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
    {
      title: '创建时间',
      dataIndex: 'create_at',
      key: '10',
      width: 175,
      render: (text) => (
        <span>{moment((text * 1000)).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    },
    {
      title: '操作',
      key: 'operactor',
      fixed: 'right',
      width: 70,
      render: (record) => (
        <Dropdown overlay={() => menu(record)}>
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            菜单
          </a>
        </Dropdown>
      ),
    },
  ];

  /**
   * 选择页
   * @param {*} e
   */
  const changePagination = (e) => {
    setCurrentPages(e.current);
    const obj = {};
    if (currentPid) {
      // obj.tiktok_product_id = currentPid;
      obj.product_name = currentPid;
    }
    if (currentOrderId) {
      obj.cate_id = currentOrderId;
    }
    getProductListAsync(e.current, e.pageSize, obj);
  };

  useEffect(() => {
    getProductListAsync();
    getCategories();
  }, [currentTabs]);

  return (
    <div className="product-manage">
      <InnerPageHead
        className="list-head"
        title="商品管理"
      // hasActive
      />
      <div className="list-content">
        <div className="list-content-inner">
          <Tabs defaultActiveKey={currentTabs} onChange={tabsChange}>
            <TabPane tab="平台商品" key="1" />
            <TabPane tab="抖音商品" key="2" />
          </Tabs>
          <div className="inner-wrap">
            <div className="inner-wrap-head">
              <div className="head-item">
                <span>商品名称：</span>
                <Input
                  style={{ width: '250px' }}
                  value={currentPid}
                  onChange={(e) => {
                    setCurrentPid(e.target.value);
                  }}
                />
                <Button
                  className="search-btn"
                  type="primary"
                  onClick={async () => {
                    setCurrentPages(1);
                    await getProductListAsync(1, 10, {
                      product_name: currentPid,
                    });
                  }}
                >
                  查询
                </Button>
                <Button
                  className="reset-btn"
                  onClick={() => {
                    setCurrentPid('');
                    setCurrentPages(1);
                    getProductListAsync();
                  }}
                >
                  重置
                </Button>
              </div>
              <div className="head-item">
                <span>分类赛选：</span>
                {/* <Input
                  style={{ width: '250px' }}
                  value={currentOrderId}
                  onChange={(e) => {
                    setCurrentOrderId(e.target.value);
                  }}
                /> */}
                <Select
                  style={{ width: 120 }}
                  onChange={(value) => {
                    setCurrentOrderId(value);
                  }}
                >
                  {
                    productCategory.map((item) => (
                      <Select.Option
                        value={item.cate_id}
                        key={item.cate_id}
                      >{item.category_name}
                      </Select.Option>
                    ))
                  }
                </Select>
                <Button
                  className="search-btn"
                  type="primary"
                  onClick={async () => {
                    setCurrentPages(1);
                    await getProductListAsync(1, 10, {
                      cate_id: currentOrderId,
                    });
                  }}
                >
                  查询
                </Button>
                <Button
                  className="reset-btn"
                  onClick={() => {
                    setCurrentOrderId('');
                    setCurrentPages(1);
                    getProductListAsync();
                  }}
                >
                  重置
                </Button>
              </div>
              <div className="head-item">
                <Button
                  type="primary"
                  className="search-btn"
                  onClick={async () => {
                    await synchronizationProduct();
                  }}
                >
                  同步
                </Button>
                {currentTabs === '1' && <Button
                  type="primary"
                  className="reset-btn"
                  onClick={() => {
                    history.push('/addProduct');
                  }}
                >
                  新增
                                        </Button>}

              </div>
            </div>
            <div className="inner-wrap-content">
              <Table
                rowKey={(row) => row.tiktok_product_id}
                columns={productColmns}
                dataSource={productList}
                rowSelection={rowSelection}
                scroll={{ y: '100%', x: '100%' }}
                pagination={{
                  current: currentPages,
                  position: ['none', 'bottomRight'],
                  total: toJS(pagenation).total,
                  // pageSize: pagenation.page_size,
                  defaultCurrent: 1,
                  pageSizeOptions: [10, 20, 50, 100],
                }}
                onChange={changePagination}
              />
            </div>
          </div>
        </div>
      </div>
      {/* 编辑system modal */}
      <Modal
        title="编辑佣金比例"
        visible={editRateModal}
        onOk={async () => {
          console.log(currentRecord1);
          // console.log(editForm.current.getFieldValue());
          const values = editForm.current.getFieldValue();
          const data = {};
          for (const key in values) {
            data[key] = JSON.stringify(values[key]);
          }
          await editProductAsync({
            product_id: currentRecord1.product_id,
            data,
          });
          setEditRateModal(false);
        }}
        onCancel={() => {
          setEditRateModal(false);
        }}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          ref={editForm}
        >
          <Form.Item label="佣金比例">
            <Form.Item
              name="bonus_rate"
              rules={[{ required: true, message: '佣金比例不能为空' }]}
              style={{ display: 'inline-block' }}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item style={{ display: 'inline-block' }}>
              %
            </Form.Item>
          </Form.Item>
          <Form.Item label="二级佣金比例">
            <Form.Item
              name="sec_bonus_rate"
              rules={[{ required: true, message: '二级佣金比例不能为空' }]}
              style={{ display: 'inline-block' }}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item style={{ display: 'inline-block' }}>
              %
            </Form.Item>
          </Form.Item>
          <Form.Item label="团队长佣金比例">
            <Form.Item
              name="trd_bonus_rate"
              rules={[{ required: true, message: '团长佣金比例不能为空' }]}
              style={{ display: 'inline-block' }}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item style={{ display: 'inline-block' }}>
              %
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
      {/* 编辑system modal */}
      {/* 确认删除弹窗 */}
      <Modal
        title="通过"
        visible={confirmRemoveModal}
        onOk={async () => {
          await removeProductAsync(currentRecord1.product_id);
          setConfirmRemoveModal(false);
        }}
        onCancel={() => {
          setConfirmRemoveModal(false);
        }}
      >
        <p>是否删除{currentRecord1.product_name}商品？</p>
      </Modal>
      {/* 确认删除弹窗 */}
      {/* 设置分类 */}
      <Modal
        title="设置分类"
        visible={editCateModal}
        onOk={async () => {
          console.log(currentRecord1);
          // console.log(editForm.current.getFieldValue());
          const values = editCateForm.current.getFieldValue();
          await editProductAsync({
            product_id: currentRecord1.product_id,
            data: values,
          });
          setEditCateModal(false);
        }}
        onCancel={() => {
          setEditCateModal(false);
        }}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          ref={editCateForm}
        >
          <Form.Item
            label="选择分类"
            name="cate_id"
            rules={[{ required: true }]}
          >
            <Select
              style={{ width: 120 }}
            // onChange={(value) => {
            //   setCurrentCate(value);
            // }}
            >
              {
                productCategory.map((item) => (
                  <Select.Option
                    value={item.cate_id}
                    key={item.cate_id}
                  >{item.category_name}
                  </Select.Option>
                ))
              }
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      {/* 设置分类 */}

      {/* 商品详情 */}
      {/* <Modal
        title="商品详情"
        visible={editDetailModal}
        footer={[]}
        width="600px"
        onCancel={() => {
          setEditDetailModal(false);
        }}
      >
        商品详情的内容
      </Modal> */}
      {/* 商品详情 */}
    </div>
  );
};
export default observer(ProductManage);

// import React from 'react';

// const OrderManage = () => (
//   <div>
//     123
//   </div>
// );

// export default OrderManage;
