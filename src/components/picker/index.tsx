/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2020-12-10 23:39:32
 * @Last Modified by: qiuz
 */

import React, { Component } from "react";
import { View, Text } from "@tarojs/components";
import Modal from "@ant-design/react-native/lib/modal";
import PickerView from "@ant-design/react-native/lib/picker-view";
import "./index.scss";
import { TaroPickerSelectorProps } from "./type";

export default class TaroPickerSelector extends Component<
  TaroPickerSelectorProps,
  any
> {
  static defaultProps = {
    range: [],
    value: [],
    cols: 1,
    cascade: true,
    onChange: () => {}
  };

  static options = {
    addGlobalClass: true
  };

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

  showModal = () => {
    const { value = [0] } = this.props;
    this.setState({
      visible: true,
      selectedValue: value
    });
  };

  closeModal = () => {
    this.setState({
      visible: false
    });
  };

  handleChange = (value: any) => {
    this.setState(
      {
        selectedValue: value
      },
      () => {
        this.props.onValueChange && this.props.onValueChange(value);
      }
    );
  };

  onConfirm = () => {
    const { selectedValue } = this.state;
    this.props.onChange(selectedValue);
    this.closeModal();
  };

  render() {
    const { range = [], cols, cascade, title } = this.props;
    const { visible, selectedValue } = this.state;
    return (
      <View onClick={this.showModal}>
        <Modal
          style={{ height: 300 }}
          popup
          maskClosable
          onClose={this.closeModal}
          visible={visible}
          animationType="slide-up"
        >
          <View className="picker-title">
            <Text className="picker-title-cancel" onClick={this.closeModal}>
              取消
            </Text>
            <Text className="picker-title-text">{title}</Text>
            <Text className="picker-title-ok" onClick={this.onConfirm}>
              确定
            </Text>
          </View>
          <PickerView
            itemStyle={{
              width: "100%",
              display: "flex",
              alignItems: "center"
            }}
            value={selectedValue}
            cols={cols}
            cascade={cascade}
            onChange={this.handleChange}
            data={range}
          />
        </Modal>
        {this.props.children}
      </View>
    );
  }
}
