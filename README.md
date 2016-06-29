# JQuery Form Validate(Bootstrap3/TwitterBootstrap2.x)

## 解説
このプログラムは、Bootstrap3形式のフォーム値のValidateを行う。

## 書式

Validate定義
Submit時にValidateを行う場合。

````javascript
$("フォーム").formValidate({ <オプション>,fields:[
 { name:'<フィールド名1>'[, d_name:'<フィールド表示名1>'][, rules:<ルール or ルール配列>]},
                    :
 { name:'<フィールド名n>', d_name:'<フィールド表示名n>', rules:<ルール or ルール配列>}
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
confirm_suffix|"\_confirm" | confirmルールの確認フィールドの接尾語
zip_suffix | "\_after" |zip_exルールの4桁フィールドの接尾語
fields | null |各種フィールド定義配列
errorType| null | "tb2"=TwitterBootstrap2形式でエラーを表示
clearError | null | エラークリア関数を指定
setError| null | エラー設定関数を指定
focusError | true | true=エラー時に最初のエラーにフォーカスする<br>メソッド:validate, validate_alertで利用
focusErrorSpeed | "fast" | フォーカスのスクロール<br>(JQuery animateのduration. "slow","normal","fast"またはミリ秒)

### フィールド定義

属性名 | 機能
--- | ---
name | フィールド名.<br>input,textarea,select等のnameを指定
d_name | 表示名.通常は未使用でvalidate_alertメソッドのalert表示で使用される
rules | Validateルール.<br>1件の場合はルール文字列.複数の場合は配列で定義する

### メソッド

下記の書式でメソッドを実行できる。

````javascript
$("フォーム").formValidate('メソッド名'[,<パラメータ1>[...,<パラメータn>]);
````

メソッド名 |パラメータ| 機能
--- | --- | ---
init |オプションオブジェクト| 初期化
dispError|エラーメッセージ配列| エラー表示処理
focusError|name| nameフィールドにフォーカス
clearError|name| nameフィールドのエラークリア.未指定時全てクリア
setError|name, message| nameフィールドにmessageエラーを表示
validate|[オプションオブジェクト]| パラメータチェック<br>戻り値:true=正常, false=エラー
validate_alert|[オプションオブジェクト]| パラメータチェック<br>エラー時alert()でエラー表示
getValidateResult|[オプションオブジェクト]|パラメータチェック結果取得<br>戻り値:エラーメッセージ配列

### ルール

ルール名 | パラメータ | 機能
---|---|---
zip_ex | _なし_ |郵便番号.<br>nameとname+"\_after"の2か所をチェック
ymd | _なし_ | 年月日.<br>name+"\_Y", name+"\_M", name+"\_D"の３か所をチェック
email | _なし_ | E-Mail
tel | _なし_ |電話番号
zenkaku | _なし_ |全角
hankaku | _なし_ |半角
zen_katakana | _なし_ |全角カタカナ
hiragana | _なし_ |全角ひらがな
minlength|<数値>|最小文字数
maxlength|<数値>|最大文字数
numlength|<数値>[,<数値>]|最小文字数[最小～最大文字数]
number | _なし_ | 数値
min|<数値>|最小値
max|<数値>|最大値
checkbox|<最少選択数>[,<最大選択数>]| チェックボックスの選択チェック
radio| _なし_ |ラジオ必須チェック
range|<最小値>,<最大値>|数値範囲
date | _なし_ |日付
datetime | _なし_ |日時
time | _なし_ |時間
zip | _なし_ |郵便番号
date_ex | _なし_ |日付.<br>[YYYY/MM/DD] or [YYYY/MM] or [YYYY]の書式でチェックする
regexp|<正規表現>[,<フラグ>[,<エラーメッセージ>]]| 正規表現は文字列か正規表現リテラル(/<正規表現>/)が指定可.<br><フラグ>,<エラーメッセージ>は省略可<br>正規表現リテラルの場合,第2パラメータは<メッセージ>となる
<関数>|_関数による_|独自Validate関数を実行する

### パラメータ書式

ルールにパラメータが必要な物は配列かObjectか文字列で定義する。

#### 配列版
````
[<ルール名>,[<パラメータ1>,<パラメータ2>...,<パラメータn>]
````

#### Object版
````
{rule:<ルール名>,params:[<パラメータ1>,<パラメータ2>...,<パラメータn>}
````

#### 文字列版
````
<ルール名>:<パラメータ1>[,<パラメータ2>[...,<パラメータn>]
````

但し、正規表現の様にパラメータ中に「,」が必要な場合は、パラメータをJSON形式に変換して定義する。

````
'regexp:'+JSON.stringify(["^[a-z\\d,-_]+?$",'gi',"入力可能文字は英数字,-_です"])
````

### 独自Validate関数

下記書式で実装する

````javascript
/*
* サンプル関数
* @param string field フィールド名
* @param object objVal 値
* @param array params パラメータ配列(オプション)
*
* @return null|string Validate結果
*         null:正常
*         string:エラー
*/
function funcValidate(field, objVal, params){
    var val = objVal.val();

    if (val=='abcde')
        return '「abcde」は使用できません.');
    else if(params[0] && val==params[0])
        return '「'+params[0]+'」は使用できません.');
    return null;
}
````

## エラーメッセージ配列

getValidateResultメソッドの戻り値はエラーメッセージは下記構造で返す。

````javascript
[
 { name:'<フィールド名1>', d_name:'<フィールド表示名1>', message:'<エラーメッセージ>'},
                    :
 { name:'<フィールド名n>', d_name:'<フィールド表示名n>', message:'<エラーメッセージ>'}
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

Copyright &copy; 2014-2017 [Team-Grasshopper](http://team-grasshopper.info/)
