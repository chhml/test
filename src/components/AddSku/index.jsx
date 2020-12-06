import React, { useState, useEffect, useContext } from 'react';
import {
  Table, Input, InputNumber, Popconfirm, Form, Button,
} from 'antd';
import AddProductStore from '@/stores/addProductStore';
import './style.less';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `请输入${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const AddSku = () => {
  const {
    skuList,
    addSkuList,
  } = useContext(AddProductStore);
  const [form] = Form.useForm();
  const [data, setData] = useState(skuList);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    // 编辑
    form.setFieldsValue({
      spec_desc: '',
      sku_price: '',
      sku_stock: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };
  //   保存
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: '商品名称',
      dataIndex: 'spec_desc',
      width: '25%',
      editable: true,
    },
    {
      title: '对应售价',
      dataIndex: 'sku_price',
      width: '25%',
      editable: true,
    },
    {
      title: '对应库存',
      dataIndex: 'sku_stock',
      width: '25%',
      editable: true,
    },
    {
      title: '编辑',
      dataIndex: 'operation',
      width: '25%',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              onClick={() => save(record.key)}
              type="primary"
              style={{
                marginRight: 8,
              }}
            >
              保存
            </Button>

            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button
                type="danger"
                danger
              >
                取消
              </Button>
            </Popconfirm>
          </span>
        ) : (
            <a disabled={editingKey !== ''} onClick={() => edit(record)}>
              编辑
            </a>
        );
      },
    },
  ];
  //  添加
  const handleAdd = () => {
    const newData = {
      key: data.length.toString(),
      spec_desc: '',
      sku_price: '',
      sku_stock: '',
    };
    setData([...data, newData]);
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'sku_stock' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  useEffect(() => {
    addSkuList(data);
    console.log(data, 'pppppp11');
  }, [data]);
  return (
    <div className="add-wrapper1">

      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          pagination={false}
        />
      </Form>
      <Button
        onClick={handleAdd}
        className="add-btn"
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        添加
      </Button>
    </div>
  );
};

export default AddSku;
