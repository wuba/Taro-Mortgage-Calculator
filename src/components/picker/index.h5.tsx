/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2020-12-10 23:39:23
 * @Last Modified by: qiuz
 */

import React from "react";
import { ComponentOptions, FunctionComponent } from "@tarojs/taro";
import { Picker } from "@tarojs/components";
import { isArray } from "@utils";
import "./index.scss";
import { TaroPickerSelectorProps, RangeItem } from "./type";

const TaroPickerSelector: FunctionComponent<TaroPickerSelectorProps> & {
  options?: ComponentOptions;
} = props => {
  const {
    range = [],
    onChange = () => {},
    onValueChange = () => {},
    value = [0],
    styleName = "",
    title = "",
    mode = "selector",
    columnReset = false
  } = props;

  const handleChange = (e: any) => {
    if (mode === "multiSelector") {
      const valueList = isArray(e.detail.value)
        ? e.detail.value
        : [e.detail.value];
      const realValue = valueList.map((v: any, i: number) => range[i][v].value);
      onChange(realValue);
      return;
    }
    onChange([(range[e.detail.value] as RangeItem).value]);
  };

  const handleValueChange = (e: any) => {
    if (mode === "multiSelector") {
      const { column } = e.detail;
      const valueList = [...value];
      valueList[column] = range[column][e.detail.value].value;
      onValueChange(valueList as number[]);
      return;
    }
    onValueChange([range[e.detail.value]]);
  };

  const getVlaueIndex = (selectValue: any[]) => {
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

  return (
    <Picker
      mode={mode}
      // @ts-ignore
      title={title}
      className={styleName}
      range={range as any[]}
      rangeKey="label"
      // @ts-ignore
      columnReset={columnReset}
      value={getVlaueIndex(value)}
      onChange={handleChange}
      onColumnChange={handleValueChange}
    >
      {props.children}
    </Picker>
  );
};

TaroPickerSelector.options = {
  addGlobalClass: true
};

export default TaroPickerSelector;
