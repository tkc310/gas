const { SLACK_VERIFICATION_TOKEN } = process.env;

type doPostEventType = {
  parameter: {
    token: string;
  };
};

const doPost = (e: doPostEventType): GoogleAppsScript.Content.TextOutput => {
  // 指定したチャンネルからの命令しか受け付けない
  if (SLACK_VERIFICATION_TOKEN != e['parameter']['token']) {
    throw new Error(e['parameter']['token']);
  }

  // 返答データ本体
  const data = {
    //アタッチメントではない通常メッセージ
    text: 'み〜んなのみな実だよ！まずは言語を選んでね♡',

    // ここを"ephemeral"から"in_chanel"に変えると他の人にも表示されるらしい（？）
    response_type: 'ephemeral',

    //アタッチメント部分
    attachments: [
      {
        title: 'Language Select',
        text: 'Please select language.',
        fallback: 'Yeeeeeeeeeeah!!!',
        callback_id: 'callback_button',
        color: '#00bfff',
        attachment_type: 'default',

        // ボタン部分
        actions: [
          {
            name: 'eng',
            text: 'English',
            type: 'button', //
            value: 'language',
          },
          {
            name: 'jpn',
            text: '日本語',
            type: 'button',
            value: 'language',
          },
        ],
      },
    ],
  };

  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
};

export default doPost;
