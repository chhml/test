/* eslint-disable import/prefer-default-export */
/*
 *上传文件到阿里云oss
 *@param - filePath :图片的本地资源路径
 *@param - dir:表示要传到哪个目录下
 *@param - successc:成功回调
 *@param - failc:失败回调
 */
import { message } from 'antd';
import { post } from '@/services/request.js';

export const getOssUploadToken = async (obj) => {
  const data = await post('/platform/v1/merchart/attachment/token', obj);
  if (data) {
    return data;
  }
  message.error('获取文件上传Token失败');
  return false;
};

// 图片预览
export const handleOnPreview = async (file) => {
  let src = file.url;
  if (!src) {
    src = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => resolve(reader.result);
    });
  }

  const image = new Image();
  image.src = src;
  const imgWindow = window.open(src);
  imgWindow.document.write(image.outerHTML);
};
