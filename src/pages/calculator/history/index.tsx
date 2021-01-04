/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2020-12-10 23:40:47
 * @Last Modified by: qiuz
 */

import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import TaroSafeAreaView from "@components/safe-area-view";

export default class HouseLoanComputeMontylyPayments extends Component<
  any,
  any
> {
  constructor(props: any) {
    super(props);
    this.state = {
      historyList: []
    };
  }

  async componentDidMount() {
    let list: any = [];
    try {
      const { data = [] } = await Taro.getStorage({ key: "LOAN_HISTORY" });
      list = data;
    } catch (error) {
      console.log(error);
    }
    this.setState({
      historyList: list
    });
  }

  render() {
    const { historyList = [] } = this.state;
    return (
      <TaroSafeAreaView className="history">
        <View className="history-content">
          {historyList.map((item: any, index: number) => {
            return (
              <View key={index + ""} className="wrap">
                <View className="wrap-item">
                  <Text className="title">
                    公积金贷{item.accumulatFundYear}年
                  </Text>
                  <Text className="amount">{item.accumulatTotalPirce}万</Text>
                </View>
                <View className="wrap-item">
                  <Text className="title">商业贷{item.commerceLoanYear}年</Text>
                  <Text className="amount">{item.commerceTotalPirce}万</Text>
                </View>
                <View className="wrap-item">
                  <Text className="title">{item.payMonthStr}</Text>
                  <Text className="amount">{item.firstPay}元</Text>
                </View>
              </View>
            );
          })}
        </View>
      </TaroSafeAreaView>
    );
  }
}
