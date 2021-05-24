import { jstDate } from './utils';
import type { TIgnoreToken, TToken } from './types';

declare const Cheerio: {
  load(string): any;
};

// scraping from avascan
// TODO: using api (v0.3 unsupported indexed c-chain)
// @see: https://docs.avascan.info/quickstart-graphql#avascan-api
export const fetchLatestTokens = (
  prevContracts: string[],
  ignoreTokens: TIgnoreToken[]
): TToken[] => {
  const scrapedTokens = scrapeTokens();
  const tokens = scrapedTokens
    .filter((latest) => {
      return prevContracts.every((prevC) => {
        return prevC !== latest.contractAddress;
      });
    })
    .filter((item) => {
      return ignoreTokens.every((ignore) => {
        return ignore.name !== item.name && ignore.symbol !== item.symbol;
      });
    })
    .filter((token, idx, self) => {
      const someItems = self.filter((item) => item.symbol === token.symbol);
      return someItems.length < 2;
    });

  // token毎にスクレイピングするためフィルター後の配列を利用
  const validatedTokens = tokens.map((item) => {
    // const locked = scrapedLocked(item.locked);
    const codeVerify = scrapedCode(item.urlCodeVerify, item.contractAddress);

    return {
      ...item,
      ...{
        // locked,
        codeVerify,
      },
    };
  });

  return validatedTokens;
};

// avascan sorted desc createdAt
const scrapeTokens = () => {
  const urlAvascan = 'https://avascan.info/blockchain/c/tokens?s=created-at%2Cdesc&p=1';
  const content = UrlFetchApp.fetch(urlAvascan).getContentText();
  const $ = Cheerio.load(content);

  const $trs = $('tbody').children();
  let results = [];
  $trs.each((_, tr) => {
    const $tr = $(tr);

    const symbol = $tr.find(".asset").text().trim();
    const name = $tr.find(".entityname").text().trim();
    const contractAddress = $tr.find(".hash").text().trim();
    const date = $tr.find("[data-timestamp]").attr("data-timestamp")?.trim();
    const createdAt = jstDate(date) || null;

    if (![symbol, name, contractAddress, createdAt].every(item => !!item)) {
      return;
    }

    const urlLockedLiquidity = encodeURI([
      `https://team.finance/view-coin/`,
      `${contractAddress}`,
      `?name=${name}`,
      `&symbol=${symbol}`,
    ].join(''));

    const pathCode = `/address/${contractAddress}/contracts`;
    const urlCodeVerify = encodeURI(`https://cchain.explorer.avax.network${pathCode}`);

    results.push({
      symbol,
      name,
      contractAddress,
      createdAt,
      codeVerify: "❌",
      urlCodeVerify,
      urlLockedLiquidity,
    });
  });

  return results;
};

const scrapedCode = (url: string, contractAddress: string): TToken["codeVerify"] => {
  const content = UrlFetchApp.fetch(url).getContentText();
  const $ = Cheerio.load(content);

  const path = `/address/${contractAddress}/contracts`;
  const verified = !!$(`a[href="${path}"]`)?.has('i.fa-check-circle');

  return verified ? "⭕️" : "❌";
};

// 反映にラグがあるためteam.financeからのスクレイピングは難しい
const scrapedLocked = (url) => {
  const content = UrlFetchApp.fetch(url).getContentText();
  const $ = Cheerio.load(content);

  const lockedValue = $('.left-coin-analysis .ant-card-body')
    .eq(1)
    .find('.coin-content-card > .coin-text')
    .text();
  const lockedPer = parseInt(lockedValue.match(/\d+/));
  const locked = lockedPer > 0;

  return locked;
};

export default fetchLatestTokens;
