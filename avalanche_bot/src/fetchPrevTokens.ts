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
      locked: item[4],
      code: item[5],
    };
  });

  return tokens || [];
};

export default fetchPrevTokens;
