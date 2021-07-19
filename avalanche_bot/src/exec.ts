import fetchLatestTokens from './fetchLatestTokens';
import fetchPrevTokens from './fetchPrevTokens';
import fetchIgnoreTokens from './fetchIgnoreTokens';
import updatePrevTokens from './updatePrevTokens';
import { toFormat } from './utils';
import tweet from './twitter';

const { SLACK_WEBHOOK_URL, SPREAD_SHEET_ID } = process.env;

const exec = (type?: "post"): void  => {
  const spreadsheet = SpreadsheetApp.openById(SPREAD_SHEET_ID);
  const sheetPrevTokens = spreadsheet.getSheetByName('prevTokens');
  const sheetIgnoreTokens = spreadsheet.getSheetByName('ignores');
  const ignoreTokens = fetchIgnoreTokens(sheetIgnoreTokens);

  const prevTokens = fetchPrevTokens(sheetPrevTokens);
  const prevContracts = prevTokens.map((item) => item.contractAddress) || [];
  const latestTokens = fetchLatestTokens(prevContracts, ignoreTokens);
  const outputTokens = latestTokens
    .filter((item) => item.codeVerify === '⭕️')
    .map((item) => toFormat(item));

  if (latestTokens.length) {
    updatePrevTokens(sheetPrevTokens, latestTokens);
  }

  const result = latestTokens.length
    ? `${outputTokens.join('--- --- ---\n')}`
    : 'No listed new tokens.';

  Logger.log({ result });

  if (type === "post" || outputTokens.length) {
    // @ts-ignore
    outputTokens.forEach((message) => {
      tweet(message);
    });
  }
};

export default exec;
