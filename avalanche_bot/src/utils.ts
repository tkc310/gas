import { TToken } from './types';

export const jstDate = (date?: string): string => {
  const _date = date ? new Date(date) : new Date();
  const result = _date
    .toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
    .replace(" JST", "");

  return result;
};

export const toMarkDown = (item: TToken): string =>
`*contractAddress* - ${item.contractAddress}
*name* - ${item.name}
*symbol* - ${item.symbol}
*createdAt* - ${item.createdAt}
*locked* - ${item.locked}
*code* - ${item.code}
`;
