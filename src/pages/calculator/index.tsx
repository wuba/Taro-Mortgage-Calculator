/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2020-12-09 13:42:01
 * @Last Modified by: qiuz
 */

import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text, Input, Video } from "@tarojs/components";
import "./index.scss";
import {
  KeyboardAwareScrollView,
  SafeAreaView,
  BoxShadow,
  StatusBar
} from "@components";
import HouseLoanComputeHeader from "./compute-header";
import { TitleTpl } from "./title-tpl";
import { LineWrap } from "./line-wrap";
import {
  getRenderList,
  COMPUTE_WAY_TITLE,
  LOAN_WAY_TITLE,
  LIST_TYPE,
  COMPUTE_WAY,
  OPTION,
  DEMO_VIDEO
} from "./constans";
import { equalInterestCalc } from "./helper";
import { isAndriod, setGlobalData, getStorageData, fomatFloat } from "@utils";

export default class HouseLoanCompute extends Component<any, any> {
  loading: any;
  scroll: any;
  computeResult: any;
  isFirstChange: boolean = true;

  constructor(props: any) {
    super(props);
    const { price = 0 } = getCurrentInstance().router!.params;
    this.state = {
      // 计算结果显示
      showResult: false,
      // 月付
      equalPrincipalPayMonth: 0,
      equalInterestPayMonth: 0,
      // 用户优先贷款方式
      userLoanWay: "等额本息",
      // 计算方式
      way: price ? 1 : 0,
      // 贷款方式 loanType + 1 = 1: 组合贷款  2: 商业贷款  3：公积金贷款
      loanType: 1,
      // 表单渲染项
      renderList: [],
      // 配置项
      options: {},
      // 参数
      params: {
        // 房屋总价
        houseTotal: price || 0,
        // 首付百分比
        downPayRate: 30,
        // 贷款金额
        loanAmount: 0,
        // 公积金金额
        accumulatTotalPirce: 0,
        // 公积金贷款上限
        accumulatLoanLimit: 0,
        // 基点
        commercialLoanBasePoint: 0,
        // 商贷利率
        commerceLoanRate: 0,
        // 公积金利率
        publicReserveFundsRate: 0,
        // 商贷年限
        commercialLoanTerm: 0,
        // 商贷利率方式
        commercialLoanWay: 0,
        // 商贷金额
        commerceTotalPirce: 0
      },
      // 默认值
      defaultValue: {},
      keyboardHeight: -1,
      // 利率方式, 1 最新 | 0 旧版
      loanLrpType: 1,
      downPayRateCustom: "",
      // 安卓上 手动输入时 隐藏计算按钮
      btnOpacity: 1,
      // 安卓状态栏
      backgroundColor: "#fff"
    };
  }

  componentDidMount() {
    this.getData();
  }

  async componentDidShow() {
    const { title = "等额本息" } =
      (await getStorageData("USER_LOAN_WAY")) || {};
    this.setState({ userLoanWay: title });
  }

  /**
   * 获取渲染项，处理picker range以及默认值
   * 需要在每次表单值改变后重新调用
   */
  getRenderList = () => {
    const {
      params,
      options,
      loanLrpType,
      commerceLoanRateNew,
      way
    } = this.state;
    const commerceLoanRateEqua = `${params.loanLrp * 100}% + ${
      params.commercialLoanBasePoint
    }‱ = `;

    const commerceLoanRateNewUnit = `${fomatFloat(
      commerceLoanRateNew * 100,
      2
    )}%`;
    this.setState({
      renderList: getRenderList({
        ...params,
        options,
        way,
        downPayRateCustom: params.downPayRate,
        loanLrpType,
        commerceLoanRateEqua,
        commerceLoanRateNewUnit
      })
    });
  };

