/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2020-12-10 23:39:59
 * @Last Modified by: qiuz
 */

import React from "react";
import { View } from "@tarojs/components";
import "./index.scss";

let SafeAreaView: any;
if (IS_RN) {
  SafeAreaView = require("react-native").SafeAreaView;
}

function TaroSafeAreaView(props: any) {
  const { className = "", style = {} } = props;
  if (IS_RN) {
    return (
      <SafeAreaView className={`safe-area-view ${className}`} style={style}>
        {props.children}
      </SafeAreaView>
    );
  }
  return (
    <View className={`safe-area-view ${className}`} style={{ ...style }}>
      {props.children}
    </View>
  );
}

TaroSafeAreaView.options = {
  addGlobalClass: true
};

export default TaroSafeAreaView;
