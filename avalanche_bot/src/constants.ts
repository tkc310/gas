// データ取得時は100件、保存上限は50件とする
// 超えた場合は日付が古いものを削除
// なお、参照サイトの１ページのオフセットに概ね依存する
export const SAVE_LIMIT = 50;
export const DELETE_RANGE = `A2:F${SAVE_LIMIT + 1}`;
export const FETCH_LIMIT = 100;
export const FETCH_RANGE = `A2:F${FETCH_LIMIT + 1}`;
export const IGNORE_RANGE = `A2:B1000`;
export const IGNORE_NAME_REGS = [
  /( |-)Liquidity($| |-)/,
  /( |-)LPs($| |-)/,
  /( |-)LP($| |-)/,
  /( |-|^)Wrapped($| |-)/i,
  /test/i,
];
export const TWITTER_API_URL = 'https://api.twitter.com/1.1/statuses/update.json';
