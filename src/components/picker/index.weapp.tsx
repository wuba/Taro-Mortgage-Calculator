/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2020-12-10 23:39:41
 * @Last Modified by: qiuz
 */

import React, { Component } from "react";
import { View, Text, PickerView, PickerViewColumn } from "@tarojs/components";
import "./index.scss";
import { isArray } from "@utils";
import { TaroPickerSelectorProps, RangeItem } from "./type";

export default class TaroPickerSelector extends Component<
  TaroPickerSelectorProps,
  any
> {
  static defaultProps = {
    range: [],
    value: [],
    cols: 1,
    cascade: true,
    // rangeKey: 'label',
    onChange: () => {},
    onValueChange: () => {}
  };

  static options = {
    addGlobalClass: true
  };
  realValue: any;

  constructor(props: TaroPickerSelectorProps) {
    super(props);
    this.state = {
      visible: false
    };
  }

  componentWillReceiveProps(nextProps: TaroPickerSelectorProps) {
    if (nextProps.value !== this.props.value) {
      const { value = [0] } = nextProps;
      this.setState({
        selectedValue: value
      });
    }
  }

  showModal = (e: any) => {
    e.stopPropagation();
    const { value = [0] } = this.props;
    this.setState({
      visible: true,
      animation: "slide-up",
      selectedValue: value
    });
  };

  closeModal = (e?: any) => {
    e && e.stopPropagation();
    this.setState({
      animation: "slide-down"
    });
    // 延时 以展示完收起动画
    setTimeout(() => {
      this.setState({
        visible: false
      });
    }, 150);
  };

  handleChange = (e: any) => {
    const { range, mode } = this.props;
    if (mode === "multiSelector") {
      const valueList = isArray(e.detail.value)
        ? e.detail.value
        : [e.detail.value];
      this.realValue = valueList.map((v: any, i: number) => range[i][v].value);
      this.props.onValueChange!(this.realValue);
      return;
    }
    this.realValue = [(range[e.detail.value] as RangeItem).value];
    this.props.onValueChange!(this.realValue);
  };

  onConfirm = () => {
    const { selectedValue } = this.state;
    this.props.onChange(this.realValue || selectedValue);
    // 展示过渡动画
    setTimeout(this.closeModal);
  };

  renderMultiPicker = (data: any) => {
    return data.map((item: any, index: number) => {
      return (
        <PickerViewColumn key={index + ""}>
          {item.map((i: any) => {
            return (
              <View className="" key={i.value}>
                {i.label}
              </View>
            );
          })}
        </PickerViewColumn>
      );
    });
  };

  getVlaueIndex = (selectValue: any[]) => {
    const { range = [], mode } = this.props;
    return selectValue.map((v, i) => {
      let index = 0;
      const data = (mode === "multiSelector" ? range[i] : range) || [];
      (data as RangeItem[]).forEach((r: any, ri: number) => {
        if (r.value === v) {
          index = ri;
        }
      });
      return index;
    });
  };

  render() {
    const { range = [], value, mode, title } = this.props;
    const { visible, animation } = this.state;
    return (
      <View className="selector__modal__content" onClick={this.showModal}>
        {visible && (
          <View className={`mask ${animation}`} onClick={this.closeModal} />
        )}
        {visible && (
          <View className={`selector__modal ${animation}`}>
            <View className="picker-title">
              <Text className="picker-title-cancel" onClick={this.closeModal}>
                取消
              </Text>
              <Text className="picker-title-text">{title}</Text>
              <Text className="picker-title-ok" onClick={this.onConfirm}>
                确定
              </Text>
            </View>
            {/* <Text className="line" /> */}
            <PickerView
              value={this.getVlaueIndex(value)}
              onChange={this.handleChange}
            >
              {mode === "multiSelector" ? (
                this.renderMultiPicker(range)
              ) : (
                <PickerViewColumn>
                  {(range as RangeItem[]).map((i: any) => {
                    return (
                      <View className="" key={i.value}>
                        {i.label}
                      </View>
                    );
                  })}
                </PickerViewColumn>
              )}
            </PickerView>
          </View>
        )}
        {this.props.children}
      </View>
    );
  }
}
