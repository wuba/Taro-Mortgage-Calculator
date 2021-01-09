/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2020-12-10 23:41:11
 * @Last Modified by: qiuz
 */

export const imgPrefix = "../../assets/images";

import RIGHT_ARROW from "../../assets/images/yz_prop_icon_arrow.png";

// export const RIGHT_ARROW = `../../assets/images/yz_prop_icon_arrow.png`;
import QUESTION_ICON from "../../assets/images/esf_calculator_icon_question.png";
import RIGHT_ARROW_WHITE from "../../assets/images/yz_prop_icon_arrow_white.png";
import REPORT_BG_MARK from "../../assets/images/esf_calculator_img_mark.png";
import REPORT_BG_BUILDING from "../../assets/images/esf_calculator_img_building.png";
import CHECK_RIDIO_Y from "../../assets/images/comm_form_icon_gouxuan.png";
import CHECK_RIDIO from "../../assets/images/comm_form_icon_weigouxuan.png";

import PERCENT_ICON from "../../assets/images/esf_calculator_img_percent.png";
import GRADIENT_BG from "../../assets/images/esf_calculator_img_bggradient.png";

const DEMO_VIDEO = 'https://wos2.58cdn.com.cn/DeFazYxWvDti/frsupload/bed49a933db6b5deedd8b868ec9c8bca.mp4';

export {
  RIGHT_ARROW,
  PERCENT_ICON,
  RIGHT_ARROW_WHITE,
  REPORT_BG_MARK,
  REPORT_BG_BUILDING,
  CHECK_RIDIO_Y,
  CHECK_RIDIO,
  GRADIENT_BG,
  DEMO_VIDEO
};

export const LIST_TYPE = {
  0: ["reservedFunds", "busniessLoan", "group"],
  1: ["busniessLoan"],
  2: ["reservedFunds"]
};

export const COMPUTE_WAY = {
  0: ["loan"],
  1: ["house", "loan"]
};

export const getRenderList = (data: any) => {
  const { loanLrpType, commerceLoanYear, accumulatFundYear } = data;
  const LPR =
    loanLrpType === 1
      ? [
          {
            name: "LPR",
            icon: QUESTION_ICON,
            value: data["loanLrp"],
            readOnly: true,
            key: "loanLrp",
            valueStyle: {
              color: "#0B0F12"
            },
            ratio: 100,
            explain: {
              title: "LPR(贷款市场报价利率)",
              content:
                "自2019年10月起，商贷利率开始改用LPR（贷款市场报价利率）计算。LPR基准利率每月更新一次，实际贷款利率在LPR的基础上进行一定的浮动。"
            },
            unit: "%",
            renderType: "busniessLoan"
          },
          {
            name: "基点",
            icon: QUESTION_ICON,
            value: data["commercialLoanBasePoint"],
            key: "commercialLoanBasePoint",
            unit: "BP(‱)",
            explain: {
              title: "什么是基点？",
              content:
                "1个基点=0.01%，如果浮动10个基点，相当于在LPR的基础上增加0.1%为实际贷款利率。"
            },
            inputType: "number",
            keyboardType: "number-pad",
            renderType: "busniessLoan"
          },
          {
            name: "商贷利率",
            readOnly: true,
            value: data["commerceLoanRateEqua"],
            valueStyle: {
              color: "#979B9E"
            },
            key: "commerceLoanRateEqua",
            unit: data["commerceLoanRateNewUnit"],
            unitStyle: {
              color: "#0B0F12"
            },
            renderType: "busniessLoan"
          }
        ]
      : [
          {
            name: "商贷利率",
            readOnly: true,
            range: data.options["commerceLoanRate"] || [],
            value: data["commerceLoanRate"],
            type: "selector",
            rangeFilter:
              commerceLoanYear > 5
                ? "outFive"
                : commerceLoanYear > 1
                ? "inFive"
                : "inOne",
            key: "commerceLoanRate",
            unit: "arrowright",
            renderType: "busniessLoan"
          }
        ];
  return [
    {
      name: "房屋总价",
      value: data["houseTotal"],
      key: "houseTotal",
      unit: "万",
      maxLength: 6,
      inputType: "number",
      keyboardType: "number-pad",
      renderType: "house",
      hidden: ""
    },
    {
      name: "首付选择",
      value: data["downPayRate"],
      type: "selector",
      key: "downPayRate",
      range: data.options["downPayRate"] || [],
      unit: "arrowright",
      renderType: "house"
    },
    {
      name: "贷款金额",
      value: data["loanAmount"],
      inputType: "number",
      readOnly: data.way === 1,
      keyboardType: "number-pad",
      key: "loanAmount",
      unit: "万",
      valueStyle: {
        color: "#0B0F12"
      },
      renderType: "loan"
    },
    {
      name: "公积金金额",
      value: data["accumulatTotalPirce"],
      key: "accumulatTotalPirce",
      unit: "万",
      blurCheck: true,
      inputType: "number",
      keyboardType: "number-pad",
      renderType: "group"
    },
    {
      name: "公积金年限",
      value: data["accumulatFundYear"],
      type: "selector",
      key: "accumulatFundYear",
      range: data.options["accumulatFundYear"] || [],
      unit: "arrowright",
      renderType: "reservedFunds"
    },
    {
      name: "公积金利率",
      value: data["accumulatFundRate"],
      type: "selector",
      key: "accumulatFundRate",
      renderType: "reservedFunds",
      range: data.options["accumulatFundRate"] || [],
      rangeFilter: accumulatFundYear > 5 ? "outFive" : "inFive",
      unit: "arrowright"
    },
    {
      name: "商贷金额",
      value: data["commerceTotalPirce"],
      key: "commerceTotalPirce",
      unit: "万",
      inputType: "number",
      keyboardType: "number-pad",
      renderType: "group"
    },
    {
      name: "商贷年限",
      value: data["commerceLoanYear"],
      type: "selector",
      key: "commerceLoanYear",
      range: data.options["commerceLoanYear"] || [],
      unit: "arrowright",
      renderType: "busniessLoan"
    },
    {
      name: "利率方式",
      value: data["loanLrp"],
      type: "selector",
      key: "loanLrp",
      range: data.options["loanLrp"] || [],
      unit: "arrowright",
      renderType: "busniessLoan"
    },
    ...LPR
  ];
};

