/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2020-12-10 23:36:13
 * @Last Modified by: qiuz
 */

import React, { FunctionComponent } from "react";
import { AtModal } from 'taro-ui';
import './index.scss';
import { View, Image } from '@tarojs/components';
import { CLOSE_ICON } from './constant';
import { TaroModalProps } from './type';

const TaroModal: FunctionComponent<TaroModalProps> = (props) => {
  const { visible = false, closable = false, onClose = () => {} } = props;

  return (
    <AtModal isOpened={visible}>
      {closable && (
        <Image src={CLOSE_ICON} onClick={onClose} className="at-modal-content-close-iocn" />
      )}
      <View className="at-modal-content">{props.children}</View>
    </AtModal>
  );
};

export default TaroModal;
