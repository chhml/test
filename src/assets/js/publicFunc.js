import { Modal } from 'antd';
import routes from '@/routers/routes';
import Exception from '@/pages/Exception/403';

/**
 * 隐藏手机号码
 * @param {string} phone 手机号
 */
export const hidePhone = (phone) => phone && phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');

/**
 * 以递归的方式展平react router数组
 * @param {object[]} arr 路由数组
 * @param {string} child 需要递归的字段名
 */
export const flattenRoutes = (arr) => arr.reduce((prev, item) => {
  if (Array.isArray(item.routes)) {
    prev.push(item);
  }
  return prev.concat(
    Array.isArray(item.routes) ? flattenRoutes(item.routes) : item,
  );
}, []);

/**
 * 根据路径获取路由的name和key
 * @param {string} path 路由
 */
export const getKeyName = (path = '/403') => {
  const truePath = path.split('?')[0];
  const curRoute = flattenRoutes(routes).filter(
    (item) => item.path.includes(truePath),
  );
  if (!curRoute[0]) return { title: '暂无权限', tabKey: '403', component: Exception };
  const { name, key, component } = curRoute[0];
  return { title: name, tabKey: key, component };
};

/**
 * 同步执行操作，Currying
 * @param {*} action 要执行的操作
 * @param {function} cb 下一步操作回调
 */
export const asyncAction = (action) => {
  const wait = new Promise((resolve) => {
    resolve(action);
  });
  return (cb) => {
    wait.then(() => setTimeout(() => cb()));
  };
};

/**
 * 获取地址栏 ?参数，返回键值对对象
 */
export const getQuery = () => {
  const { href } = window.location;
  const query = href.split('?');
  if (!query[1]) return {};

  const queryArr = decodeURI(query[1]).split('&');
  const queryObj = queryArr.reduce((prev, next) => {
    const item = next.split('=');
    return { ...prev, [item[0]]: item[1] };
  }, {});
  return queryObj;
};

/**
 * 深拷贝操作，简单类型的对象的可以直接用 JSON.parse(JSON.stringify())或 [...]/{...}
 * @param {object} obj 需要拷贝的对象
 */
export const deepClone = (obj) => {
  if (
    obj === null
    || typeof obj !== 'object'
    || obj instanceof Date
    || obj instanceof Function
  ) {
    return obj;
  }
  const cloneObj = Array.isArray(obj) ? [] : {};
  Object.keys(obj).map((key) => {
    cloneObj[key] = deepClone(obj[key]);
    return cloneObj;
  });
  return cloneObj;
};

/**
 * 获取图片地址
 * @param {*} html 富文本字符串
 */
export const getImgsUrl = (html) => {
  // 匹配图片（g表示匹配所有结果i表示区分大小写）
  const imgReg = /<img.*?(?:>|\/>)/gi;
  // 匹配src属性
  const srcReg = /src=['"]?([^'"]*)['"]?/i;
  const arr = html.match(imgReg);
  if (!arr) return null;
  // 获取图片地址
  const urlArr = arr.reduce((prev, next) => {
    const src = next.match(srcReg);
    return src[1] ? [...prev, src[1]] : prev;
  }, []);
  return urlArr;
};

/**
 * 获取视频地址
 * @param {*} html 富文本字符串
 */
export const getVideoUrl = (html) => {
  // 匹配图片（g表示匹配所有结果i表示区分大小写）
  const imgReg = /<(video|iframe).*?(?:>|\/>)/gi;
  // 匹配src属性
  const srcReg = /src=['"]?([^'"]*)['"]?/i;
  const arr = html.match(imgReg);
  if (!arr) return null;
  // 获取图片地址
  const urlArr = arr.reduce((prev, next) => {
    const src = next.match(srcReg);
    return src[1] ? [...prev, src[1]] : prev;
  }, []);
  return urlArr;
};

/**
 * 获取本地存储中的权限
 */
export const getPermission = () => localStorage.getItem('permissions') || [];

/**
 * 根据权限判断是否有权限
 */
export const isAuthorized = (val) => {
  const permissions = getPermission();
  return permissions.includes(val);
};

/**
 * 用requestAnimationFrame替代setTimeout、setInterval，解决内存溢出
 * @export
 * @param {*} cb 定时回调
 * @param {*} interval 定时时间
 */
export const customizeTimer = {
  intervalTimer: null,
  timeoutTimer: null,
  setTimeout(cb, interval) {
    // 实现setTimeout功能
    const { now } = Date;
    const stime = now();
    let etime = stime;
    const loop = () => {
      this.timeoutTimer = requestAnimationFrame(loop);
      etime = now();
      if (etime - stime >= interval) {
        cb();
        cancelAnimationFrame(this.timeoutTimer);
      }
    };
    this.timeoutTimer = requestAnimationFrame(loop);
    return this.timeoutTimer;
  },
  clearTimeout() {
    cancelAnimationFrame(this.timeoutTimer);
  },
  setInterval(cb, interval) {
    // 实现setInterval功能
    const { now } = Date;
    let stime = now();
    let etime = stime;
    const loop = () => {
      this.intervalTimer = requestAnimationFrame(loop);
      etime = now();
      if (etime - stime >= interval) {
        stime = now();
        etime = stime;
        cb();
      }
    };
    this.intervalTimer = requestAnimationFrame(loop);
    return this.intervalTimer;
  },
  clearInterval() {
    cancelAnimationFrame(this.intervalTimer);
  },
};

/**
 * 预览图片
 */
export const previewImg = (children) => {
  Modal.info({
    title: '预览',
    icon: false,
    okText: '关闭',
    maskClosable: true,
    content: children,
  });
};

/**
 * 根据路径，判断当前路径页面是否在视图内（多tab页签）
 * @param {string} path 要判断的路由
 */
export const isInCurrentView = (path) => {
  const { href } = window.location;
  return href.includes(path);
};

/**
 * 限制两位小数，可 ±
 * @param {string} val 要格式化的数字
 */
export const limitDecimal = (val) => val.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3');

/**
 * 获取本地存储中的游戏类型
 */
export const getGameTypes = () => {
  const gameString = localStorage.getItem('GAME_TYPES');
  try {
    const gameTypes = JSON.parse(gameString).reduce(
      (prev, next) => [
        ...prev,
        {
          key: next.gameType,
          name: next.gameName,
        },
      ],
      [],
    );
    return gameTypes;
  } catch (error) {
    return [];
  }
};

/**
 * 处理用户信息并储存起来
 */
export const setUserInfo = (userInfo, action, oldToken) => {
  const { permission, userName, token } = userInfo;
  const permissionArray = permission.reduce(
    (prev, next) => [...prev, next.code],
    [],
  );
  localStorage.setItem('permissions', permissionArray);

  const result = {
    userName,
    permission,
    token: token || oldToken,
  };
  action('SET_USERINFO', result);
};
