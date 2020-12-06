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
import AddSku from '@/components/AddSku';
import { Editor } from '@tinymce/tinymce-react';
import {
  Form,
  Input,
  Select,
  Upload,
  message,
  Button,
} from 'antd';
import AddProductStore from '@/stores/addProductStore';
import Axios from 'axios';
import { toJS } from 'mobx';

const AddProduct = () => {
  const {
    productCategory,
    getCategories,
    imageParams,
    getImageParams,
    addProduct,
    skuList,
  } = useContext(AddProductStore);
  // 基本的信息
  const basicRef = useRef();
  // 售卖信息
  const saleMessage = useRef();
  // 上传图片 封面图
  // 封面图的key
  const [coverKey, setCoverKey] = useState('');
  const [imgUrl, setImgUrl] = useState([]);

  // const [imgUrl1] = useState([{
  //   uid: 1,
  //   name: 'image.png',
  //   status: 'done',
  //   url: 'https://resource.bigtree-goods.com/e5dff5dc22f66',
  // }, {
  //   uid: 2,
  //   name: 'image.png',
  //   status: 'done',
  //   url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607186950829&di=14cad57ed39081f2f3c1b91b6d1c70df&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F17%2F10%2F14%2F30e5cc872da0d7a11218247a9d586e13.jpg',
  // }]);

  // banner图片
  const [bannerUrl, setBannerUrl] = useState([]);
  const [bannerKey, setBannerKey] = useState('');

  // 富文本;
  const [editorContent, setEditorContent] = useState('');

  // 上传图片
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );

  const uploadButton1 = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );

  // 上传商品图片
  const beforeUpload = () => {
    // console.log('删除111111 ');
    const key1 = Math.random().toString(16).slice(2);
    setCoverKey(key1);
  };
  const handleChange = ({ fileList: newFileList }) => {
    const obj = newFileList[newFileList.length - 1];
    // 判断删除后是否还有数据
    if (obj) {
      obj.key = coverKey;
      setImgUrl([obj]);
    } else {
      setImgUrl([]);
    }
  };

  // 上传封面图
  const beforeUpload1 = () => {
    const key1 = Math.random().toString(16).slice(2);
    // console.log('banner图的key111', key1);
    setBannerKey(key1);
  };
  const handleChange1 = ({ fileList: newFileList }) => {
    const len = newFileList.length;
    if (len > 0 && !newFileList[len - 1].key) {
      // console.log('1长度大于0且没有key值,说明是添加图片');
      newFileList[len - 1].key = bannerKey;
      setBannerUrl(newFileList);
    } else {
      // console.log('删除图片啊');
      setBannerUrl(newFileList);
    }
  };

  // 获取商品的分类
  const getProductListAsync = async () => {
    await getCategories();
    await getImageParams();
    // console.log('获取图片的信息', toJS(imageParams));
  };
  // 获取商品规格的数据
  const getSkuListArr = () => {
    // console.log('skuList11skuList', toJS(skuList));
    const arr = [...toJS(skuList)];
    const newArr = arr.map((item) => ({
      spec_desc: item.spec_desc,
      sku_price: item.sku_price,
      sku_stock: item.sku_stock,
    }));
    return newArr.filter((item) => {
      if (item.spec_desc === '' && item.sku_price === '' && item.sku_stock === '') {
        return false;
      }
      return true;
    });
  };
  // 获取图片的数据
  const getPicturesListArr = () => {
    const arr = [...bannerUrl];
    return arr.map((item) => `https://resource.bigtree-goods.com/${item.key}`);
  };
  const submitNow = async (number) => {
    // number 是否立即上架
    const messageLock = { lock: true };
    // 数据验证
    basicRef.current.validateFields().then((values) => {
      console.log('数据验证通过', values);
    }, () => {
      // 数据验证失败
      messageLock.lock = false;
    });
    saleMessage.current.validateFields().then((values) => {
      console.log('数据验证通过', values);
    }, () => {
      messageLock.lock = false;
    });
    const obj = {
      ...basicRef.current.getFieldValue(),
      ...saleMessage.current.getFieldValue(),
      sku_data: getSkuListArr(),
      status: number,
      detail: editorContent,
      cover: imgUrl[0] && `https://resource.bigtree-goods.com/${imgUrl[0].key}`,
      pictures: getPicturesListArr(),
    };
    console.log('提交的数据obj', obj);
    // 判断验证是否通过
    setTimeout(async () => {
      // console.log(messageLock.lock, '判断验证是否通过');
      if (messageLock.lock) {
        // console.log('新增商品的参数', obj);
        const result = await addProduct(obj);
        if (result) {
          message.success('新增成功');
        } else {
          message.error('新增失败');
        }
      }
    }, 100);
  };
  const handleEditorChange = (content, editor) => {
    console.log('Content was updated:111333333', editor);
    setEditorContent(content);
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

        <div className="add-content-title">
          基本信息
        </div>
        <div>
          <Form
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 10 }}
            ref={basicRef}
          // initialValues={{
          //   cate_id: '7',
          // }}
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
            <Form.Item label="商品图片" rules={[{ required: true, message: '商品图片不能为空' }]} name="cover">
              <div className="upload-img">
                <div className="upload-content">
                  <Upload
                    name="file"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList
                    action="https://bigtree-public.oss-cn-chengdu.aliyuncs.com"
                    data={
                      {
                        key: coverKey,
                        OSSAccessKeyId: imageParams.accessid,
                        ...imageParams,
                      }
                    }
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    fileList={imgUrl}
                    defaultFileList={imgUrl}
                  // transformFile={(e) => {
                  //   console.log(e, '10000------000000');
                  //   return e;
                  // }}
                  >
                    {uploadButton}
                    {/* {!imgUrl && uploadButton} */}
                  </Upload>
                  <div className="upload-message">
                  支持.jpg格式建议尺寸为250*250大小不超过10M
                  </div>
                </div>

              </div>
            </Form.Item>
            <Form.Item label="商品详情图" rules={[{ required: true, message: '商品图片不能为空' }]} name="pictures">
              <div className="upload-img">
                <div className="upload-content">
                  <Upload
                    name="file"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList
                    action="https://bigtree-public.oss-cn-chengdu.aliyuncs.com"
                    data={
                      {
                        key: bannerKey,
                        OSSAccessKeyId: imageParams.accessid,
                        ...imageParams,
                      }
                    }
                    beforeUpload={beforeUpload1}
                    onChange={handleChange1}
                    fileList={bannerUrl}
                  // transformFile={(e) => {
                  //   console.log(e, '10000------000000');
                  //   return e;
                  // }}
                  >
                    {uploadButton1}
                  </Upload>
                  <div className="upload-message">
                    支持.jpg格式建议尺寸为250*250大小不超过10M
                  </div>
                </div>

              </div>
            </Form.Item>
          </Form>
        </div>

        <div className="add-content-title">
          售卖信息
        </div>
        <div>
          <Form
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 15 }}
            ref={saleMessage}
          // initialValues={{
          //   bonus_rate: 10, sec_bonus_rate: 11, trd_bonus_rate: 12, pictures:bannerUrl,
          // }}
          >
            <Form.Item label="规格管理">
              <AddSku />
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

        <div className="add-content-title">
          商品详情
        </div>
        <div className="editor-wrapper">
          {Object.values(toJS(imageParams))[0] && <Editor
            initialValue={editorContent}
            init={{
              height: 300,
              branding: false,
              menubar: false,
              language: 'zh_CN',
              // images_upload_url: '/api/v1/api/common/upload/url',
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount',
                'image',
              ],
              toolbar:
                'undo redo | formatselect | bold italic backcolor | \
                 alignleft aligncenter alignright alignjustify | \
                 bullist numlist outdent indent | removeformat | help | image',
              images_upload_handler(blobInfo, succFun) {
                const key = Math.random().toString(16).slice(2);
                const data = toJS(imageParams);
                const form = new FormData();
                form.append('key', key);
                form.append('OSSAccessKeyId', data.accessid);
                form.append('accessid', data.accessid);
                form.append('host', data.host);
                form.append('policy', data.policy);
                form.append('signature', data.signature);
                form.append('expire', data.expire);
                form.append('dir', data.dir);
                form.append('x-oss-security-token', data['x-oss-security-token']);
                form.append('file', blobInfo.blob(), blobInfo.filename());
                form.append('success_action_status', data.success_action_status);
                Axios.post('https://bigtree-public.oss-cn-chengdu.aliyuncs.com', form, {}).then((res) => {
                  console.log(res);
                  succFun(`https://resource.bigtree-goods.com/${key}`);
                });
              },
            }}
            onEditorChange={handleEditorChange}
          />}

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
