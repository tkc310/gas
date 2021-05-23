import { FETCH_RANGE } from './constants';
import type { TToken } from './types';

// fetch from spreadsheet
const fetchPrevTokens = (sheet: GoogleAppsScript.Spreadsheet.Sheet): TToken[] => {
  const prevTokens = sheet
    .getRange(FETCH_RANGE)
    .getValues()
    .filter((row) => row.every((cell) => !!cell));

  const tokens = prevTokens.map((item) => {
    return {
      contractAddress: item[0],
      name: item[1],
      symbol: item[2],
      createdAt: item[3],
      codeVerify: item[4],
      urlCodeVerify: item[5],
      urlLockedLiquidity: item[6],
    };
  });

  return tokens || [];
};

export default fetchPrevTokens;
