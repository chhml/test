import React, {
  useContext, useEffect, useState, useRef,
} from 'react';
import {
  Table, Modal, Form, Input, message,
} from 'antd';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import NoticeStore from '@/stores/NoticeStore';
import InnerPageHead from '@/components/InnerPageHead';

import './style.less';

const NoticeManage = () => {
  const {
    noticeList,
    getNoticeList,
    pagenation,
    removeNotice,
    editNotive,
    addNotice,
  } = useContext(NoticeStore);

  const editForm = useRef();
  const editForm1 = useRef();

  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [currentRecord, setCurrentRecord] = useState({});

  const [confirmDelModal, setConfirmModal] = useState(false);

  const [editModal, setEditModal] = useState(false);

  const [editModal1, setEditModal1] = useState(false);

  /**
   * 分页获取公告
   * @param {*} page
   * @param {*} page_size
   * @param {*} search
   */
  const getNoticeListAsync = async (page = 1, page_size = 10, search = {}) => {
    await getNoticeList({
      page,
      page_size,
      search,
    });
  };

  const removeNoticeAsync = async (id) => {
    const res = await removeNotice(id);
    if (res) {
      message.success('删除公告成功');
      getNoticeListAsync();
    } else {
      message.error('删除公告失败');
    }
  };

  const editNotiveAsync = async (payload) => {
    const res = await editNotive(payload);
    if (res) {
      message.success('修改成功');
      await getNoticeListAsync();
    } else {
      message.error('修改失败');
    }
  };

  const addNoticeAsync = async (payload) => {
    const res = await addNotice(payload);
    if (res) {
      message.success('发布成功');
      await getNoticeListAsync();
    } else {
      message.error('发布失败');
    }
  };

  const noticeColumns = [
    {
      title: '序号',
      key: '1',
      width: 70,
      render: (record, record1, index) => (
        <span>
          {index + 1}
        </span>
      ),
    },
    {
      title: '公告标题',
      key: '2',
      dataIndex: 'title',
      width: 170,
    },
    {
      title: '内容',
      key: '3',
      dataIndex: 'content',
    },
    {
      title: '操作',
      key: 'operator',
      width: 130,
      render: (record) => (
        <>
          <a
            className="operater-a"
            onClick={(e) => {
              e.preventDefault();
              setCurrentRecord(record);
              setEditModal(true);
              setTimeout(() => {
                editForm.current.setFieldsValue({
                  title: record.title,
                  acontent: record.content,
                });
              }, 200);
            }}
          >
            编辑
          </a>
          <a
            className="operater-a"
            onClick={(e) => {
              e.preventDefault();
              setCurrentRecord(record);
              setConfirmModal(true);
            }}
          >
            删除
          </a>
        </>
      ),
    },
  ];

  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: (selectKeys, selectedRows) => {
  //     setSelectedRowKeys(selectKeys);
  //     // setPartProduct(toJS(selectedRows));
  //     console.log(selectedRows);
  //   },
  //   getCheckboxProps: (record) => ({
  //     disabled: record.disabled,
  //   }),
  // };

  /**
   * 选择页
   * @param {*} e
   */
  const changePagination = (e) => {
    getNoticeListAsync(e.current);
  };

  useEffect(() => {
    getNoticeListAsync();
  }, []);

  useEffect(() => {
    if (editModal && editForm.current) {
      editForm.current.setFieldsValue({
        title: currentRecord.title,
        content: currentRecord.content,
      });
    }
  }, [editModal, editForm.current]);

  return (
    <div className="notice-manage">
      <InnerPageHead
        className="list-head"
        title="公告管理"
        onAdd={() => {
          setEditModal1(true);
        }}
      />
      <div className="list-content">
        <div className="list-content-inner">
          <div className="inner-wrap">
            <div className="inner-wrap-content">
              <Table
                rowKey={(row) => row.create_at}
                columns={noticeColumns}
                dataSource={noticeList}
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
      {/* 删除确认弹窗 */}
      <Modal
        title="确认删除"
        visible={confirmDelModal}
        onOk={async () => {
          await removeNoticeAsync(currentRecord.notice_id);
          setConfirmModal(false);
        }}
        onCancel={() => {
          setConfirmModal(false);
        }}
      >
        <p>是否确认删除公告？</p>
      </Modal>
      {/* 删除确认弹窗 */}
      {/* 编辑公告弹窗 */}
      <Modal
        title="编辑公告"
        visible={editModal}
        onOk={async () => {
          await editNotiveAsync({
            notice_id: currentRecord.notice_id,
            data: editForm.current.getFieldValue(),
          });
          setEditModal(false);
        }}
        onCancel={() => {
          setEditModal(false);
        }}
      >
        <Form
          ref={editForm}
        >
          <Form.Item
            label="公告标题"
            name="title"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
      {/* 编辑公告弹窗 */}
      {/* 编辑公告弹窗 */}
      <Modal
        title="发布公告"
        visible={editModal1}
        onOk={async () => {
          const values = editForm1.current.getFieldValue();
          await addNoticeAsync({
            title: values.title,
            content: values.content,
            summary: '',
            link: '',
          });
          setEditModal1(false);
        }}
        onCancel={() => {
          setEditModal1(false);
        }}
      >
        <Form
          ref={editForm1}
        >
          <Form.Item
            label="公告标题"
            name="title"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
      {/* 编辑公告弹窗 */}
    </div>
  );
};

export default observer(NoticeManage);
