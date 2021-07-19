# Google App Script で作った bot 置き場

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
$ cp -a starter_kit <app-name> && cd $_

# .clasp.jsonのscriptIdを書き換える
$ vi .clasp.json
# {
#   "scriptId": "<your_script_id>",
#   "rootDir": "dist"
# }

# npm install
$ npm i

# lint
npm run lint

# build & deploy
$ npm run untest_push
```

## ライブラリの追加

1. web 上でライブラリを追加して `appscript.json` の内容をコピー
2. ローカルの `appscript.json` にコピーする
