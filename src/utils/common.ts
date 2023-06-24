/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2020-12-30 22:12:43
 * @Last Modified by: qiuz
 */

import Taro from '@tarojs/taro';

export const getStorageData = async (key: string) => {
  let result: any;
  try {
    const { data } = await Taro.getStorage({ key });
    result = data;
  } catch (error) {
    console.log(error);
  }
  return result;
};

// num为传入的值，n为保留的小数位
export const formatFloat = (num: number | string, n: number) => {
  let f = parseFloat(num as string);
  if (Number.isNaN(f)) {
    return false;
  }
  f = Math.round((num as number) * Math.pow(10, n)) / Math.pow(10, n); // n 幂
  return f;
};
