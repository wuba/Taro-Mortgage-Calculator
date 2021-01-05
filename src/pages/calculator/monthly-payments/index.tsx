/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2020-12-10 23:41:04
 * @Last Modified by: qiuz
 */

import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import {
  MONTY_DATA,
  MONTY_TITLE,
  CHECK_RIDIO_Y,
  CHECK_RIDIO
} from "../constans";
import "./index.scss";
import { getGlobalData, getStorageData } from "@utils";
import { SafeAreaView, StatusBar } from "@components";

export default class HouseLoanComputeMontylyPayments extends Component<
  any,
  any
> {
  page: number = 1;
  total: number;

  constructor(props: any) {
    super(props);
    this.state = {
      checked: "equalInterest",
      equalInterest: {},
      equalPrincipal: {},
      equalInterestMonthList: [],
      interestList: [],
      assessInfo: null,
      equalPrincipalMonthList: [],
      principalList: [],
      tip: "",
      loanAmount: 0
    };
  }

  async componentDidMount() {
    const params = getGlobalData("COMPUTE_RESULT") || {};
    this.init(params);
    const { type = "equalInterest" } =
      (await getStorageData("USER_LOAN_WAY")) || {};
    this.setState({
      checked: type
    });
  }

  init = async (data: any = {}) => {
    try {
      const {
        equalInterestMonthList = [],
        equalPrincipalMonthList = []
      } = data;
      this.total = Math.floor(equalInterestMonthList.length / 10);
      this.setState({
        interestList: equalInterestMonthList.slice(0, 10),
        principalList: equalPrincipalMonthList.slice(0, 10),
        ...data
      });
    } catch (error) {
      console.log(error);
    }
  };

  seleceFirst = (data: any) => async () => {
    await Taro.setStorage({ key: "USER_LOAN_WAY", data });
    this.setState(
      {
        checked: data.type
      },
      () => {
        Taro.showToast({
          title: `月供将以${data.title}的形式展示`,
          icon: "none"
        });
      }
    );
  };

  onScrollToLower = () => {
    if (this.page >= this.total) return;
    this.page++;
    const { equalInterestMonthList, equalPrincipalMonthList } = this.state;
    this.setState({
      interestList: equalInterestMonthList.slice(0, this.page * 10),
      principalList: equalPrincipalMonthList.slice(0, this.page * 10)
    });
  };

  render() {
    const {
      checked,
      interestList,
      principalList,
      loanAmount,
      tip
    } = this.state;
    return (
      <SafeAreaView className="montyly-payments">
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <ScrollView
          className="scroll-content"
          scrollY
          enableBackToTop
          onScrollToLower={this.onScrollToLower}
        >
          <View className="content">
            <View className="title">
              <Text className="title-text">贷款总额</Text>
              <Text className="title-amount">{loanAmount}</Text>
              <Text className="title-text">万</Text>
            </View>
            <Text className="tip-info">{tip}</Text>

            <View className="compared">
              {MONTY_DATA.map((item: any) => {
                return (
                  <View className="equal-box" key={item.type}>
                    <Text className="equal-box-title">{item.title}</Text>
                    <View className="equal-box-wrap">
                      <Text className="equal-box-wrap-title">
                        {MONTY_TITLE[item.type]}
                      </Text>
                      <Text className="amount">
                        {this.state[item.type].payMonth}
                      </Text>
                    </View>
                    <View className="equal-box-wrap">
                      <Text className="equal-box-wrap-title">
                        利息总额（万元）
                      </Text>
                      <Text className="amount">
                        {this.state[item.type].totalInterest}
                      </Text>
                    </View>
                    <View className="equal-box-wrap">
                      <Text className="equal-box-wrap-title">特点</Text>
                      <Text className="advant">
                        {item.type !== "equalPrincipal"
                          ? "每月月供稳定"
                          : `每月递减${this.state[item.type].monthDecline}元`}
                      </Text>
                    </View>
                    <View
                      className="equal-box-wrap btn-wrap"
                      onClick={this.seleceFirst(item)}
                    >
                      <Image
                        className="radio"
                        src={
                          item.type === checked ? CHECK_RIDIO_Y : CHECK_RIDIO
                        }
                      />
                      <Text className="btn-wrap-text">优先看{item.title}</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            <View className="pay-monty">
              <Text className="pay-monty-title">还款细则</Text>
              <View className="line line-first">
                <Text className="line-text line-monty" />
                <Text className="line-text line-amount line-first-title">
                  等额本息
                </Text>
                <Text className="line-text line-amount line-first-title">
                  等额本金
                </Text>
              </View>
              {interestList.map((item: any, index: number) => {
                return (
                  <View
                    key={index + ""}
                    className={`line ${
                      index % 2 === 0 ? "line-even" : "line-odd"
                    }`}
                  >
                    <Text className="line-text line-monty">
                      第{index + 1}个月
                    </Text>
                    <Text className="line-text line-amount">￥{item}</Text>
                    <Text className="line-text line-amount">
                      ￥{principalList[index]}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
