import fetchLatestTokens from './fetchLatestTokens';
import fetchPrevTokens from './fetchPrevTokens';
import fetchIgnoreTokens from './fetchIgnoreTokens';
import updatePrevTokens from './updatePrevTokens';
import { toMarkDown } from './utils';

const { SLACK_WEBHOOK_URL, SPREAD_SHEET_ID } = process.env;

const exec = (type?: "post"): void  => {
  const spreadsheet = SpreadsheetApp.openById(SPREAD_SHEET_ID);
  const sheetPrevTokens = spreadsheet.getSheetByName('prevTokens');
  const sheetIgnoreTokens = spreadsheet.getSheetByName('ignores');
  const ignoreTokens = fetchIgnoreTokens(sheetIgnoreTokens);

  const prevTokens = fetchPrevTokens(sheetPrevTokens);
  const prevContracts = prevTokens.map((item) => item.contractAddress) || [];
  const latestTokens = fetchLatestTokens(prevContracts, ignoreTokens);
  const reformatTokens = latestTokens.map((item) => toMarkDown(item));

  if (latestTokens.length) {
    updatePrevTokens(sheetPrevTokens, latestTokens);
  }

  const result = latestTokens.length
    ? `@here 新台が出たよ〜(•̀ᴗ•́)و\n${reformatTokens.join('--- --- ---\n')}\n計: ${latestTokens.length}件`
    : 'No listed new tokens.';

  Logger.log({ result });

  if (type === "post" || latestTokens.length) {
    const options = {
      method : "post",
      contentType : "application/json",
      payload : JSON.stringify(
        {
          "text" : result,
          link_names: 1
        }
      )
    };
    // @ts-ignore
    UrlFetchApp.fetch(SLACK_WEBHOOK_URL, options);
  }
};

export default exec;
