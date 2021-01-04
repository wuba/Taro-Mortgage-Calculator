/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2020-12-10 23:36:03
 * @Last Modified by: qiuz
 */

import React, { FunctionComponent } from "react";
import { View, Image } from '@tarojs/components';
import Modal from '@ant-design/react-native/lib/modal';
import './index.scss';
import { CLOSE_ICON } from './constant';
import { TaroModalProps } from './type';
import { ComponentOptions } from "@tarojs/taro";

const TaroModal: FunctionComponent<TaroModalProps> & {
  options?: ComponentOptions;
} = (props) => {
  const { visible = false, closable = false, onClose = () => {}, closeIconStyle = {}, closeIconName = '' , animationType = 'fade' } = props;

  return (
    <Modal
      // @ts-ignore
      visible={visible}
      animationType={animationType}
      style={{
        width: '80%',
      }}
      {...props}
      closable={false}
    >
      {!closable && (
        <View className={`close-icon-box ${closeIconName}`} onClick={onClose} style={closeIconStyle}>
          <Image src={CLOSE_ICON} className="close-icon" />
        </View>
      )}
      <View className="taro-modal-content">{props.children}</View>
    </Modal>
  );
};

TaroModal.options = {
  addGlobalClass: true,
};


export default TaroModal;
