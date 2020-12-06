/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import React, { useState, useEffect, useContext } from 'react';
import {
  Input,
  Button,
  Table,
  Menu,
  Dropdown,
  Modal,
  message,
  Radio,
} from 'antd';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import moment from 'moment';
import AnchorStore from '@/stores/anchorStore';

import InnerPageHead from '@/components/InnerPageHead';
import ListWrapModal from '@/components/ListWrapModal';
import './style.less';
// 活动列表还是粉丝列表或者订单
const modalObj = {
  active: 1,
  fans: 2,
  order: 3,
};

const AnchorManageList = () => {
  const {
    anchorList,
    getAnchorList,
    activeList,
    fansList,
    orderList,
    pagenation,
    pagenationActive,
    pagenationFans,
    pagenationOrder,
    editAnchor,
    getActiveList,
    getFansList,
    getOrderList,
    frozenOrThaw,
  } = useContext(AnchorStore);
  // 多选的数组
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // 搜索的uid
  const [searchUid, setSearchUid] = useState('');
  // 电话号码
  const [searchMobile, setSearchMobile] = useState('');
  // 控制modal是显示活动列表还是粉丝列表或者订单
  const [isShowActive, setIsShowActive] = useState(modalObj.active);

  // 双十一活动排行榜
  const [listModalOpened, setListModalOpened] = useState(false);

  // 每次打开弹窗的对应项的数据
  const [currentRecord, setCurrentRecord] = useState({});

  // 弹出层的数据
  const [editParentUidModal, setEditParentUidModal] = useState(false);

  const [currentParentUid, setCurrentParentUid] = useState('');

  const [editTikUidModal, setEditTikUidModal] = useState(false);

  const [currentTikUid, setCurrentTikUid] = useState('');

  const [editOriginModal, setEditOriginModal] = useState(false);

  const [currentOrigin, setCurrentOrigin] = useState('');

  const [editLeaderModal, setEditLeaderModal] = useState(false);

  const [currentLeader, setCurrentLeader] = useState('');

  const [confirmFrozenModal, setConfirmFrozenModal] = useState(false);

  // 当前的页码
  const [currentPages, setCurrentPages] = useState(1);

  /**
   * 分页获取主播列表
   * @param {*} page
   * @param {*} page_size
   * @param {*} search
   */
  const getAnchorListAsync = async (page = 1, page_size = 10, search = {}) => {
    await getAnchorList({
      page,
      page_size,
      search,
    });
  };

  const getActiveListAsync = async () => {
    await getActiveList();
  };

  const getFansListAsync = async (user_id, page = 1, page_size = 10, search = {}) => {
    await getFansList({
      page,
      page_size,
      search,
      user_id,
    });
  };

  const getOrderListAsync = async (user_id, page = 1, page_size = 10, search = {}) => {
    await getOrderList({
      page,
      page_size,
      search,
      user_id,
    });
  };

  /**
   * 冻结或解冻，现在只支持冻结
   */
  const frozenOrThawAsync = async (payload) => {
    const res = await frozenOrThaw(payload);
    if (res) {
      message.success('操作成功');
      await getAnchorListAsync(1, 10);
    } else {
      message.error('操作失败');
    }
  };
  // 根据searchUid 搜索
  const onSearch = () => {
    if (searchUid) {
      // 搜索前需要把页码设置成第一页
      setCurrentPages(1);
      getAnchorListAsync(1, 10, {
        tiktok_uid: searchUid,
      });
    }
  };
  // 重置
  const onReset = async () => {
    setCurrentPages(1);
    setSearchUid('');
    await getAnchorListAsync();
  };

  const onSearch1 = () => {
    setCurrentPages(1);
    getAnchorListAsync(1, 10, {
      mobile: searchMobile,
    });
  };

  const onReset1 = async () => {
    setCurrentPages(1);
    setSearchMobile('');
    await getAnchorListAsync();
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectKeys, selectedRows) => {
      // console.log("多选了111",selectKeys, selectedRows)
      setSelectedRowKeys(selectKeys);
      // setPartProduct(toJS(selectedRows));
      console.log(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.disabled,
    }),
  };

  // 编辑uid
  const editParentUid = (record) => {
    setCurrentParentUid(record.parent_tiktok_uid);
    setCurrentRecord(record);
    setEditParentUidModal(true);
  };

  const editTikUid = (record) => {
    setCurrentTikUid(record.tiktok_uid);
    setCurrentRecord(record);
    setEditTikUidModal(true);
  };

  const editIsOrigin = (record) => {
    setCurrentOrigin(record.is_origin);
    setCurrentRecord(record);
    setEditOriginModal(true);
  };

  const checkOrder = async (record) => {
    await getOrderListAsync(record.user_id, 1, 10);
    setCurrentRecord(record);
    setIsShowActive(modalObj.order);
    setListModalOpened(true);
  };

  const checkFans = async (record) => {
    await getFansListAsync(record.user_id, 1, 10);
    setCurrentRecord(record);
    setIsShowActive(modalObj.fans);
    setListModalOpened(true);
  };

  const editLeader = (record) => {
    setCurrentLeader(record.is_team_leader);
    setCurrentRecord(record);
    setEditLeaderModal(true);
  };

  /**
   * 冻结或解冻
   * @param {*} record
   */
  const frozen = async (record) => {
    setCurrentRecord(record);
    setConfirmFrozenModal(true);
  };

  const menu = (record) => (
    <Menu style={{ width: '120px', textAlign: 'center', overflow: 'hidden' }}>
      <Menu.Item
        style={{ width: '100%' }}
        onClick={() => editParentUid(record)}
      >
        <span>
          编辑上级uid
        </span>
      </Menu.Item>
      <Menu.Item
        style={{ width: '100%' }}
        onClick={() => editTikUid(record)}
      >
        <span>
          编辑抖音uid
        </span>
      </Menu.Item>
      <Menu.Item
        style={{ width: '100%' }}
        onClick={() => editIsOrigin(record)}
      >
        <span>
          设置源用户
        </span>
      </Menu.Item>
      <Menu.Item
        style={{ width: '100%' }}
        onClick={() => checkOrder(record)}
      >
        <span>
          查看订单
        </span>
      </Menu.Item>
      <Menu.Item
        style={{ width: '100%' }}
        onClick={() => checkFans(record)}
      >
        <span>
          查看粉丝
        </span>
      </Menu.Item>
      <Menu.Item
        style={{ width: '100%' }}
        onClick={() => editLeader(record)}
      >
        <span>
          设置团队长
        </span>
      </Menu.Item>
      <Menu.Item
        style={{ width: '100%' }}
        onClick={() => frozen(record)}
      >
        <span>
          冻结/解冻
        </span>
      </Menu.Item>
    </Menu>
  );

  // 主播表头
  const anchorColmns = [
    {
      title: '用户uid',
      dataIndex: 'user_id',
      key: '1',
      width: 130,
    },
    {
      title: '微信昵称',
      dataIndex: 'nickname',
      key: '2',
      width: 130,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: '3',
      width: 130,
    },
    {
      title: '抖音uid',
      dataIndex: 'tiktok_uid',
      key: '4',
      width: 130,
    },
    {
      title: '抖音号',
      dataIndex: 'tiktok_nickname',
      key: '5',
      width: 130,
    },
    {
      title: '源用户',
      dataIndex: 'is_origin',
      key: '6',
      width: 130,
      render: (text) => <span>{text ? '是' : '否'}</span>,
    },
    // {
    //   title: '抖音订单号',
    //   dataIndex: '',
    //   key: '6',
    //   width: 130,
    // },
    {
      title: '身份',
      dataIndex: 'is_team_leader',
      key: '7',
      width: 70,
      render: (text) => <span>{text ? '团长' : '队员'}</span>,
    },
    {
      title: '上级uid',
      dataIndex: 'parent_tiktok_uid',
      key: '8',
      width: 130,
    },
    {
      title: '累计销售金额',
      dataIndex: 'total_sell_amount',
      key: '9',
      width: 130,
    },
    {
      title: '累计佣金',
      dataIndex: 'total_bonus',
      key: '10',
      width: 130,
    },
    {
      title: '当前余额',
      dataIndex: 'available',
      key: '11',
      width: 92,
    },
    {
      title: '下级数量',
      dataIndex: 'fans_amount',
      key: '12',
      width: 92,
    },
    {
      title: '入驻时间',
      dataIndex: 'create_at',
      key: '13',
      width: 190,
      render: (text) => (
        <span>{moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (record) => (
        <Dropdown overlay={() => menu(record)}>
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            菜单
          </a>
        </Dropdown>
      ),
    },
  ];

  // 双11活动表头
  const activeColumns = [
    {
      title: '用户uid',
      dataIndex: 'user_id',
      key: '1',
      width: 130,
    },
    {
      title: '微信昵称',
      dataIndex: 'nickname',
      key: '2',
      width: 130,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: '3',
      width: 130,
    },
    {
      title: '累计销售金额',
      dataIndex: 'total_amount',
      key: '9',
      width: 130,
    },
  ];

  // 粉丝
  const fansColumns = [
    {
      title: '用户uid',
      dataIndex: 'user_id',
      key: '1',
      width: 130,
    },
    {
      title: '微信昵称',
      dataIndex: 'nickname',
      key: '2',
      width: 130,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: '3',
      width: 130,
    },
    {
      title: '抖音uid',
      dataIndex: 'tiktok_uid',
      key: '4',
      width: 130,
    },
    {
      title: '抖音号',
      dataIndex: 'tiktok_nickname',
      key: '5',
      width: 130,
    },
    {
      title: '抖音订单号',
      dataIndex: '',
      key: '6',
      width: 130,
    },
    {
      title: '身份',
      dataIndex: 'is_team_leader',
      key: '7',
      width: 70,
    },
    {
      title: '上级uid',
      dataIndex: 'parent_tiktok_uid',
      key: '8',
      width: 130,
    },
    {
      title: '累计销售金额',
      dataIndex: 'total_sell_amount',
      key: '9',
      width: 130,
    },
    {
      title: '累计佣金',
      dataIndex: 'total_bonus',
      key: '10',
      width: 130,
    },
    {
      title: '当前余额',
      dataIndex: 'available',
      key: '11',
      width: 92,
    },
    {
      title: '下级数量',
      dataIndex: 'fans_amount',
      key: '12',
      width: 92,
    },
    {
      title: '入驻时间',
      dataIndex: 'create_at',
      key: '13',
      width: 190,
      render: (text) => (
        <span>{moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    },
  ];

  // 订单
  const orderColumns = [
    {
      title: 'uid',
      dataIndex: 'uid',
      key: '1',
      width: 113,
    },
    {
      title: '订单号',
      dataIndex: 'order_id',
      key: '2',
      width: 130,
    },
    {
      title: '商品信息',
      dataIndex: 'product_name',
      key: '3',
      width: 230,
      // ellipsis: true,
    },
    {
      title: '订单金额',
      dataIndex: 'total_amount',
      key: '4',
      width: 130,
      render: (text) => (
        <span>¥ {text}</span>
      ),
    },
    {
      title: '佣金比例',
      dataIndex: 'bonus_rate',
      key: '5',
      width: 91,
    },
    {
      title: '佣金',
      dataIndex: 'bonus',
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
      title: '二级佣金',
      dataIndex: 'sec_bonus',
      key: '8',
      width: 91,
    },
    {
      title: '团队长佣金比例',
      dataIndex: 'trd_bonus_rate',
      key: '9',
      width: 140,
    },
    {
      title: '团队长佣金',
      dataIndex: 'trd_bonus',
      key: '10',
      width: 130,
    },
    {
      title: '订单状态',
      dataIndex: 'status_msg',
      key: '11',
      width: 115,
    },
    {
      title: '佣金状态',
      dataIndex: '',
      key: '12',
      width: 115,
    },
  ];

  /**
   * 选择页 改变页码和每页的条数
   * @param {*} e
   */
  const changePagination = (e) => {
    const obj = {};
    if (searchMobile) {
      obj.mobile = searchMobile;
    }
    if (searchUid) {
      obj.tiktok_uid = searchUid;
    }
    getAnchorListAsync(e.current, e.pageSize, obj);
    setCurrentPages(e.current);
  };

  const onChangePagination = (e) => {
    if (isShowActive === modalObj.active) {
      // console.log('页码切换了', e.current);
      getActiveListAsync(e.current);
    }
    if (isShowActive === modalObj.fans) {
      getFansListAsync(currentRecord.user_id, e.current);
    }
    if (isShowActive === modalObj.order) {
      getOrderListAsync(currentRecord.user_id, e.current);
    }
  };

  /**
   * 编辑主播信息
   * @param {*} payload
   */
  const editAnchorAsync = async (payload) => {
    const result = await editAnchor(payload);
    if (result) {
      message.success('修改成功');
      getAnchorListAsync();
    } else {
      message.error('修改失败');
    }
  };
  useEffect(() => {
    getAnchorListAsync();
  }, []);

  return (
    <div className="anchor-manage-list">
      <InnerPageHead
        className="list-head"
        title="主播管理"
        onGetActiveList={async () => {
          if (listModalOpened) {
            setListModalOpened(false);
          } else {
            setIsShowActive(modalObj.active);
            await getActiveListAsync();
            setListModalOpened(true);
          }
        }}
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
                <Button className="search-btn" type="primary" onClick={onSearch}>
                  查询
                </Button>
                <Button className="reset-btn" onClick={onReset}>
                  重置
                </Button>
              </div>
              <div className="head-item">
                <span>手机号：</span>
                <Input
                  style={{ width: '250px' }}
                  value={searchMobile}
                  onChange={(e) => setSearchMobile(e.target.value)}
                />
                <Button className="search-btn" type="primary" onClick={onSearch1}>
                  查询
                </Button>
                <Button className="reset-btn" onClick={onReset1}>
                  重置
                </Button>
              </div>
            </div>
            <div className="inner-wrap-content">
              <Table
                rowKey={(row) => row.user_id}
                columns={anchorColmns}
                dataSource={anchorList}
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
      {
        console.log(isShowActive, toJS(fansList))
      }
      <ListWrapModal
        isOpened={listModalOpened}
        title={
          isShowActive === modalObj.active ? '双十一活动排行榜'
            : isShowActive === modalObj.fans ? `${currentRecord.nickname}粉丝列表`
              : `${currentRecord.nickname}订单列表`
        }
        columns={
          isShowActive === 1 ? activeColumns
            : isShowActive === 2 ? fansColumns
              : orderColumns
        }
        tableDataSource={
          isShowActive === modalObj.active ? toJS(activeList)
            : isShowActive === modalObj.fans ? toJS(fansList)
              : toJS(orderList)
        }
        pagination={
          isShowActive === modalObj.active ? toJS(pagenationActive)
            : isShowActive === modalObj.fans ? toJS(pagenationFans)
              : toJS(pagenationOrder)
        }
        onClose={() => setListModalOpened(false)}
        onChangePagination={onChangePagination}
      />

      {/* 编辑上级uid弹窗 */}
      <Modal
        title="编辑上级uid"
        visible={editParentUidModal}
        onOk={async () => {
          await editAnchorAsync({
            user_id: currentRecord.user_id,
            parent_tiktok_uid: `${currentParentUid}`,
          });
          setEditParentUidModal(false);
        }}
        onCancel={() => {
          setEditParentUidModal(false);
        }}
      >
        <p>上级uid</p>
        <Input
          value={currentParentUid}
          onChange={(e) => {
            setCurrentParentUid(e.target.value);
          }}
        />
      </Modal>
      {/* 编辑上级uid弹窗 */}
      {/* 编辑抖音uid弹窗 */}
      <Modal
        title="编辑抖音uid"
        visible={editTikUidModal}
        onOk={async () => {
          await editAnchorAsync({
            user_id: currentRecord.user_id,
            tiktok: {
              uid: `${currentTikUid}`,
            },
          });
          setEditTikUidModal(false);
        }}
        onCancel={() => {
          setEditTikUidModal(false);
        }}
      >
        <p>抖音uid</p>
        <Input
          value={currentTikUid}
          onChange={(e) => {
            setCurrentTikUid(e.target.value);
          }}
        />
      </Modal>
      {/* 编辑抖音uid弹窗 */}
      {/* 设置源用户弹窗 */}

      <Modal
        title="设置源用户"
        visible={editOriginModal}
        onOk={async () => {
          await editAnchorAsync({
            user_id: currentRecord.user_id,
            account: {
              is_origin: currentOrigin,
            },
          });
          setEditOriginModal(false);
        }}
        onCancel={() => {
          setEditOriginModal(false);
        }}
      >
        <p>源用户</p>
        <Radio.Group
          onChange={(e) => {
            setCurrentOrigin(e.target.value);
          }}
          value={currentOrigin}
        >
          <Radio value={1}>是</Radio>
          <Radio value={0}>否</Radio>
        </Radio.Group>
      </Modal>
      {/* 设置源用户弹窗 */}
      {/* 设置团队长弹窗 */}
      <Modal
        title="设置团队长"
        visible={editLeaderModal}
        onOk={async () => {
          await editAnchorAsync({
            user_id: currentRecord.user_id,
            is_team_leader: currentLeader,
          });
          setEditLeaderModal(false);
        }}
        onCancel={() => {
          setEditLeaderModal(false);
        }}
      >
        <p>设置团队长</p>
        <Radio.Group
          onChange={(e) => {
            setCurrentLeader(e.target.value);
          }}
          value={currentLeader}
        >
          <Radio value={1}>是</Radio>
          <Radio value={0}>否</Radio>
        </Radio.Group>
      </Modal>
      {/* 设置团队长弹窗 */}
      {/* 通过弹窗 */}
      <Modal
        title={currentRecord.status === 1 ? '冻结' : '解冻'}
        visible={confirmFrozenModal}
        onOk={async () => {
          await frozenOrThawAsync({
            action: currentRecord.status === 1 ? 1 : 2,
            user_ids: [currentRecord.user_id],
          });
          setConfirmFrozenModal(false);
        }}
        onCancel={() => {
          setConfirmFrozenModal(false);
        }}
      >
        <p>确认{currentRecord.status === 1 ? '冻结' : '解冻'}？</p>
      </Modal>
      {/* 通过弹窗 */}
    </div>
  );
};

export default observer(AnchorManageList);
