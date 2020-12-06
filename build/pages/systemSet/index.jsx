/* eslint-disable camelcase */
import React, {
  useEffect, useContext, useState, useRef,
} from 'react';
import {
  Table,
  Modal,
  Form,
  Input,
  message,
} from 'antd';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import SystemStore from '@/stores/systemStore';

import InnerPageHead from '@/components/InnerPageHead';
import './style.less';

const SystemSet = () => {
  const {
    systemList, getSystemList, pagenation, modifySystemSet,
  } = useContext(SystemStore);

  const editForm = useRef(null);

  const [currentRecord, setCurrentRecord] = useState({});

  const [editModal, setEditModal] = useState(false);

  const sysColmns = [
    {
      title: 'id',
      key: '1',
      dataIndex: 'id',
      width: 70,
    },
    {
      title: '配置项',
      dataIndex: 'name',
      key: '2',
      // width: 230,
    },
    {
      title: '内容',
      dataIndex: 'value',
      key: '3',
      width: 230,
      // ellipsis: true,
    },
    {
      title: '操作',
      key: 'operator',
      width: 130,
      render: (record) => (
        <a onClick={(e) => {
          e.preventDefault();
          setCurrentRecord(record);
          setEditModal(true);
          setTimeout(() => {
            editForm.current.setFieldsValue({
              id: record.id,
              name: record.name,
              key: record.key,
              value: record.value,
            });
          }, 200);
        }}
        >
          编辑
        </a>
      ),
    },
  ];

  /**
   * 分页获取主播列表
   * @param {*} page
   * @param {*} page_size
   * @param {*} search
   */
  const getSystemListAsync = async (page = 1, page_size = 10, search = {}) => {
    await getSystemList({
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
    getSystemListAsync(e.current);
  };

  const modifySystemSetAsync = async (payload) => {
    const res = await modifySystemSet(payload);
    if (res) {
      message.success('设置成功');
      getSystemListAsync();
    } else {
      message.error('设置失败');
    }
  };

  useEffect(() => {
    getSystemListAsync();
  }, []);

  return (
    <div className="system-set">
      <InnerPageHead
        className="list-head"
        title="系统设置"
      // hasActive
      />
      <div className="list-content">
        <div className="list-content-inner">
          <div className="inner-wrap">
            <div className="inner-wrap-content">
              <Table
                rowKey={(row) => row.id}
                columns={sysColmns}
                dataSource={systemList}
                // rowSelection={rowSelection}
                scroll={{ y: '100%', x: '100%' }}
                pagination={{
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
      {/* 编辑system modal */}
      <Modal
        title="编辑"
        visible={editModal}
        onOk={async () => {
          console.log(currentRecord);
          // console.log(editForm.current.getFieldValue());
          modifySystemSetAsync(editForm.current.getFieldValue());
          setEditModal(false);
        }}
        onCancel={() => {
          setEditModal(false);
        }}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          ref={editForm}
        >
          <Form.Item
            label="id"
            name="id"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="配置项"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="key"
            name="key"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="内容"
            name="value"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      {/* 编辑system modal */}
    </div>
  );
};

export default observer(SystemSet);
