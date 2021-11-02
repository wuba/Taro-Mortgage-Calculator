/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2020-12-10 23:38:41
 * @Last Modified by: qiuz
 */

import React from "react";
import { View } from "@tarojs/components";
import "./index.scss";

let KeyboardAwareScrollView: any;
if (IS_RN) {
  KeyboardAwareScrollView = require("@codler/react-native-keyboard-aware-scroll-view")
    .KeyboardAwareScrollView;
}

function TaroKeyboardAwareScrollView(props: any) {
  if (IS_RN) {
    return (
      <KeyboardAwareScrollView {...props}>
        {props.children}
      </KeyboardAwareScrollView>
    );
  }
  const { className = "" } = props;
  return <View className={`${className}`}>{props.children}</View>;
}

TaroKeyboardAwareScrollView.options = {
  addGlobalClass: true
};

export default TaroKeyboardAwareScrollView;
