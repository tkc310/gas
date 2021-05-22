import { jstDate } from './utils';
import type { TIgnoreToken, TToken } from './types';

declare const Cheerio: {
  load(string): any;
};

// scraping from avascan
// TODO: scraping to get api
export const fetchLatestTokens = (
  prevContracts: string[],
  ignoreTokens: TIgnoreToken[]
): TToken[] => {
  const scrapedTokens = scrapeAvascan();
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

  // const validatedTokens = tokens.map((item) => {
  //   const locked = scrapedLocked(item.locked);
  //   const code = scrapedCode(item.code, item.contractAddress);

  //   return {
  //     ...item,
  //     ...{
  //       locked,
  //       code,
  //     },
  //   };
  // });

  return tokens;
};

// avascan sorted desc createdAt
const scrapeAvascan = () => {
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

    const pathCode = `/address/${contractAddress}/contracts`;
    const urlCode = encodeURI(`https://cchain.explorer.avax.network${pathCode}`);
    const urlLocked = encodeURI([
      `https://team.finance/view-coin/`,
      `${contractAddress}`,
      `?name=${name}`,
      `&symbol=${symbol}`,
    ].join(''));

    results.push({
      symbol,
      name,
      contractAddress,
      createdAt,
      locked: urlLocked,
      code: urlCode,
    });
  });

  return results;
};

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

const scrapedCode = (url: string, contractAddress: string): boolean => {
  const content = UrlFetchApp.fetch(url).getContentText();
  const $ = Cheerio.load(content);

  const path = `/address/${contractAddress}/contracts`;
  const locked = !!$(`a[href="${path}"]`)?.has('i.fa-check-circle');

  return locked;
};

export default fetchLatestTokens;
