/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2021-01-09 14:00:01
 * @Last Modified by: qiuz
 */

import { ViewProps } from '@tarojs/components/types/view';
import { ComponentOptions } from '@tarojs/taro';
import { FunctionComponent } from 'react';
import { NativeSafeAreaViewProps } from 'react-native-safe-area-context';

export interface TaroSafeAreaViewProps {
  style?: object;
}

export type TaroSafeAreaViewType = FunctionComponent<
  NativeSafeAreaViewProps & ViewProps
> & {
  options?: ComponentOptions;
};

declare const TaroSafeAreaView: TaroSafeAreaViewType;

export default TaroSafeAreaView;
