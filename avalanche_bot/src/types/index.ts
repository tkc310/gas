export type TToken = {
  contractAddress: string;
  name: string;
  symbol: string;
  createdAt: string;
  codeVerify: '⭕️' | '❌';
  urlCodeVerify: boolean;
  urlLockedLiquidity: string;
};

export type TIgnoreToken = {
  name: string;
  symbol: string;
};
