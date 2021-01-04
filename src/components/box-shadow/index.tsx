/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2020-12-10 23:36:40
 * @Last Modified by: qiuz
 */

import { Color, ComponentOptions } from "@tarojs/taro";
import { View } from "@tarojs/components";
import React, { FunctionComponent, CSSProperties } from "react";
import "./index.scss";
import { isArray } from "@utils";

interface ShadowOffset {
  width: number;
  height: number;
}
interface BoxShadowProps {
  shadowColor?: Color;
  shadowOffset?: ShadowOffset;
  shadowOpacity?: CSSProperties["opacity"];
  shadowRadius?: number;
  // 安卓只支持下面的属性 @see https://www.reactnative.cn/docs/view-style-props#elevation
  elevation?: number;
  // 非RN平台支持
  boxShadow?: CSSProperties["boxShadow"];
  styleName?: string;
  className?: string;
  style?: CSSProperties;
}

const BoxShadow: FunctionComponent<BoxShadowProps> & {
  options?: ComponentOptions;
} = props => {
  const {
    shadowColor = "#000",
    shadowOffset = { width: 0, height: 0 },
    shadowOpacity = 1,
    shadowRadius = 0,
    elevation = 1,
    boxShadow = "",
    style = {},
    className = "",
    ...rest
  } = props;
  let customeStyle: CSSProperties & BoxShadowProps = IS_RN
    ? {
        shadowColor,
        shadowOffset,
        shadowOpacity,
        shadowRadius,
        elevation
      }
    : {
        boxShadow
      };
  const propsStyle = Object.assign(
    customeStyle,
    ...(isArray(style) ? style : ([style] as any))
  );
  return !IS_WEAPP ? (
    <View
      className={`box-shadow__content ${className}`}
      style={propsStyle}
      {...rest}
    >
      {props.children}
    </View>
  ) : (
    <View className={`box-shadow__content ${className}`} style={propsStyle}>
      {props.children}
    </View>
  );
};

BoxShadow.options = {
  addGlobalClass: true
};

export default BoxShadow;
