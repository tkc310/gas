# Google App Scriptの学習用

## clasp

```
# install
$ npm i -g clasp

# アカウント認証
$ clasp login

# Google Apps Script APIをオンにする
$ open https://script.google.com/u/1/home/usersettings

# プロジェクト作成
$ clasp create <app-name>

# デプロイ
$ clasp push
```

## starter kit

```
$ cp starter_kit <app-name> && cd $_
$ npm i

# scriptIdを書き換える
# { "scriptId": "<your_script_id>", "rootDir": "dist" }
$ vi .clasp.json

# build & deploy
$ npm run push
```
