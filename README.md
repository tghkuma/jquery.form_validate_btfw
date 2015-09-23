# JQuery Form Validate(Bootstrap3/TwitterBootstrap2.x)

## 解説
このプログラムは、Bootstrap3形式のフォーム値のValidateを行います。

## 書式

Validate定義
Submit時にValidateを行います。

````javascript
$("フォーム").formValidate({ <オプション>,fields:[
 { name:'<フィールド名1>'[, d_name:'<フィールド表示名1>'][, rules:<ルール or ルール配列>]},
                    :
 { name:'<フィールド名n>', d_name:'<フィールド表示名n>', rules:<ルール or ルール配列>},
]});
````

別のタイミングでValidateを行う場合。

````javascript
$("フォーム").formValidate({ submit:null,fields:<フィールド定義配列>});
                    :
$("フォーム").formValidate('validate');
````

### オプション

オプション名 | 初期値 | 機能
--- | --- | ---
result| null|結果を指定functionに渡す
submit |"validate" | Submit時に行う処理、メソッド文字列 or 関数 or null(何もしない)
confirm_suffix|"\_CONFIRM" | confirmルールの確認フィールドの接尾語
zip_suffix | "\_AFTER" |zip_exルールの4桁フィールドの接尾語
fields | null |各種フィールド定義配列
errorType| null | "tb2"=TwitterBootstrap2形式でエラーを表示
clearError | null | エラークリア関数を指定
setError| null | エラー設定関数を指定
focusError | true | true=エラー時に最初のエラーにフォーカスする<br>メソッド:validate, validate_alertで利用
focusErrorSpeed | "fast" | フォーカスのスクロール<br>(JQuery animateのduration. "slow","normal","fast"またはミリ秒)

### フィールド定義

属性名 | 機能
--- | ---
name | フィールド名.input,textarea,select等のnameを指定
d_name | 表示名.通常は未使用でvalidate_alertメソッドのalert表示で使用される
rules | Validateルール. 1件の場合はルール文字列.複数の場合は配列で定義する

### メソッド

下記の書式でメソッドを実行できる。

````javascript
$("フォーム").formValidate('メソッド名'[,<パラメータ1>[...,<パラメータn>]);
````

メソッド名 |パラメータ| 機能
--- | --- | ---
init |オプションオブジェクト| 初期化
dispError|オプションオブジェクト| エラー表示処理
focusError|name| nameフィールドにフォーカス
clearError|name| nameフィールドのエラークリア.未指定時全てクリア
setError|name, message| nameフィールドにmessageエラーを表示
validate|オプションオブジェクト| パラメータチェック<br>戻り値:true=正常, false=エラー
validate_alert|オプションオブジェクト| パラメータチェック<br>エラー時alert()でエラー表示
getValidateResult|オプションオブジェクト|パラメータチェック結果取得<br>戻り値:エラーメッセージ配列

### ルール

ルール名 | 機能
---|---
zip_ex | 郵便番号.  nameとname+"\_AFTER"の2か所をチェック
ymd | 年月日.  name+"\_Y", name+"\_M", name+"\_D"の３か所をチェック
email | E-Mail
tel | 電話番号
zenkaku | 全角
hankaku | 半角
zen_katakana | 全角カタカナ
hiragana | 全角ひらがな
minlength:<数値> | 最小文字数
maxlength:<数値> | 最大文字数
numlength:<数値>[,<数値>] | 最大文字数[最小～最大文字数]
number | 数値
numlength:<数値> | 数値桁数指定
min:<数値> | 最小値
max:<数値> | 最大値
checkbox:<最少選択数>[,<最大選択数>]| チェックボックスの選択チェック
radio| ラジオ必須チェック
range:<最小値>,<最大値> | 数値範囲
range:[<最小値>,<最大値>] | 数値範囲
date | 日付
datetime | 日時
time | 時間
zip | 郵便番号
date_ex | 日付.  [YYYY/MM/DD] or [YYYY/MM] or [YYYY]の書式でチェックする
regexp:<正規表現>[,<フラグ>[,<エラーメッセージ>]] | 正規表現.  <フラグ>,<エラーメッセージ>は省略可

### ルールの追加パラメータ書式

ルールにパラメータが必要な物は下記で定義する。

````
<ルール名>:<パラメータ1>[,<パラメータ2>[...,<パラメータn>]
````

但し、正規表現の様にパラメータ中に「,」が必要な場合は、配列のJSON形式で表記も可能

````
'regexp:'+JSON.stringify(["^[a-z\\d,-_]+?$",'g',"入力可能文字は英数字,-_です"])
````

## エラーメッセージ配列

getValidateResultメソッドの戻り値はエラーメッセージは下記構造で返す。

````javascript
[
 { name:'<フィールド名1>', d_name:'<フィールド表示名1>', message:'<エラーメッセージ>'},
                    :
 { name:'<フィールド名n>', d_name:'<フィールド表示名n>', message:'<エラーメッセージ>'},
];
````
1フィールドに複数ルールが定義されている等、複数のエラーが出た場合は同じフィールド名で複数のエラーメッセージを返す。

````javascript
[
 { name:'NAME_KANA', d_name:'名前(かな)', message:'全角ひらがなで入力してください.'},
 { name:'NAME_KANA', d_name:'名前(かな)', message:'20文字以下で入力して下さい.'},
                    :
];
````


## ライセンス

Copyright &copy; 2014 [Team-Grasshopper](http://team-grasshopper.info/)
