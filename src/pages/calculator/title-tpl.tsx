/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date: 2020-06-28 13:47:24
 * @Last Modified by: qiuz
 */

import React, { FunctionComponent } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";

interface TitleTplProps {
  title: string;
  data: any[];
  activeIndex: number;
  onWayClick: (...args: any) => void;
}

export const TitleTpl: FunctionComponent<TitleTplProps> = props => {
  const {
    title = "",
    data = [],
    onWayClick = () => {},
    activeIndex = 0
  } = props;

  const handleClick = (item: any, index: number) => () => {
    onWayClick(item, index);
  };

  return (
    <View className="compute-way">
      <Text className="compute-way__title">{title}</Text>
      <View className="compute-way__way-box">
        {data.map((item: any, index: number) => {
          return (
            <View
              key={item.id}
              onClick={handleClick(item, index)}
              className="pseudo-content"
            >
              <Text
                className={`pseudo-content__text ${
                  activeIndex === item.index
                    ? "pseudo-content__text-active"
                    : ""
                }`}
              >
                {item.name}
              </Text>
              {activeIndex === item.index && (
                <View className="pseudo-content__pseudo" />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};
