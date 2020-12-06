/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable camelcase */
import React, {
  useState, useContext, useEffect, useRef,
} from 'react';
import { observer } from 'mobx-react';
import { PlusOutlined } from '@ant-design/icons';

import './style.less';
import InnerPageHead from '@/components/InnerPageHead';
import {
  Form,
  Input,
  Select,
  Upload,
  message,
  Button,
} from 'antd';
import AddProductStore from '@/stores/addProductStore';

const AddProduct = () => {
  const {
    productCategory,
    getCategories,
    imageParams,
    getImageParams,
    addProduct,
  } = useContext(AddProductStore);
  // 基本的信息
  const basicRef = useRef();
  // 售卖信息
  const saleMessage = useRef();
  // 上传图片
  const [imgUrl, setImgUrl] = useState('');
  // const [loading, setLoading] = useState(false);

  // 上传图片
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );
  // const getBase64 = (img, callback) => {
  //   const reader = new FileReader();
  //   reader.addEventListener('load', () => callback(reader.result));
  //   reader.readAsDataURL(img);
  // };

  // const beforeUpload = (file) => {
  //   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  //   if (!isJpgOrPng) {
  //     message.error('You can only upload JPG/PNG file!');
  //   }
  //   const isLt2M = file.size / 1024 / 1024 < 2;
  //   if (!isLt2M) {
  //     message.error('Image must smaller than 2MB!');
  //   }
  //   return isJpgOrPng && isLt2M;
  // };

  const handleChange = ({ fileList: newFileList }) => {
    setImgUrl(newFileList);
    // if (event) {
    //   setTimeout(() => {
    //     const fileName = `merchant/${moment(currentDate).format('YYYY-MM-DD')}/${MD5(`merchantImg1${currentDate}`)}.png`;
    //     setPics1(fileName);
    //     checkBusinessLicenseAsync('1');
    //   }, 200);
    // }
    // console.log('info', info);
    // // setImgUrl(info.fileList);
    // // if (info.file.status === 'uploading') {
    // //   setLoading(true);
    // //   return;
    // // }
    // if (info.file.status === 'done') {
    //   setImgUrl(info.fileList);
    //   // Get this url from response in real world.
    //   // getBase64(info.file.originFileObj, (imageUrl) => {
    //   //   // setImgUrl(imageUrl.fileList);
    //   //   setLoading(false);
    //   // });
    // }
  };

  // 获取商品的分类
  const getProductListAsync = async () => {
    await getCategories();
    await getImageParams();
  };
  // 规格的列表
  const [skuList, setskuList] = useState([{
    id: 0,
    spec_desc: '',
    sku_price: '',
    sku_stock: '',
  }]);
  // 增加规格
  const addSkuList = () => {
    const obj = {
      id: skuList.length,
      spec_desc: '',
      sku_price: '',
      sku_stock: '',
    };
    setskuList([...skuList, obj]);
  };

  // 规格列表
  const skDom = skuList.map((ele, index) => {
    const dom = (<div className="add-sku-item" key={ele.id}>
      <Form.Item
        className="add-sku-child"
        style={{ display: 'inline-block' }}
        rules={[{ required: true, message: '商品分类不能为空' }]}
      > <Input
        placeholder="请输入内容"
        style={{ border: 'none' }}
        onChange={(value) => {
          skuList[index].spec_desc = value.currentTarget.value;
        }}
      />
      </Form.Item>
      <Form.Item
        className="add-sku-child"
        style={{ display: 'inline-block' }}
        rules={[{ required: true, message: '商品分类不能为空' }]}
      > <Input
        placeholder="请输入内容"
        style={{ border: 'none' }}
        onChange={(value) => {
          skuList[index].sku_price = value.currentTarget.value;
        }}
      />
      </Form.Item>
      <Form.Item
        className="add-sku-child"
        style={{ display: 'inline-block' }}
        rules={[{ required: true, message: '商品分类不能为空' }]}
      > <Input
        placeholder="请输入内容"
        style={{ border: 'none' }}
        onChange={(value) => {
          skuList[index].sku_stock = value.currentTarget.value;
        }}
      />
      </Form.Item>
                 </div>);
    return dom;
  });

  const submitNow = async (number) => {
    // const basic = basicRef.current.getFieldValue();
    // console.log('售卖信息', basic);
    // console.log('售卖信息', saleMessage.current.getFieldValue());
    // console.log(skuList);validateFields
    saleMessage.current.validateFields().then((values) => {
      console.log('数据验证0000333999', values);
    });

    const obj = {
      ...basicRef.current.getFieldValue(),
      ...saleMessage.current.getFieldValue(),
      sku_data: skuList,
      status: number,
    };
    console.log('新增商品的参数', obj);
    const result = await addProduct(obj);
    if (result) {
      message.success('新增成功');
    } else {
      message.error('新增失败');
    }
  };

  useEffect(() => {
    getProductListAsync();
  }, []);

  return (<div className="add-product">
    <InnerPageHead
      className="list-head"
      title="新增商品"
    />
    <div className="add-content">
      <div className="add-content-inner">
        <div>
          基本信息
        </div>
        <div>
          <Form
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 10 }}
            ref={basicRef}
          >
            <Form.Item label="商品名称" name="product_name" rules={[{ required: true, message: '商品名称不能为空' }]}>
              <Input placeholder="请输入内容" />
            </Form.Item>
            <Form.Item
              label="选择商品分类"
              name="cate_id"
              rules={[{ required: true, message: '商品分类不能为空' }]}
            >
              <Select
                style={{ width: 220 }}
                placeholder="请选择商品分类"
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
            <Form.Item label="商品图片" rules={[{ required: true, message: '商品图片不能为空' }]} name="productPics">
              <div className="upload-img">
                <div>
                  <Upload
                    name="file"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList
                    action="https://bigtree-public.oss-cn-chengdu.aliyuncs.com"
                    data={
                      {
                        key: 'merchant/test1.jpg',
                        ...imageParams,
                      }
                    }
                    // beforeUpload={beforeUpload}
                    onChange={handleChange}
                    fileList={imgUrl}
                    transformFile={(e) => {
                      console.log(e);
                      return e;
                    }}
                  >
                    {uploadButton}
                  </Upload>
                </div>
                <div className="upload-message">
                  支持.jpg格式建议尺寸为250*250大小不超过10M
                </div>
              </div>
            </Form.Item>
          </Form>
        </div>

        <div>
          售卖信息
        </div>
        <div>
          <Form
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 12 }}
            ref={saleMessage}
          >
            <Form.Item name="sku" label="规格管理" rules={[{ required: true, message: '规格不能为空' }]}>
              <div className="add-wrapper">
                <div className="add-sku-wrapper">
                  <div className="add-sku-item">
                    <div className="add-sku-child">商品名称</div>
                    <div className="add-sku-child">对应售价（¥）</div>
                    <div className="add-sku-child">对应库存</div>
                  </div>
                  {skDom}
                </div>
                <div className="add-btn"><Button type="primary" onClick={addSkuList}>增加</Button></div>
              </div>
            </Form.Item>
            <Form.Item label="拥金设置">
              <div className="add-wrapper">
                <div className="add-sku-wrapper">
                  <div className="add-sku-item">
                    <div className="add-sku-child">拥金比例（%）</div>
                    <div className="add-sku-child">二级拥金比例（%）</div>
                    <div className="add-sku-child">团队长拥金比例（%）</div>
                  </div>
                  <div className="add-sku-item">
                    <Form.Item
                      className="add-sku-child"
                      style={{ display: 'inline-block' }}
                      rules={[{ required: true, message: '拥金比例不能为空' }]}
                      name="bonus_rate"
                    >
                      <Input placeholder="请输入内容" style={{ border: 'none' }} />
                    </Form.Item>
                    <Form.Item
                      className="add-sku-child"
                      style={{ display: 'inline-block' }}
                      rules={[{ required: true, message: '二级拥金比例不能为空' }]}
                      name="sec_bonus_rate"
                    >
                      <Input placeholder="请输入内容" style={{ border: 'none' }} />
                    </Form.Item>
                    <Form.Item
                      className="add-sku-child"
                      style={{ display: 'inline-block' }}
                      rules={[{ required: true, message: '团队长拥金比例不能为空' }]}
                      name="trd_bonus_rate"
                    >
                      <Input placeholder="请输入内容" style={{ border: 'none' }} />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </Form.Item>
          </Form>
        </div>
        <div>
          商品详情
        </div>
        <div>
          富文本编辑
        </div>
        <Form>
          <Form.Item wrapperCol={{ offset: 4 }}>
            <Button
              type="primary"
              style={{ marginRight: '20px' }}
              onClick={() => {
                submitNow(1);
              }}
            >立即上架
            </Button>
            <Button onClick={() => {
              submitNow(0);
            }}
            >暂不上架
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
          </div>);
};

export default observer(AddProduct);
