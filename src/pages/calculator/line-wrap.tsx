/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date: 2020-06-28 13:47:24
 * @Last Modified by: qiuz
 * @Last Modified time: 2021-01-04 22:04:16
 */

import React, { Component } from "react";
import { View, Text, Image, Input, Button } from "@tarojs/components";
import "./index.scss";
import { RIGHT_ARROW } from "./constants";
import { Pciker, Modal } from "@components";

interface LineWrapProps {
  type: string[];
  data: any[];
  onChangePicker: (...args: any) => void;
  onInputChange: (...args: any) => void;
  onBlur: (...args: any) => void;
}

export class LineWrap extends Component<LineWrapProps, any> {
  static defaultProps = {
    data: [],
    type: [],
    onChangePicker: () => {},
    onInputChange: () => {},
    onBlur: () => {}
  };

  static options = {
    addGlobalClass: true
  };

  constructor(props: LineWrapProps) {
    super(props);
    this.state = {
      visible: false,
      explainData: {},
      focus: []
    };
  }

  handlePickerChange = (data: any, index: number) => (value: any) => {
    const valueMap = data.range.filter(
      (item: any) => item.value === Number(value[0])
    );
    this.props.onChangePicker(data, valueMap[0] || data.range[0], index);
  };

  handleInputChange = (item: any, index: number) => (e: any) => {
    let { value } = e.detail;
    if (item.inputType === "number" || item.keyboardType === "number-pad") {
      value = parseInt(value, 10);
    }
    this.props.onInputChange(item, value, index);
  };

  showExplain = (data: any) => () => {
    this.setState({
      explainData: data,
      visible: true
    });
  };

  closeModal = () => {
    this.setState({
      visible: false
    });
  };

  onMoreClick = (_url: string) => () => {};

  onFocus = (index: number) => () => {
    const { focus } = this.state;
    focus[index] = true;
    this.setState({
      focus
    });
  };

  onBlur = (loan: any, index: number) => (e: any) => {
    const { focus } = this.state;
    focus[index] = false;
    this.setState(
      {
        focus
      },
      () => {
        loan.blurCheck && this.props.onBlur(e);
      }
    );
  };
  render() {
    const { data, type } = this.props;
    const { visible, explainData, focus } = this.state;
    const list = data.filter(
      _item => type.indexOf(_item && _item.renderType) > -1
    );
    return (
      <View className="loan-content">
        {explainData.title && (
          <Modal
            className="compute-modal"
            visible={visible}
            closable
            transparent
            animationType="none"
            onClose={this.closeModal}
          >
            <View className="explain">
              <Text className="explain-title">{explainData.title}</Text>
              <View className="explain-tip">
                <Text className="explain-tip-text">
                  {explainData.content}
                </Text>
              </View>

              <Button className="explain-btn" onClick={this.closeModal}>
                <Text className="explain-btn-text">我知道了</Text>
              </Button>
            </View>
          </Modal>
        )}
        {list.map((loan: any, index: number) => {
          let valueIndex = 0;
          if (loan.range) {
            loan.range = loan.rangeFilter
              ? loan.range.filter(_r => _r.limit === loan.rangeFilter)
              : loan.range;
            valueIndex = loan.range.findIndex(
              (item: any) => item.value === Number(loan.value)
            );
          }
          return (
            <View key={loan.name} className="input-content">
              <View className="input-content__label">
                <Text className="input-content__label-text">{loan.name}</Text>
                {loan.icon && (
                  <View onClick={this.showExplain(loan.explain)}>
                    <Image
                      className="input-content__label-icon"
                      src={loan.icon}
                    />
                  </View>
                )}
              </View>
              <View className="value-wrap">
                {loan.type === "selector" ? (
                  <View className="picker-box">
                    <Pciker
                      mode="selector"
                      title={loan.name}
                      styleName="picker-box__picke"
                      value={[loan.value]}
                      range={loan.range}
                      onChange={this.handlePickerChange(loan, index)}
                    >
                      <Text className="picker-box__picker__text">
                        {loan.range[valueIndex] && loan.range[valueIndex].label}
                      </Text>
                    </Pciker>
                  </View>
                ) : (
                  <Input
                    // taro内置不支持 rn 的某些类型
                    // @ts-ignore
                    keyboardType={loan.keyboardType}
                    type={loan.inputType || "text"}
                    maxLength={loan.maxLength}
                    className="input"
                    style={loan.valueStyle || {}}
                    disabled={
                      process.env.TARO_ENV !== "h5" ? loan.readOnly : false
                    }
                    readOnly={IS_H5 ? loan.readOnly : false}
                    onBlur={this.onBlur(loan, index)}
                    onFocus={this.onFocus(index)}
                    onInput={this.handleInputChange(loan, index)}
                    value={`${
                      loan.value !== 0
                        ? (loan.ratio ? loan.ratio * loan.value : loan.value) ||
                          ""
                        : focus[index]
                        ? ""
                        : 0
                    }`}
                  />
                )}
                <View className="unit">
                  {loan.unit === "arrowright" ? (
                    <Image className="arrow-right" src={RIGHT_ARROW} />
                  ) : (
                    <Text className="unit__text" style={loan.unitStyle}>
                      {loan.unit}
                    </Text>
                  )}
                </View>
              </View>
              <Text className="input-content-line" />
            </View>
          );
        })}
      </View>
    );
  }
}
