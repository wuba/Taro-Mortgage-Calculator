/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date:  2020-12-09 14:14:02
 * @Last Modified by: qiuz
 */

/**
 * 等额本息计算方式
 * 每月还款额=贷款本金×[月利率×（1+月利率）^还款月数]÷[（1+月利率）^还款月数-1]
 * 总支付利息：总利息=还款月数×每月月供额-贷款本金
 * 每月应还利息=贷款本金×月利率×〔(1+月利率)^还款月数-(1+月利率)^(还款月序号-1)〕÷〔(1+月利率)^还款月数-1〕
 * 每月应还本金=贷款本金×月利率×(1+月利率)^(还款月序号-1)÷〔(1+月利率)^还款月数-1〕
 * 总利息=还款月数×每月月供额-贷款本金
 *
 * 等额本金计算方式编辑
 * 每月月供额=(贷款本金÷还款月数)+(贷款本金-已归还本金累计额)×月利率
 * 每月应还本金=贷款本金÷还款月数
 * 每月应还利息=剩余本金×月利率=(贷款本金-已归还本金累计额)×月利率。
 * 每月月供递减额=每月应还本金×月利率=贷款本金÷还款月数×月利率
 * 总利息=还款月数×(总贷款额×月利率-月利率×(总贷款额÷还款月数)*(还款月数-1)÷2+总贷款额÷还款月数)
 */

interface ParamsProps {
  totalPrice: number;
  commerceLoanYear: number;
  commerceLoanRate: number;
  commerceTotalPirce: number;
  accumulatFundYear: number;
  accumulatFundRate: number;
  accumulatTotalPirce: number;
}
export const equalInterestCalc = ({
  commerceLoanYear,
  commerceLoanRate,
  commerceTotalPirce,
  accumulatFundYear,
  accumulatFundRate,
  accumulatTotalPirce
}: ParamsProps) =>
  new Promise(resolve => {
    const commerceMonth = commerceLoanYear * 12;
    const commercePayMonty: number = getInterestEveryMonth(
      commerceTotalPirce,
      commerceLoanRate / 12,
      commerceMonth
    );
    const accumlatMonth = accumulatFundYear * 12;
    const accumlatPayMonty: number = getInterestEveryMonth(
      accumulatTotalPirce,
      accumulatFundRate / 12,
      accumlatMonth
    );
    const interestTotal = getInterestTotal(
      commercePayMonty * commerceMonth + accumlatPayMonty * accumlatMonth,
      commerceTotalPirce + accumulatTotalPirce
    );
    const principalCommList = getPrincipalListByMonth(
      commerceTotalPirce,
      commerceLoanRate / 12,
      commerceMonth
    );
    const principalAccuList = getPrincipalListByMonth(
      accumulatTotalPirce,
      accumulatFundRate / 12,
      accumlatMonth
    );
    const principalList = mergeList(
      principalCommList,
      principalAccuList,
      commerceMonth,
      accumlatMonth
    );
    const principalTotal = getPrincipalTotal(
      principalList,
      commerceTotalPirce + accumulatTotalPirce
    );
    const equalInterestPayMonth = parseInt(
      ((commercePayMonty + accumlatPayMonty) * 10000).toFixed(0),
      10
    );
    resolve({
      equalInterest: {
        payMonth: equalInterestPayMonth,
        totalInterest: interestTotal.toFixed(1),
        monthDecline: 0
      },
      equalPrincipal: {
        payMonth: principalList[0],
        totalInterest: principalTotal.toFixed(1),
        monthDecline: principalList[0] - principalList[1]
      },
      equalInterestMonthList: new Array(
        Math.max(commerceMonth, accumlatMonth)
      ).fill(equalInterestPayMonth),
      equalPrincipalMonthList: principalList
    });
  });

/**
 * 获取（等额本息）每月还款额
 *
 * @param loanTotalPrice 贷款总额
 * @param monthLoanRate  每月利息
 * @param monthNum       贷款期限（月份）
 * @return
 */
const getInterestEveryMonth = (
  loanTotalPrice: number,
  monthLoanRate: number,
  monthNum: number
): number => {
  if (Math.pow(1 + monthLoanRate, monthNum) - 1 == 0) {
    return 0;
  }
  return (
    (loanTotalPrice * monthLoanRate * Math.pow(1 + monthLoanRate, monthNum)) /
    (Math.pow(1 + monthLoanRate, monthNum) - 1)
  );
};

/**
 * 获取（等额本息）利息总额
 *
 * @param repaymentTotal 还款总额
 * @param loanTotalPrice 贷款总额
 * @return
 */
const getInterestTotal = (
  repaymentTotal: number,
  loanTotalPrice: number
): number => {
  return repaymentTotal - loanTotalPrice;
};

const getPrincipalTotal = (list: number[], loanTotalPrice: number): number => {
  return list.reduce((p, c) => p + c) / 10000 - loanTotalPrice;
};

const getPrincipalListByMonth = (
  loanTotalPrice: number,
  monthLoanRate: number,
  monthNum: number
): number[] => {
  const accumulatList: number[] = [];
  let finshRepayTotal = 0;
  for (let i = 0; i < monthNum; i++) {
    const repayMonth =
      loanTotalPrice / monthNum +
      (loanTotalPrice - finshRepayTotal) * monthLoanRate;
    finshRepayTotal = finshRepayTotal + loanTotalPrice / monthNum;
    accumulatList.push(parseInt((repayMonth * 10000).toFixed(0), 10));
  }
  return accumulatList;
};

/**
 * 在组合贷款下拼接（等额本金）和（等额本金）分月还款额
 *
 * @param commList     商业贷款分月还款数额列表
 * @param accuList     公积金贷款分月还款数额列表
 * @param commMonthNum 商业贷款期限（月份）
 * @param accuMonthNum 公积金贷款期限（月份）
 * @return
 */
const mergeList = (
  commList: number[],
  accuList: number[],
  commMonthNum: number,
  accuMonthNum: number
): number[] => {
  const size = Math.min(commMonthNum, accuMonthNum);

  const list: number[] = [];
  for (let i = 0; i < size; i++) {
    list.push((commList[i] || 0) + (accuList[i] || 0));
  }
  return list;
};

