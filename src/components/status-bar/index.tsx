/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2020-11-24 18:09:15
 * @Last Modified by: qiuz
 */

import React from "react";
import { View } from '@tarojs/components';
import { isAndroid } from '@utils';

let StatusBar: any;
if (IS_RN && isAndroid()) {
  StatusBar = require('react-native').StatusBar;
}

export default function TaroStatusBar(props: any) {
  return StatusBar ? (
    <StatusBar {...props} />
  ) : (
    <View style={{ display: 'none' }} />
  );
}
