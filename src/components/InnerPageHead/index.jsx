import React from 'react';
import { Button } from 'antd';
import {
  CloseOutlined,
} from '@ant-design/icons';

import './style.less';

const InnerPageHead = ({
  title, onGetActiveList, onClose, onAdd,
}) => (
    <div className="inner-page-head">
      {title}
      {
        onGetActiveList ? (
          <Button
            className="active-btn"
            onClick={onGetActiveList}
          >
            双十一活动排行榜
          </Button>
        ) : ''
      }
      {
        onAdd ? (
          <Button
            className="active-btn"
            type="primary"
            onClick={onAdd}
          >
            发布公告
          </Button>
        ) : ''
      }
      {
        onClose ? (
          <CloseOutlined className="close-icon" onClick={onClose} />
        ) : ''
      }
    </div>
);

export default InnerPageHead;
