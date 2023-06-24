/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2020-12-01 13:55:57
 * @Last Modified by: qiuz
 */

import React, { FunctionComponent } from "react";
import { View, Text, Image } from "@tarojs/components";
import "./index.scss";
import {
  GRADIENT_BG,
  PERCENT_ICON,
  RIGHT_ARROW,
  RIGHT_ARROW_WHITE
} from "../constants";
import { BoxShadow, LinearGradient } from "@components";
import { formatFloat } from "@utils";

interface HouseLoanComputeHeaderProps {
  way: number;
  houseTotal: number;
  userLoanWay: string;
  tip: string;
  downPayRate: number;
  equalInterestPayMonth: string;
  equalPrincipalPayMonth: string;
  goHistory: () => void;
  goMonthlyPayments: () => void;
}

const HouseLoanComputeHeader: FunctionComponent<HouseLoanComputeHeaderProps> = props => {
  const {
    way,
    houseTotal,
    tip,
    userLoanWay,
    downPayRate,
    equalInterestPayMonth,
    equalPrincipalPayMonth,
    goHistory,
    goMonthlyPayments
  } = props;

  return (
    <View className="_h_l_c-header__content">
      <LinearGradient
        locations={[0, 0.75, 1]}
        src={GRADIENT_BG}
        colors={["#12BA83", "#12BA83", "#9AE7CD"]}
        className="_h_l_c-header-header-box"
        useColors
        color="linear-gradient(360deg,rgba(154,231,205,1) 0%, rgba(18,186,131,1) 20%, rgba(18,186,131,1) 100%)"
      >
        <Image src={PERCENT_ICON} className="_h_l_c-header-percent-icon" />
        <View className="_h_l_c-header-header _h_l_c-header-weapp-header">
          <View className="_h_l_c-header-header__info">
            <View className="_h_l_c-header-info__title">
              <Text className="_h_l_c-header-info__title__text">房屋总价</Text>
              <Text
                className="_h_l_c-header-info__title__price"
                // 针对andriod文字偏下设置
                style={{
                  // @ts-ignore
                  includeFontPadding: false,
                  textAlignVertical: "center"
                }}
              >
                {way === 1 ? houseTotal : "--"}
              </Text>
              <Text className="_h_l_c-header-info__title__text">万</Text>
            </View>
            <View className="_h_l_c-header-history-btn" onClick={goHistory}>
              <Text className="_h_l_c-header-history-btn__text">查看历史</Text>
              <Image
                className="_h_l_c-header-arrow-right"
                src={RIGHT_ARROW_WHITE}
              />
            </View>
          </View>
          <Text className="_h_l_c-header-header__tip">{tip}</Text>
        </View>
      </LinearGradient>
      <BoxShadow
        shadowColor="#E7EBEE"
        shadowOffset={{
          width: 0,
          height: 2
        }}
        shadowOpacity={1}
        shadowRadius={3.84}
        className="_h_l_c-header-loan-info"
        elevation={5}
        boxShadow="0px 1px 5px 0px #E7EBEE"
      >
        <View className="_h_l_c-header-loan-box">
          <Text className="_h_l_c-header-loan-box__title">首付款</Text>
          <View className="_h_l_c-header-loan-box__amount">
            <Text
              className="_h_l_c-header-loan-box__amount__number"
              numberOfLines={1}
              style={{
                // @ts-ignore
                includeFontPadding: false,
                textAlignVertical: "center"
              }}
            >
              {way === 1
                ? Math.floor(
                    formatFloat(houseTotal * downPayRate || 0, 1) as number
                  )
                : "--"}
              {way === 1 && (
                <Text className="_h_l_c-header-loan-info__unit">万</Text>
              )}
            </Text>
          </View>
        </View>
        <View className="_h_l_c-header-loan-box _h_l_c-header-monty-pay">
          <Text className="_h_l_c-header-loan-box__title">
            {userLoanWay === "等额本息"
              ? "每月应还(等额本息)"
              : "首月应还(等额本金)"}
          </Text>
          <View className="_h_l_c-header-loan-box__amount">
            <Text
              className="_h_l_c-header-loan-box__amount__number _h_l_c-header-loan-box__amount__number-right"
              style={{
                // @ts-ignore
                includeFontPadding: false,
                textAlignVertical: "bottom"
              }}
            >
              {userLoanWay === "等额本息"
                ? equalInterestPayMonth
                : equalPrincipalPayMonth}
              <Text className="_h_l_c-header-loan-info__unit">元</Text>
            </Text>
          </View>
          <View
            className="_h_l_c-header-monty-pay__tip"
            onClick={goMonthlyPayments}
          >
            <Text className="_h_l_c-header-monty-pay__tip__text">
              对比{userLoanWay === "等额本息" ? "等额本金" : "等额本息"}
              月供
            </Text>
            <Image className="_h_l_c-header-arrow-right" src={RIGHT_ARROW} />
          </View>
        </View>
      </BoxShadow>
    </View>
  );
};

export default React.memo(HouseLoanComputeHeader);
