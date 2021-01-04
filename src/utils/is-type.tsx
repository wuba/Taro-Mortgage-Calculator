/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date: 2020-12-11 11:27:12
 * @Last Modified by: qiuz
 * @Last Modified time: 2021-01-04 21:46:33
 */

const pattern = {
  // http://emailregex.com/
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  url: new RegExp(
    "^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$",
    "i"
  ),
  hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i
};

export const isNumber = (value: any) => {
  return typeof value === "number";
};

export const isRegExp = (value: any) => {
  return Object.prototype.toString.call(value) === "[object RegExp]";
};

export const isObject = (value: any) => {
  return Object.prototype.toString.call(value) === "[object Object]";
};

export const isError = (value: any) => {
  return Object.prototype.toString.call(value) === "[object Error]";
};

export const isString = (value: any) => {
  return typeof value === "string";
};

export const isFunction = (value: any) => {
  return typeof value === "function";
};

export const isArray = (value: any) => {
  return Object.prototype.toString.call(value) === "[object Array]";
};

export const isEmptyObject = (obj: any) => {
  if (obj === null || obj === undefined)
    return "Cannot convert undefined or null to object";
  return Object.keys(obj).length === 0;
};

export const isBoolean = (value: any) => {
  return (
    value === true ||
    value === false ||
    (isObject(value) &&
      Object.prototype.toString.call(value) === "[object Boolean]")
  );
};

export const isInteger = (value: any) => {
  return isNumber(value) && parseInt(value, 10) === value;
};
export const isFloat = (value: any) => {
  return isNumber(value) && !isInteger(value);
};

export const isDate = (value: any) => {
  if (!value) return false;
  return (
    typeof value.getTime === "function" &&
    typeof value.getMonth === "function" &&
    typeof value.getYear === "function"
  );
};

export const isEmail = (value: any) => {
  return (
    typeof value === "string" &&
    !!value.match(pattern.email) &&
    value.length < 255
  );
};

export const isUrl = (value: any) => {
  return typeof value === "string" && !!value.match(pattern.url);
};

export const isHex = (value: any) => {
  return typeof value === "string" && !!value.match(pattern.hex);
};

export const isPromise = (value: any) => {
  return value && typeof value.then === "function";
};