  /**
   * @description 请求配置
   */
  getData = () => {
    const { params } = this.state;
    const { defult, options } = OPTION;
    // 处理首付比例 手动输入选项 以及公积金利率一年 五年 商贷利率
    const {
      downPayRate = [],
      commerceLoanRate = [],
      commerceLoanInFiveYearRate = [],
      commerceLoanInOneYearRate = [],
      accumulatFundRate = [],
      accumulatFundInFiveYearRate = []
    } = options;
    downPayRate.splice(0, 0, {
      value: -1,
      label: "手动输入"
    });
    this.handleDownPaySelectLabel(params.houseTotal, downPayRate);
    params.loanAmount = Math.ceil(
      this.handleAmount(params.houseTotal, defult.downPayRate) as number
    );
    // 处理旧版商贷利率 关联 商贷年限
    commerceLoanRate.forEach((rate: any) => {
      // 大于五年
      rate.limit = "outFive";
    });
    params.commerceOutFiveLoanRate = defult.commerceLoanRate;
    commerceLoanInFiveYearRate.forEach((rate: any) => {
      // 2-5年期
      rate.limit = "inFive";
    });
    commerceLoanInOneYearRate.forEach((rate: any) => {
      // <1年期
      rate.limit = "inOne";
    });
    options.commerceLoanRate = [
      ...commerceLoanRate,
      ...commerceLoanInFiveYearRate,
      ...commerceLoanInOneYearRate
    ];
    // 处理公积金利率 关联 公积金年限
    accumulatFundRate.forEach((rate: any) => {
      // >5年期
      rate.limit = "outFive";
    });
    params.accumulatOutFiveFundRate = defult.accumulatFundRate;
    accumulatFundInFiveYearRate.forEach((rate: any) => {
      // <=5年期
      rate.limit = "inFive";
    });
    options.accumulatFundRate = [
      ...accumulatFundRate,
      ...accumulatFundInFiveYearRate
    ];
    const commerceLoanRateNew = fomatFloat(
      defult.loanLrp + params.commercialLoanBasePoint / 10000,
      4
    );
    this.setState(
      {
        ...OPTION,
        commerceLoanRateNew,
        params: { ...params, ...defult }
      },
      () => {
        this.getRenderList();
        params.houseTotal && this.submit();
      }
    );
  };

  /**
   * picker 选择回调
   * @param data 当前选择配置项数据
   * @param selectObj 已选的数据项
   */
  onChangePicker = (
    data: any,
    selectObj: { value: number | string; label: string }
  ) => {
    const { key } = data;
    const { params } = this.state;
    // 处理首付比例切换
    if (key === "downPayRate") {
      const isInput = selectObj.value === -1;
      params[key] = isInput ? params[key] : selectObj.value;
      if (!isInput) {
        params.loanAmount = Math.ceil(
          this.handleAmount(
            params.houseTotal,
            selectObj.value as number
          ) as number
        );
        params.commerceTotalPirce = Math.max(
          parseInt(params.loanAmount) - params.accumulatTotalPirce,
          0
        );
        params.accumulatTotalPirce =
          parseInt(params.loanAmount) - params.commerceTotalPirce;
      }
      this.setState(
        {
          params,
          btnOpacity: isInput ? 0 : 1,
          // -1 标识手动输入
          keyboardHeight: isInput ? 0 : -1
        },
        this.getRenderList
      );
      return;
    }

    // 切换公积金年限 修改默认值
    if (data.key === "accumulatFundYear") {
      params.accumulatFundRate =
        selectObj.value > 5
          ? params.accumulatOutFiveFundRate
          : params.accumulatFundInFiveYearRate;
    }
    // 切换商贷年限 修改默认值
    if (data.key === "commerceLoanYear") {
      params.commerceLoanRate =
        selectObj.value > 5
          ? params.commerceOutFiveLoanRate
          : selectObj.value > 1
          ? params.commerceLoanInFiveYearRate
          : params.commerceLoanInOneYearRate;
    }
    params[key] = selectObj.value;
    let loanLrpTypeObj = {};
    if (data.key === "loanLrp") {
      loanLrpTypeObj = {
        loanLrpType: selectObj.label.indexOf("最新") > -1 ? 1 : 0
      };
    }

    this.setState(
      {
        params,
        ...loanLrpTypeObj
      },
      this.getRenderList
    );
  };

  /**
   * 处理首付展示
   */
  handleDownPaySelectLabel = (data: number | string, range?: any[]) => {
    const { options } = this.state;
    const list = range || options.downPayRate;
    list.forEach((pay: any) => {
      pay.labelCopy = pay.labelCopy || pay.label;
      const amount = Math.floor(
        fomatFloat(pay.value * parseInt(data as string, 10), 1) as number
      );
      if (pay.value !== -1 && amount >= 0) {
        pay.label = `${pay.labelCopy} (${amount}万)`;
      } else {
        pay.label = pay.labelCopy;
      }
    });
    this.setState({
      options
    });
  };

