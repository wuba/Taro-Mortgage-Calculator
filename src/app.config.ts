export default {
  pages: [
    "pages/calculator/index",
    "pages/calculator/monthly-payments/index",
    "pages/calculator/history/index"
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black"
  },
  rn: {
    screenOptions: {
      // 设置页面的options，参考https://reactnavigation.org/docs/stack-navigator/#options
      shadowOffset: { width: 0, height: 0 },
      borderWidth: 0,
      elevation: 0,
      shadowOpacity: 1,
      borderBottomWidth: 0
    }
  }
};
