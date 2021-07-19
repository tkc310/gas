import { TToken } from './types';

export const jstDate = (date?: string): string => {
  const _date = date ? new Date(date) : new Date();
  const result = _date
    .toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
    .replace(" JST", "");

  return result;
};

export const toFormat = (item: TToken): string =>
  `contract - ${item.contractAddress}
name - ${item.name}
symbol - ${item.symbol}
created - ${item.createdAt}
contract url - ${item.urlCodeVerify}
`;