  /**
   * input 值改变回调
   * @param data 配置项
   * @param value 输入的值
   * @param _index 当前配置项的索引
   */
  onInputChange = (data: any, _value: number, _index: number) => {
    const { params } = this.state;
    const value = _value > 0 ? _value : 0;

    // 处理房屋总价输入时自动计算贷款金额
    if (data.key === "houseTotal") {
      this.handleDownPaySelectLabel(value);
      const { downPayRate } = params;
      params.loanAmount = Math.ceil(
        this.handleAmount(value, downPayRate) as number
      );
    }

    params[data.key] = value;

    // 修改贷款金额或房屋总价（两种计算方式）更新商贷金额
    if (data.key === "loanAmount" || data.key === "houseTotal") {
      params.commerceTotalPirce =
        parseInt(params.loanAmount) - params.accumulatTotalPirce;
      params.commerceTotalPirce =
        params.commerceTotalPirce > 0 ? params.commerceTotalPirce : 0;
    }
    const baseParams: any = {};
    // 处理新版商贷利率 基点修改
    if (data.key === "commercialLoanBasePoint") {
      baseParams.commerceLoanRateNew = fomatFloat(
        params.loanLrp + params.commercialLoanBasePoint / 10000,
        4
      );
    }
    // fix: weapp中 当超出限制时，onInput取的值始终是上限值，但页面依然能够输入
    // 修改公积金金额时 更新商贷金额
    if (data.key === "accumulatTotalPirce") {
      params.accumulatTotalPirceMaxValue = -1;
      params.commerceTotalPirce =
        parseInt(params.loanAmount) - params.accumulatTotalPirce;
      if (params.commerceTotalPirce <= 0) {
        params.commerceTotalPirce = 0;
        params.accumulatTotalPirce =
          parseInt(params.loanAmount) - params.commerceTotalPirce;
        params.accumulatTotalPirceMaxValue = params.accumulatTotalPirce;
      }
    }
    const { accumulatLoanLimit } = params;
    // 修改商贷金额时 更新公积金金额
    if (data.key === "commerceTotalPirce") {
      params.commerceTotalPirce =
        params.commerceTotalPirce > params.loanAmount
          ? params.loanAmount
          : params.commerceTotalPirce;
      params.accumulatTotalPirce =
        parseInt(params.loanAmount) - params.commerceTotalPirce;
    }
    // 校验公积金金额是否大于上限
    if (params.accumulatTotalPirce > accumulatLoanLimit) {
      // 修改商贷时 只提示一次
      if (this.isFirstChange || data.key !== "commerceTotalPirce") {
        Taro.showToast({
          title: `当前城市公积金最高可贷${accumulatLoanLimit}万`,
          icon: "none"
        });
        params.commerceTotalPirce =
          parseInt(params.loanAmount) - accumulatLoanLimit;
      }
      this.isFirstChange = !(data.key === "commerceTotalPirce");
      params.accumulatTotalPirce = accumulatLoanLimit;
      params.accumulatTotalPirceMaxValue = accumulatLoanLimit;
    }
    this.setState(
      {
        params,
        ...baseParams
      },
      this.getRenderList
    );
  };

  /**
   * 处理切换计算方式时，贷款总额或房屋总价
   */
  handleAmount = (value: string | number, ratio: number) => {
    return fomatFloat(parseInt(value + "", 10) * (1 - ratio), 1);
  };

  /**
   * 计算方式、贷款方式改变事件
   * @param data
   */
  onWayClick = (data: any) => {
    const { key, index } = data;
    let obj = {};
    // 处理切换成按房屋总价时 房屋总价根据 贷款总额 * (1 + 首付比例)
    if (data.key === "way" && index === 1) {
      const { params } = this.state;
      const { downPayRate, loanAmount } = params;
      params.houseTotal = Math.floor(
        fomatFloat(loanAmount / (1 - downPayRate), 1) as number
      );
      obj = { params };
      this.handleDownPaySelectLabel(params.houseTotal);
    }
    if (data.key === "way" && index === 0) {
      const { params } = this.state;
      const { loanAmount } = params;
      params.loanAmount = Math.ceil(fomatFloat(loanAmount, 1) as number);
      obj = { params };
    }
    this.setState(
      {
        [key]: index,
        showResult: false,
        ...obj
      },
      this.getRenderList
    );
  };

