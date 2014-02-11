# JQuery Form Validate(Bootstrap3/2.x)

## 解説
このプログラムは、Bootstrap3形式のフォーム値のValidateを行います。

## 書式

    $("フォーム").formValidate({ <オプション>,fields:[
     { name:'<フィールド名1>', d_name:'<フィールド表示名n>', rules:<ルール or ルール配列>'},
                        :
     { name:'<フィールド名n>', d_name:'<フィールド表示名n>', rules:<ルール or ルール配列>'},
    ]});

    $("フォーム").formValidate('<メソッド名>');

### オプション

| オプション名 | 初期値 | 機能 |
| :--- | :--- | :--- |
|result| null|結果を指定functionに渡す|
|submit | 'validate' | メソッド文字列 or function |
|confirm_suffix | '_CONFIRM' | |
|zip_suffix | '_AFTER' | |
|fields | null | |
|errorType:null | 'tb2'=TwitterBootstrap2形式でエラーを表示 |
|clearError:null | |
|setError:null | |
|focusError | true | true=エラー時に最初のエラーにフォーカスする |
|focusErrorSpeed | 'fast' | フォーカスの移動スピード(JQuery animationのspeedパラメータ) |

### メソッド

| オプション名 | 機能 |
| :--- | :--- |
| init | 初期化 |
| dispError| エラー表示処理 |
|focusError| 指定のエラーにフォーカス|
|clearError| エラークリア処理 未指定時全て|
|setError| 指定箇所エラー表示処理|
|clearErrorTb| エラークリア処理|
|setErrorTb| 指定箇所エラー表示処理|
|validate| パラメータチェック|
|validate_alert| パラメータチェック(エラー時アラート)|
|getValidateResult| パラメータチェック結果取得|

### ルール

| ルール名 | 機能 |
|:---|:---|
| zip_ex | 郵便番号(<フィールド名>と<フィールド名>_AFTERの2か所チェック) |
| ymd | 年月日(name+"_Y", name+"_M", name+"_D") |
| email | E-Mail |
| zenkaku | 全角 |
| hankaku | 半角 |
| zen_katakana | 全角カタカナ |
| hiragana | 全角ひらがな |
| minlength:<数値> | 最小文字数 |
| maxlength:<数値> | 最大文字数 |
| numlength:<数値>[,<数値>] | 最大文字数[最小～最大文字数] |
| number | 数値 |
| numlength:<数値> | 数値桁数指定 |
| min:<数値> | 最小値 |
| max:<数値> | 最大値 |
| range:<最小値>,<最大値> | 数値範囲 |
| range:[<最小値>,<最大値>] | 数値範囲 |
| date | 日付 |
| datetime | 日時 |
| time | 時間 |
| zip | 郵便番号 |
| date_ex | 日付([YYYY/MM/DD] or [YYYY/MM] or [YYYY]の書式でチェックする) |
| regexp:<正規表現>,<フラグ>,<エラーメッセージ> | 正規表現  <フラグ>,<エラーメッセージ>は省略可   正規表現中に「,」が含まれる場合、JSON書式でも可 |
