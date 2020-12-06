/* eslint-disable no-nested-ternary */
import React, { useContext, useEffect, useState } from 'react';
import {
  Input,
  Button,
  Table,
  Modal,
  message,
} from 'antd';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import moment from 'moment';
import WithdrawStore from '@/stores/WithdrawStore';

import InnerPageHead from '@/components/InnerPageHead';
import './style.less';

const WithdrawManage = () => {
  const {
    withdrawList,
    getWithdrawList,
    pagenation,
    passWithdraw,
    rejectWithdraw,
  } = useContext(WithdrawStore);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [searchUid, setSearchUid] = useState('');

  const [searchOrderId, setSearchOrderId] = useState('');

  const [currentRecordId, setCurrentRecordId] = useState('');

  const [adoptModal, setAdoptModal] = useState(false);

  const [refuseModal, setRefuseModal] = useState(false);

  const [remark, setRemark] = useState('');

  // 当前的页码
  const [currentPages, setCurrentPages] = useState(1);

  const withdrawColumns = [
    {
      title: 'tiktok_uid',
      dataIndex: 'tiktok_uid',
      key: '1',
      width: 130,
    },
    {
      title: '订单号',
      dataIndex: 'record_id',
      key: '2',
      width: 130,
    },
    {
      title: '个人信息',
      dataIndex: 'mobile',
      key: '3',
      width: 130,
      render: (text, record) => (
        <>
          <p>{record.nickname}</p>
          <p>{text}</p>
        </>
      ),
    },
    {
      title: '提现金额',
      dataIndex: 'amount',
      key: '4',
      width: 130,
      render: (text) => (
        <span>¥ {text}</span>
      ),
    },
    {
      title: '收款账户',
      // dataIndex: '',
      key: '5',
      width: 130,
      render: (record) => (
        <>
          <p>{record.type_msg}</p>
          <p>{record.info && record.info.account}</p>
          <p>{record.info && record.info.name}</p>
        </>
      ),
    },
    {
      title: '申请时间',
      dataIndex: 'create_at',
      key: '6',
      width: 130,
      render: (text) => (
        <span>{moment((text * 1000)).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (record) => (
        record.status === 1 ? (
          <>
            <a
              className="operater-a"
              onClick={(e) => {
                e.preventDefault();
                setCurrentRecordId(record.record_id);
                setAdoptModal(true);
              }}
            >
              通过
            </a>
            <a
              className="operater-a"
              onClick={(e) => {
                e.preventDefault();
                setCurrentRecordId(record.record_id);
                setRefuseModal(true);
              }}
            >
              拒绝
            </a>
          </>
        ) : record.status === 4 ? <span style={{ color: '#52c41a' }}>已通过</span>
          : <span style={{ color: '#f54d50' }}>已拒绝</span>
      ),
    },
  ];

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

  /**
   * 分页获取主播列表
   * @param {*} page
   * @param {*} page_size
   * @param {*} search
   */
  const getWithdrawListAsync = async (page = 1, page_size = 10, search = {}) => {
    await getWithdrawList({
      page,
      page_size,
      search,
    });
  };

  /**
   * 选择页
   * @param {*} e
   */
  const changePagination = (e) => {
    setCurrentPages(e.current);
    // 判断是否有搜索条件
    const obj = {};
    if (searchUid) {
      obj.tiktok_uid = searchUid;
    }
    if (searchOrderId) {
      obj.record_id = searchOrderId;
    }
    getWithdrawListAsync(e.current, 10, obj);
  };

  const passWithdrawAsync = async (id) => {
    const res = await passWithdraw(id);
    if (res) {
      message.success('处理成功');
      getWithdrawListAsync();
    } else {
      message.error('处理失败');
    }
  };

  const rejectWithdrawAsync = async (id, msg) => {
    const res = await rejectWithdraw(id, msg);
    if (res) {
      message.success('已拒绝');
      getWithdrawListAsync();
    } else {
      message.error('拒绝失败');
    }
  };

  useEffect(() => {
    getWithdrawListAsync();
  }, []);

  return (
    <div className="withdraw-manage">
      <InnerPageHead
        className="list-head"
        title="提现管理"
      />
      <div className="list-content">
        <div className="list-content-inner">
          <div className="inner-wrap">
            <div className="inner-wrap-head">
              <div className="head-item">
                <span>抖音uid：</span>
                <Input
                  style={{ width: '250px' }}
                  value={searchUid}
                  onChange={(e) => setSearchUid(e.target.value)}
                />
                <Button
                  className="search-btn"
                  type="primary"
                  onClick={() => {
                    setCurrentPages(1);
                    getWithdrawListAsync(1, 10, {
                      tiktok_uid: searchUid,
                    });
                  }}
                >
                  查询
                </Button>
                <Button
                  className="reset-btn"
                  onClick={async () => {
                    setCurrentPages(1);
                    setSearchUid('');
                    await getWithdrawListAsync();
                  }}
                >
                  重置
                </Button>
              </div>
              <div className="head-item">
                <span>订单号：</span>
                <Input
                  style={{ width: '250px' }}
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                />
                <Button
                  className="search-btn"
                  type="primary"
                  onClick={() => {
                    setCurrentPages(1);
                    getWithdrawListAsync(1, 10, {
                      record_id: searchOrderId,
                    });
                  }}
                >
                  查询
                </Button>
                <Button
                  className="reset-btn"
                  onClick={async () => {
                    setCurrentPages(1);
                    setSearchOrderId('');
                    await getWithdrawListAsync();
                  }}
                >
                  重置
                </Button>
              </div>
            </div>
            <div className="inner-wrap-content">
              <Table
                rowKey={(row) => row.record_id}
                columns={withdrawColumns}
                dataSource={withdrawList}
                rowSelection={rowSelection}
                scroll={{ y: '100%', x: '100%' }}
                pagination={{
                  current: currentPages,
                  position: ['none', 'bottomRight'],
                  total: toJS(pagenation).total,
                  pageSize: pagenation.page_size,
                  defaultCurrent: 1,
                }}
                onChange={changePagination}
              />
            </div>
          </div>
        </div>
      </div>
      {/* 通过弹窗 */}
      <Modal
        title="通过"
        visible={adoptModal}
        onOk={async () => {
          console.log(currentRecordId);
          await passWithdrawAsync(currentRecordId);
          setAdoptModal(false);
        }}
        onCancel={() => {
          setAdoptModal(false);
        }}
      >
        <p>是否打款已成功？</p>
      </Modal>
      {/* 通过弹窗 */}
      {/* 拒绝弹窗 */}
      <Modal
        title="拒绝"
        visible={refuseModal}
        onOk={async () => {
          console.log(currentRecordId);
          await rejectWithdrawAsync(currentRecordId, remark);
          setRefuseModal(false);
        }}
        onCancel={() => {
          setRefuseModal(false);
        }}
      >
        <p>请输入拒绝原因</p>
        <Input
          value={remark}
          onChange={(e) => {
            setRemark(e.target.value);
          }}
        />
      </Modal>
      {/* 拒绝弹窗 */}
    </div>
  );
};

export default observer(WithdrawManage);