  /**
   * 页面跳转
   * @param path 跳转路径
   */
  goPage = (path: string, data: object = {}) => () => {
    setGlobalData("COMPUTE_RESULT", data);
    Taro.navigateTo({
      url: `/pages/calculator/${path}/index`
    });
  };

  /**
   * 监听键盘出现事件
   * @param frames 键盘对象
   */
  onKeyboardDidShow = (frames: Record<string, any>) => {
    const { endCoordinates } = frames;
    this.setState({
      btnOpacity: 0,
      keyboardHeight: endCoordinates.height
    });
  };

  /**
   * 监听键盘收起事件
   * @param frames 键盘对象
   */
  onKeyboardDidHide = (_frames: Record<string, any>) => {
    this.setState({
      keyboardHeight: -1,
      btnOpacity: 1
    });
  };

  /**
   * 首付选择手动输入处理
   * @param e
   */
  downPayRateHandle = (e: any) => {
    const { value } = e.detail;
    const valueNumbe = parseInt(value, 10);
    // 输入范围0-99
    this.setState({
      downPayRateCustom: valueNumbe
    });
  };

  /**
   * 确定手动输入首付比例
   */
  downPayRateConfirm = () => {
    const { options, params, downPayRateCustom } = this.state;
    const { downPayRate } = options;
    const value = parseInt(downPayRateCustom, 10);
    if (!(value > 0 && value <= 99)) {
      this.setState({
        btnOpacity: 1,
        keyboardHeight: -1
      });
      return;
    }
    const realValue = value / 100;
    const existIndex = downPayRate.findIndex(
      (item: any) => item.value === realValue
    );
    if (realValue && existIndex < 0) {
      const maxIndex = downPayRate.length - 1;
      const insertIndex = downPayRate.findIndex(
        (item: any, index: number) =>
          realValue > item.value &&
          realValue <
            (index < maxIndex ? downPayRate[index + 1].value : Infinity)
      );
      downPayRate.splice(insertIndex + 1, 0, {
        value: realValue,
        label: `${downPayRateCustom}%`
      });
    }
    params.downPayRate = realValue;
    params.loanAmount = Math.ceil(
      this.handleAmount(params.houseTotal, params.downPayRate) as number
    );
    params.commerceTotalPirce =
      parseInt(params.loanAmount) - params.accumulatTotalPirce;
    this.setState(
      {
        options,
        params,
        btnOpacity: 1,
        keyboardHeight: -1
      },
      () => {
        this.handleDownPaySelectLabel(params.houseTotal);
        this.getRenderList();
      }
    );
  };

  /**
   * 检验公积金金额
   */
  checkAccumulatLoanAmount = () => {
    const { params } = this.state;
    const { accumulatLoanLimit, accumulatTotalPirce } = params;
    if (accumulatTotalPirce > accumulatLoanLimit) {
      Taro.showToast({
        title: `当前城市公积金最高可贷${accumulatLoanLimit}万`,
        icon: "none"
      });
      params.accumulatTotalPirce = accumulatLoanLimit;
      return;
    }
    const amount = parseInt(params.loanAmount) - params.commerceTotalPirce;
    params.accumulatTotalPirce = amount;
    if (amount > accumulatLoanLimit) {
      Taro.showToast({
        title: `当前城市公积金最高可贷${accumulatLoanLimit}万`,
        icon: "none"
      });
      params.accumulatTotalPirce = accumulatLoanLimit;
      params.commerceTotalPirce =
        parseInt(params.loanAmount) - params.accumulatTotalPirce;
    }
  };

  checkParams = () => {
    const { params, loanType } = this.state;
    const {
      loanAmount,
      accumulatTotalPirce,
      commerceTotalPirce,
      accumulatLoanLimit
    } = params;
    if (loanAmount === 0) {
      Taro.showToast({
        title: `贷款金额不能为0`,
        icon: "none"
      });
      return false;
    }
    if (
      loanType === 0 &&
      loanAmount != commerceTotalPirce + accumulatTotalPirce
    ) {
      Taro.showToast({
        title: `商贷金额和公积金贷款金额之和必须等于贷款总额`,
        icon: "none"
      });
      return false;
    }
    if (loanType === 2 && loanAmount > accumulatLoanLimit) {
      Taro.showToast({
        title: `当前城市公积金最高可贷${accumulatLoanLimit}万`,
        icon: "none"
      });
      return false;
    }
    return true;
  };