export const COMPUTE_WAY_TITLE = [
  {
    id: 1,
    index: 0,
    name: "按贷款总额",
    key: "way"
  },
  {
    id: 2,
    index: 1,
    name: "按房屋总价",
    key: "way"
  }
];
export const LOAN_WAY_TITLE = [
  {
    id: 3,
    index: 0,
    name: "组合贷",
    key: "loanType"
  },
  {
    id: 4,
    index: 1,
    name: "商业贷",
    key: "loanType"
  },
  {
    id: 5,
    index: 2,
    name: "公积金贷",
    key: "loanType"
  }
];

export const MONTY_DATA = [
  {
    title: "等额本息",
    type: "equalInterest",
    advant: "每月月供稳定"
  },
  {
    title: "等额本金",
    type: "equalPrincipal",
    advant: "每月递减20元"
  }
];

export const MONTY_TITLE = {
  equalInterest: "每月应还（元）",
  equalPrincipal: "首月应还（元）"
};

export const OPTION = {
  options: {
    commerceLoanYear: [
      {
        label: "1年",
        value: 1.0
      },
      {
        label: "2年",
        value: 2.0
      },
      {
        label: "3年",
        value: 3.0
      },
      {
        label: "4年",
        value: 4.0
      },
      {
        label: "5年",
        value: 5.0
      },
      {
        label: "6年",
        value: 6.0
      },
      {
        label: "7年",
        value: 7.0
      },
      {
        label: "8年",
        value: 8.0
      },
      {
        label: "9年",
        value: 9.0
      },
      {
        label: "10年",
        value: 10.0
      },
      {
        label: "11年",
        value: 11.0
      },
      {
        label: "12年",
        value: 12.0
      },
      {
        label: "13年",
        value: 13.0
      },
      {
        label: "14年",
        value: 14.0
      },
      {
        label: "15年",
        value: 15.0
      },
      {
        label: "16年",
        value: 16.0
      },
      {
        label: "17年",
        value: 17.0
      },
      {
        label: "18年",
        value: 18.0
      },
      {
        label: "19年",
        value: 19.0
      },
      {
        label: "20年",
        value: 20.0
      },
      {
        label: "21年",
        value: 21.0
      },
      {
        label: "22年",
        value: 22.0
      },
      {
        label: "23年",
        value: 23.0
      },
      {
        label: "24年",
        value: 24.0
      },
      {
        label: "25年",
        value: 25.0
      },
      {
        label: "26年",
        value: 26.0
      },
      {
        label: "27年",
        value: 27.0
      },
      {
        label: "28年",
        value: 28.0
      },
      {
        label: "29年",
        value: 29.0
      },
      {
        label: "30年",
        value: 30.0
      }
    ],
    commerceLoanRate: [
      {
        label: "3.43%（旧版基准利率7折)",
        value: 0.0343
      },
      {
        label: "3.68%（旧版基准利率7.5折)",
        value: 0.0368
      },
      {
        label: "3.92%（旧版基准利率8折)",
        value: 0.0392
      },
      {
        label: "4.17%（旧版基准利率8.5折)",
        value: 0.0417
      },
      {
        label: "4.41%（旧版基准利率9折)",
        value: 0.0441
      },
      {
        label: "4.66%（旧版基准利率9.5折)",
        value: 0.0466
      },
      {
        label: "4.9%（旧版基准利率)",
        value: 0.049
      },
      {
        label: "5.15%（旧版基准利率1.05倍)",
        value: 0.0515
      },
      {
        label: "5.39%（旧版基准利率1.1倍)",
        value: 0.0539
      },
      {
        label: "5.64%（旧版基准利率1.15倍)",
        value: 0.0564
      },
      {
        label: "5.88%（旧版基准利率1.2倍)",
        value: 0.0588
      },
      {
        label: "6.13%（旧版基准利率1.25倍)",
        value: 0.0613
      },
      {
        label: "6.37%（旧版基准利率1.3倍)",
        value: 0.0637
      }
    ],
    commerceLoanInFiveYearRate: [
      {
        label: "3.33%（旧版基准利率7折)",
        value: 0.0333
      },
      {
        label: "3.56%（旧版基准利率7.5折)",
        value: 0.0356
      },
      {
        label: "3.8%（旧版基准利率8折)",
        value: 0.038
      },
      {
        label: "4.04%（旧版基准利率8.5折)",
        value: 0.0404
      },
      {
        label: "4.28%（旧版基准利率9折)",
        value: 0.0428
      },
      {
        label: "4.51%（旧版基准利率9.5折)",
        value: 0.0451
      },
      {
        label: "4.75%（旧版基准利率)",
        value: 0.0475
      },
      {
        label: "4.99%（旧版基准利率1.05倍)",
        value: 0.0499
      },
      {
        label: "5.23%（旧版基准利率1.1倍)",
        value: 0.0523
      },
      {
        label: "5.46%（旧版基准利率1.15倍)",
        value: 0.0546
      },
      {
        label: "5.7%（旧版基准利率1.2倍)",
        value: 0.057
      },
      {
        label: "5.94%（旧版基准利率1.25倍)",
        value: 0.0594
      },
      {
        label: "6.18%（旧版基准利率1.3倍)",
        value: 0.0618
      }
    ],
    commerceLoanInOneYearRate: [
      {
        label: "3.05%（旧版基准利率7折)",
        value: 0.0305
      },
      {
        label: "3.26%（旧版基准利率7.5折)",
        value: 0.0326
      },
      {
        label: "3.48%（旧版基准利率8折)",
        value: 0.0348
      },
      {
        label: "3.7%（旧版基准利率8.5折)",
        value: 0.037
      },
      {
        label: "3.92%（旧版基准利率9折)",
        value: 0.0392
      },
      {
        label: "4.13%（旧版基准利率9.5折)",
        value: 0.0413
      },
      {
        label: "4.35%（旧版基准利率)",
        value: 0.0435
      },
      {
        label: "4.57%（旧版基准利率1.05倍)",
        value: 0.0457
      },
      {
        label: "4.79%（旧版基准利率1.1倍)",
        value: 0.0479
      },
      {
        label: "5%（旧版基准利率1.15倍)",
        value: 0.05
      },
      {
        label: "5.22%（旧版基准利率1.2倍)",
        value: 0.0522
      },
      {
        label: "5.44%（旧版基准利率1.25倍)",
        value: 0.0544
      },
      {
        label: "5.66%（旧版基准利率1.3倍)",
        value: 0.0566
      }
    ],
    loanLrp: [
      {
        label: "使用最新LPR",
        value: 0.0465
      },
      {
        label: "使用旧版基准利率",
        value: 0.0
      }
    ],
    loanInFiveYearLrp: null,
    accumulatFundYear: [
      {
        label: "1年",
        value: 1.0
      },
      {
        label: "2年",
        value: 2.0
      },
      {
        label: "3年",
        value: 3.0
      },
      {
        label: "4年",
        value: 4.0
      },
      {
        label: "5年",
        value: 5.0
      },
      {
        label: "6年",
        value: 6.0
      },
      {
        label: "7年",
        value: 7.0
      },
      {
        label: "8年",
        value: 8.0
      },
      {
        label: "9年",
        value: 9.0
      },
      {
        label: "10年",
        value: 10.0
      },
      {
        label: "11年",
        value: 11.0
      },
      {
        label: "12年",
        value: 12.0
      },
      {
        label: "13年",
        value: 13.0
      },
      {
        label: "14年",
        value: 14.0
      },
      {
        label: "15年",
        value: 15.0
      },
      {
        label: "16年",
        value: 16.0
      },
      {
        label: "17年",
        value: 17.0
      },
      {
        label: "18年",
        value: 18.0
      },
      {
        label: "19年",
        value: 19.0
      },
      {
        label: "20年",
        value: 20.0
      },
      {
        label: "21年",
        value: 21.0
      },
      {
        label: "22年",
        value: 22.0
      },
      {
        label: "23年",
        value: 23.0
      },
      {
        label: "24年",
        value: 24.0
      },
      {
        label: "25年",
        value: 25.0
      },
      {
        label: "26年",
        value: 26.0
      },
      {
        label: "27年",
        value: 27.0
      },
      {
        label: "28年",
        value: 28.0
      },
      {
        label: "29年",
        value: 29.0
      },
      {
        label: "30年",
        value: 30.0
      }
    ],
    accumulatFundRate: [
      {
        label: "3.25%（最新基准利率1倍)",
        value: 0.0325
      },
      {
        label: "3.58%（最新基准利率1.1倍)",
        value: 0.0358
      },
      {
        label: "3.9%（最新基准利率1.2倍)",
        value: 0.039
      },
      {
        label: "4.23%（最新基准利率1.3倍)",
        value: 0.0423
      }
    ],
    accumulatFundInFiveYearRate: [
      {
        label: "2.75%（最新基准利率1倍)",
        value: 0.0275
      },
      {
        label: "3.03%（最新基准利率1.1倍)",
        value: 0.0303
      },
      {
        label: "3.3%（最新基准利率1.2倍)",
        value: 0.033
      },
      {
        label: "3.58%（最新基准利率1.3倍)",
        value: 0.0358
      }
    ],
    downPayRate: [
      {
        label: "10%",
        value: 0.1
      },
      {
        label: "15%",
        value: 0.15
      },
      {
        label: "20%",
        value: 0.2
      },
      {
        label: "25%",
        value: 0.25
      },
      {
        label: "30%",
        value: 0.3
      },
      {
        label: "35%",
        value: 0.35
      },
      {
        label: "40%",
        value: 0.4
      },
      {
        label: "45%",
        value: 0.45
      },
      {
        label: "50%",
        value: 0.5
      },
      {
        label: "55%",
        value: 0.55
      },
      {
        label: "60%",
        value: 0.6
      },
      {
        label: "65%",
        value: 0.65
      },
      {
        label: "70%",
        value: 0.7
      },
      {
        label: "75%",
        value: 0.75
      },
      {
        label: "80%",
        value: 0.8
      },
      {
        label: "85%",
        value: 0.85
      },
      {
        label: "90%",
        value: 0.9
      },
      {
        label: "95%",
        value: 0.95
      }
    ]
  },
  defult: {
    commerceLoanYear: 30,
    commerceLoanRate: 0.049,
    commerceLoanInFiveYearRate: 0.0475,
    commerceLoanInOneYearRate: 0.0435,
    loanLrp: 0.0465,
    loanInOneYearLrp: 0.0385,
    accumulatFundYear: 30,
    accumulatFundRate: 0.0325,
    accumulatFundInFiveYearRate: 0.0275,
    downPayRate: 0.3,
    accumulatLoanLimit: 120.0
  }
};
