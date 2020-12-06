import React from 'react';
import { Table } from 'antd';

import InnerPageHead from '../InnerPageHead';
import './style.less';

const ListWrapModal = ({
  isOpened = false,
  title, columns = [],
  tableDataSource = [],
  onClose, pagination = {},
  onChangePagination,
}) => {
  console.log('list-wrap-modal');
  return (
    <div
      className="list-wrap-modal"
      style={{ display: isOpened ? '' : 'none' }}
    >
      <InnerPageHead
        title={title}
        onClose={onClose}
      />
      <div className="list-wrap-modal-content">
        <Table
          rowKey={(row) => row.user_id}
          columns={columns}
          dataSource={tableDataSource}
          scroll={{ y: '100%', x: '100%' }}
          pagination={{
            position: ['none', 'bottomRight'],
            total: pagination.total,
            pageSize: pagination.page_size,
            defaultCurrent: 1,
          }}
          onChange={onChangePagination}
        />
      </div>
    </div>
  );
};

export default ListWrapModal;