  getTip = (showMonthlyPay = true) => {
    const {
      params,
      loanType,
      loanLrpType,
      commerceLoanRateNew,
      userLoanWay
    } = this.state;
    const {
      commerceLoanYear,
      accumulatFundYear,
      accumulatFundRate,
      accumulatTotalPirce,
      commerceTotalPirce,
      commerceLoanRate,
      loanAmount,
      downPayRate
    } = params;
    const downPayRateStr = `首付${fomatFloat(downPayRate * 100, 2)}%`;
    const accumulatStr = `公积金贷${
      loanType === 2 ? loanAmount : accumulatTotalPirce
    }万·${accumulatFundYear}年·利率${fomatFloat(accumulatFundRate * 100, 2)}%`;
    const commerceLoanRateStr = `${fomatFloat(
      (loanLrpType === 1 ? commerceLoanRateNew : commerceLoanRate) * 100,
      2
    )}`;
    const commerceStr = `商业贷${
      loanType === 1 ? loanAmount : commerceTotalPirce
    }万·${commerceLoanYear || 0}年·利率${commerceLoanRateStr}%`;
    const loanStr =
      loanType === 0
        ? [accumulatStr, commerceStr]
        : loanType === 1
        ? [commerceStr]
        : [accumulatStr];
    const loanWayStr = `${userLoanWay || "等额本息"}`;
    const tip = (showMonthlyPay
      ? [downPayRateStr, ...loanStr, loanWayStr]
      : [downPayRateStr, ...loanStr]
    ).join("、");
    return tip;
  };

