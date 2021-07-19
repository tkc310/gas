import exec from './exec';
import { getOAuthURL } from './twitter';

declare const global: {
  [x: string]: unknown;
};

const {
  SLACK_VERIFICATION_TOKEN,
  SLACK_WEBHOOK_URL,
  SPREAD_SHEET_ID,
  SPREAD_SHEET_URL,
} = process.env;

// slackコマンド呼び出し用 (うまく動かん)
const doPost = (): void => {
  exec("post");
};

// 定期実行用
const doSchedule = () => {
  exec();
};

// 環境変数確認
export const env = (): void => {
  Logger.log({
    SLACK_VERIFICATION_TOKEN,
    SLACK_WEBHOOK_URL,
    SPREAD_SHEET_ID,
    SPREAD_SHEET_URL,
  });
};

global.doPost = doPost;
global.doSchedule = doSchedule;
global.getOAuthURL = getOAuthURL;
global.exec = exec;
global.env = env;
