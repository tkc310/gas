import { IGNORE_RANGE } from './constants';
import type { TIgnoreToken } from './types';

// fetch from spreadsheet
const fetchIgnoreTokens = (sheet: GoogleAppsScript.Spreadsheet.Sheet): TIgnoreToken[] => {
  const ignoreTokens = sheet
    .getRange(IGNORE_RANGE)
    .getValues()
    .filter((row) => row.every((cell) => !!cell));

  const tokens = ignoreTokens.map((item) => {
    return {
      name: item[0],
      symbol: item[1],
    };
  });

  return tokens || [];
};

export default fetchIgnoreTokens;