  submit = async () => {
    if (this.loading) return;
    if (!this.checkParams()) return;
    Taro.showLoading({
      title: "计算中..."
    });

    const {
      params,
      loanType,
      loanLrpType,
      commerceLoanRateNew,
      userLoanWay
    } = this.state;
    const {
      commerceLoanYear,
      accumulatFundYear,
      accumulatFundRate,
      accumulatTotalPirce,
      loanAmount,
      commerceTotalPirce,
      commerceLoanRate,
      houseTotal
    } = params;
    const res: any = await equalInterestCalc({
      totalPrice: houseTotal,
      commerceLoanYear,
      commerceLoanRate:
        loanLrpType === 1 ? commerceLoanRateNew : commerceLoanRate,
      accumulatFundYear,
      accumulatFundRate,
      accumulatTotalPirce: loanType === 2 ? loanAmount : accumulatTotalPirce,
      commerceTotalPirce: loanType === 1 ? loanAmount : commerceTotalPirce
    });
    try {
      const tip = this.getTip(false);
      this.computeResult = {
        ...res,
        loanAmount,
        tip
      };
      const backgroundColor = "#12B983";
      this.setState({
        tip,
        showResult: true,
        equalInterestPayMonth: res.equalInterest.payMonth,
        equalPrincipalPayMonth: res.equalPrincipal.payMonth,
        backgroundColor
      });
      Taro.setNavigationBarColor({
        frontColor: "#ffffff",
        backgroundColor
      });
      IS_RN
        ? this.scroll.scrollTo({ x: 0, animation: true })
        : Taro.pageScrollTo({
            scrollTop: 0,
            duration: 300
          });
      const list: any = (await getStorageData("LOAN_HISTORY")) || [];
      const historyList = [
        {
          commerceLoanYear: commerceLoanYear,
          commerceTotalPirce:
            loanType === 1
              ? loanAmount
              : loanType === 2
              ? 0
              : commerceTotalPirce,
          accumulatFundYear,
          accumulatTotalPirce:
            loanType === 1
              ? 0
              : loanType === 2
              ? loanAmount
              : accumulatTotalPirce,
          payMonthStr:
            userLoanWay === "等额本息"
              ? "每月应还(等额本息)"
              : "首月应还(等额本金)",
          firstPay:
            userLoanWay === "等额本息"
              ? res.equalInterest.payMonth
              : res.equalPrincipal.payMonth
        },
        ...list
      ];
      await Taro.setStorage({
        key: "LOAN_HISTORY",
        data: historyList.slice(0, 10)
      });
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {
        Taro.hideLoading();
      }, 1000);
      this.loading = false;
    }
  };

  render() {
    const {
      way,
      loanType,
      renderList,
      params,
      keyboardHeight,
      btnOpacity,
      userLoanWay,
      equalInterestPayMonth,
      equalPrincipalPayMonth,
      showResult,
      backgroundColor
    } = this.state;
    const { houseTotal, downPayRate } = params;
    return (
      <SafeAreaView className="calculator">
        <StatusBar backgroundColor={backgroundColor} barStyle="dark-content" />
        {keyboardHeight >= 0 && (
          <View className="fixed">
            <View className="mask" />

            <View
              className="keyboard-box"
              style={{
                bottom: isAndriod() ? 0 : keyboardHeight
              }}
            >
              <Text className="keyboard-box-text">请输入</Text>
              <KeyboardAwareScrollView
                keyboardShouldPersistTaps="always"
                enableAutomaticScroll={false}
                onKeyboardDidShow={this.onKeyboardDidShow}
                className="keyboard-box-view"
                onKeyboardDidHide={this.onKeyboardDidHide}
              >
                <Input
                  // @ts-ignore
                  keyboardType="number-pad"
                  type="number"
                  // 针对小程序中底部fixed input被遮盖一部分 设置光标距离键盘距离
                  cursorSpacing={10}
                  className="keyboard-box-input"
                  focus
                  style={{
                    // @ts-ignore 针对安卓文字显示不全
                    paddingVertical: 0
                  }}
                  onInput={this.downPayRateHandle}
                  onBlur={this.downPayRateConfirm}
                  holdKeyboard
                />
              </KeyboardAwareScrollView>

              <Text
                className="keyboard-box-confirm"
                onClick={this.downPayRateConfirm}
              >
                确定
              </Text>
            </View>
          </View>
        )}

        <KeyboardAwareScrollView
          innerRef={(ref: any) => {
            this.scroll = ref;
          }}
          style={{ flex: 1 }}
        >
          {showResult && (
            <HouseLoanComputeHeader
              way={way}
              tip={this.getTip()}
              downPayRate={downPayRate}
              equalInterestPayMonth={equalInterestPayMonth}
              equalPrincipalPayMonth={equalPrincipalPayMonth}
              houseTotal={houseTotal}
              userLoanWay={userLoanWay}
              goHistory={this.goPage("history")}
              goMonthlyPayments={this.goPage(
                "monthly-payments",
                this.computeResult
              )}
            />
          )}

          <View className="content">
            <TitleTpl
              title="计算方式"
              data={COMPUTE_WAY_TITLE}
              onWayClick={this.onWayClick}
              activeIndex={way}
            />
            <LineWrap
              data={renderList}
              type={COMPUTE_WAY[way]}
              onChangePicker={this.onChangePicker}
              onInputChange={this.onInputChange}
            />
            <TitleTpl
              title="贷款方式"
              data={LOAN_WAY_TITLE}
              onWayClick={this.onWayClick}
              activeIndex={loanType}
            />

            <LineWrap
              data={renderList}
              type={LIST_TYPE[loanType]}
              onBlur={this.checkAccumulatLoanAmount}
              onChangePicker={this.onChangePicker}
              onInputChange={this.onInputChange}
            />

            <Video
              className="video"
              src={DEMO_VIDEO}
              controls={false}
              showFullscreenBtn={false}
              autoplay
              loop
              muted
            />
          </View>
        </KeyboardAwareScrollView>

        <BoxShadow
          shadowColor="#000"
          shadowOffset={{
            width: 0,
            height: -1
          }}
          shadowOpacity={0.1}
          shadowRadius={1}
          elevation={5}
          className="compute"
          style={{
            opacity: btnOpacity,
          }}
          boxShadow="0px 2px 8px 0px rgba(211,215,218,1)"
        >
          <SafeAreaView>
            <View className="compute-btn" onClick={this.submit}>
              <Text className="compute-btn-text">开始计算</Text>
            </View>
          </SafeAreaView>
        </BoxShadow>
      </SafeAreaView>
    );
  }
}
