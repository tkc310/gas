import getRandomNumber from './getRandomNumber';
const { SLACK_VERIFICATION_TOKEN, SPREAD_SHEET_ID, SPREAD_SHEET_URL } = process.env;

type doPostEventType = {
  parameter: {
    token: string;
    text: string | undefined;
  };
};

const doPost = (e: doPostEventType): GoogleAppsScript.Content.TextOutput => {
  if (SLACK_VERIFICATION_TOKEN != e.parameter.token) {
    throw new Error('Token Invalid');
  }

  const result = run(e.parameter);
  return ContentService.createTextOutput(
    JSON.stringify({
      response_type: 'in_channel',
      text: result,
    })
  ).setMimeType(ContentService.MimeType.JSON);
};

export const run = (params: doPostEventType['parameter'] | undefined): string => {
  let result = '';

  // foo, bar, bazのようなリストを渡された時はランダムに抽出
  if (params && params.text) {
    const items = params.text
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item);
    const randomIdx = getRandomNumber(0, items.length);

    result = items[randomIdx];
  } else {
    const spreadsheet = SpreadsheetApp.openById(SPREAD_SHEET_ID);
    const sheet = spreadsheet.getSheetByName('members');
    const length = sheet.getRange('G1').getValues()[0][0];
    const range = 'A2:D' + (parseInt(length) + 1);
    const values = sheet.getRange(range).getValues();
    const randomIdx = getRandomNumber(0, parseInt(length));
    const nickNameIdx = 0;
    const slackNameIdx = 1;
    const iconIdx = 2;
    const item = values[randomIdx];

    result = `
${item[iconIdx]} ${item[slackNameIdx]} (${item[nickNameIdx]}さん) \n
memberの編集は<${SPREAD_SHEET_URL}|こちら>
`;
  }

  Logger.log(result);

  return result;
};

export const env = (): void => {
  Logger.log({
    SLACK_VERIFICATION_TOKEN,
    SPREAD_SHEET_ID,
  });
};

export default doPost;
