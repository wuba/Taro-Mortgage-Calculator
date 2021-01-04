/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2020-12-10 23:36:31
 * @Last Modified by: qiuz
 */

export interface TaroModalProps {
  visible: boolean;
  closable?: boolean;
  maskClosable?: boolean;
  style?: {};
  bodyStyle?: {};
  animationType?: string;
  onClose?(): void;
  footer?: never[];
  transparent?: boolean;
  popup?: boolean;
  animateAppear?: boolean;
  operation?: boolean;
  closeIconStyle?: any;
  closeIconName?: string;
  className?: string;
}
