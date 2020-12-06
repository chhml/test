/*
 * @Author: wzd
 * @Date: 2020-06-16 17:18:05
 * @Description:
 */
import React from 'react';

const context = {};

const req = require.context('.', true, /Store$/);
req.keys().forEach((key) => {
  const name = key.match(/([a-zA-Z0-9].*)$/)[1];
  const Store = req(key).default;
  console.log(Store);
  context[name] = new Store();
});

export const storesContext = React.createContext(context);

export function appStores() {
  return React.useContext(storesContext);
}
