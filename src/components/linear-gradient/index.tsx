/* eslint-disable react/jsx-curly-brace-presence */
/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2020-12-10 23:38:52
 * @Last Modified by: qiuz
 */

import React, { FunctionComponent } from "react";
import { ComponentOptions } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { LinearGradientProps } from "react-native-linear-gradient";
import "./index.scss";
import { ITouchEvent } from "@tarojs/components/types/common";
import { isArray } from "@utils";

let UIManager = {},
  LinearGradient: any = null;
if (IS_RN) {
  LinearGradient = require("react-native-linear-gradient");
  UIManager = require("react-native").UIManager;
}

interface TaroLinearGradientProps {
  style?: object;
}

export interface LinearGradientType extends LinearGradientProps {
  // 优先图片
  src?: string;
  color?: string;
  className?: string;
  useColors?: boolean;
  onClick?: (event: ITouchEvent) => void;
}

const TaroLinearGradient: FunctionComponent<
  LinearGradientType & TaroLinearGradientProps
> & {
  options?: ComponentOptions;
} = props => {
  const {
    src = "",
    style = {},
    color = "",
    className = "",
    onClick = () => {},
    colors = [],
    angle = 180,
    useColors = false
  } = props;
  const len = colors.length;
  const LinearGradientColors =
    colors && len <= 0 ? ["#ffffff", "#ffffff"] : colors;
  if (IS_RN) {
    // 兼容低版本不支持 取第一个色值
    const customeStyle = { backgroundColor: color || LinearGradientColors[0] };
    const propsStyle = isArray(style)
      ? Object.assign(customeStyle, ...(style as any))
      : Object.assign(customeStyle, style);
    // 如果有切图 以切图为主
    if (!src && UIManager["BVLinearGradient"]) {
      return (
        <LinearGradient
          {...props}
          angle={angle}
          useAngle={!!angle}
          colors={LinearGradientColors}
        >
          {
            // @ts-ignore
            <View {...props}>{props.children}</View>
          }
        </LinearGradient>
      );
    }
    return (
      <View
        className={`linear-gradient__box ${className}`}
        style={propsStyle}
        onClick={onClick}
      >
        <Image src={src} className="linear-gradient__box__img" />
        {props.children}
      </View>
    );
  }
  let background = color;
  if (useColors) {
    const colorString = LinearGradientColors.map(
      (colorStr: string, index: number) =>
        `${colorStr} ${index === len - 1 ? "100" : (index / len) * 100}%`
    ).join(",");
    background = `linear-gradient(${angle}deg, ${colorString})`;
  }
  return (
    <View
      className={`linear-gradient__box ${IS_WEAPP ? "^" : ""}${className}`}
      style={{ ...(!src ? { background } : ""), ...(style as object) }}
    >
      {src && (
        <Image
          src={src}
          mode="aspectFill"
          className="linear-gradient__box__img"
        />
      )}
      {props.children}
    </View>
  );
};

TaroLinearGradient.options = {
  addGlobalClass: true
};

export default TaroLinearGradient;
