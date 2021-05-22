import { SAVE_LIMIT } from './constants';
import type { TToken } from './types';

// update to spreadsheet
const updatePrevTokens = (sheet: GoogleAppsScript.Spreadsheet.Sheet, newTokens: TToken[]): void => {
  const values = newTokens.map((item) => [
    item.contractAddress,
    item.name,
    item.symbol,
    item.createdAt,
    item.locked,
    item.code,
  ])
  .reverse();

  values.forEach((row) => {
    sheet.appendRow(row);
  });

  const totalCount = sheet.getLastRow();
  const deleteCount = (totalCount - SAVE_LIMIT -1);
  if (deleteCount > 0) {
    cleanupTokens(sheet, deleteCount)
  }
};

// update to spreadsheet
const cleanupTokens = (sheet: GoogleAppsScript.Spreadsheet.Sheet, deleteCount: number): void => {
  sheet.deleteRows(2, deleteCount);
};

export default updatePrevTokens;
