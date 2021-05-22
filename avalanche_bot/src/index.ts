import exec from './exec';

declare const global: {
  [x: string]: unknown;
};

const {
  SLACK_VERIFICATION_TOKEN,
  SLACK_WEBHOOK_URL,
  SPREAD_SHEET_ID,
  SPREAD_SHEET_URL,
} = process.env;

type doGetEventType = {
  parameter: {
    token: string;
    text: string | undefined;
  };
};

// slackコマンド呼び出し用 (うまく動かん)
const doPost = (
  // e: doGetEventType
): void => {
  // if (SLACK_VERIFICATION_TOKEN != e?.parameter?.token) {
  //   throw new Error('Token Invalid');
  // }

  exec("post");
};

// cron実行用
export const doSchedule = () => {
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
global.exec = exec;
global.env = env;
