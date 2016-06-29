/**
 * パラメータチェックプラグイン
 * (TwitterBootstrap3.x対応)
 * v.1.5.2
 * https://github.com/tghkuma/jquery.form_validate_btfw
 */
;(function($) {
    var pluginName = 'formValidate';

    $.fn[pluginName] = function(method) {
        var defaults = {
            result: null,
            submit: 'validate',
            confirm_suffix: '_confirm',
            zip_suffix: '_after',
            fields: null,
            errorType:null,
            clearError:null,
            setError:null,
            focusError: true,
            focusErrorSpeed: 'fast',
            // メッセージ定義
            MESSAGE:{
                VALIDATE_ERROR:'入力に誤りがあります.',
                // Required
                REQUIRED:'必須項目です.',
                // input a numerical value
                NUMERICAL_VALUE:'数字を入力して下さい.'
            }
        };

        var methods = {
            init:function (options) {
                var settings = $.extend({}, defaults, options);
                return this.each(function () {
                    var $element = $(this);
                    $element.data(pluginName+".settings", settings);
                    // イベント登録処理
                    var event_names = ['submit'];
                    $.each(event_names, function(){
                        var func = settings[this];
                        if (typeof func == 'string') {
                            $element.bind(this + '.' + pluginName, function (event) {
                                return $element[pluginName](func);
                            });
                        }
                        else if ($.isFunction(func)) {
                            $element.bind(this + '.' + pluginName, func);
                        }
                    });
                });
            },

            /**
             * エラー表示処理
             * @param arrErrors
             */
            dispError:function (arrErrors) {
                var settings = $(this).data(pluginName+".settings");
                var self = this;
                $.each(arrErrors, function(i, eroor){
                    methods.setError.apply(self, [eroor.name, eroor.message]);
                });
                if (0 < arrErrors.length && settings.focusError){
                    // 最初のエラーにフォーカス
                    methods.focusError.apply(this, [arrErrors[0].name]);
                }
            },

            /**
             * 指定のエラーにフォーカス
             * @param name
             */
            focusError:function (name) {
                var settings = $(this).data(pluginName+".settings");
                var field = $(this).find("*[name='" + name + "']");
                $(field).focus();
                var p = $(field).offset().top - $(window).innerHeight()/2;
                if (p < 0){
                    p = 0;
                }
                $('html,body').animate({ scrollTop: p }, settings.focusErrorSpeed);
            },

            /**
             * エラークリア処理
             * @param name 未指定時全て
             */
            clearError:function (name) {
                var settings = $(this).data(pluginName+".settings");
                if ($.isFunction(settings.clearError)){
                    settings.clearError.apply(this, [name]);
                }
                else if (settings.errorType == 'tb2'){
                    methods.clearErrorTb2.apply(this, [name]);
                }
                else{
                    methods.clearErrorBootstrap.apply(this, [name]);
                }
            },

            /**
             * 指定箇所エラー表示処理
             * @param name
             * @param message
             */
            setError:function (name, message) {
                var settings = $(this).data(pluginName+".settings");
                if ($.isFunction(settings.setError)){
                    settings.setError.apply(this, [name, message]);
                }
                else if (settings.errorType == 'tb2'){
                    methods.setErrorTb2.apply(this, [name, message]);
                }
                else{
                    methods.setErrorBootstrap.apply(this, [name, message]);
                }
            },

            /**
             * エラークリア処理
             * (Bootstrap3レイアウト)
             * @param name 項目名(未指定時全て)
             */
            clearErrorBootstrap:function (name) {
                if (name){
                    var field = $(this).find("*[name='" + name + "']");
                    $(field).closest('.form-group')
                        .removeClass('has-error')
                        .find('.error_message').remove();
                }
                else{
                    $(this).find('.form-group')
                        .removeClass('has-error')
                        .find('.error_message').remove();
                }
            },

            /**
             * 指定箇所エラー表示処理
             * (Bootstrap3レイアウト)
             * @param name
             * @param message
             */
            setErrorBootstrap:function (name, message) {
                var field = $(this).find("*[name='" + name + "']");

                var error_message = '<span class="help-block error_message">' + message + '</span>';
                $(field).closest('.form-group').addClass('has-error');
                if (field.attr('type')!='radio' && field.attr('type')!='checkbox'){
                    var input_group = $(field).closest('.input-group');
                    if ($(input_group).length != 0){
                        $(input_group).after(error_message);
                    }
                    else{
                        $(field).filter(':last').after(error_message);
                    }
                }
                else{
                    $(field).filter(':last').parent().after(error_message);
                }
            },

            /**
             * エラークリア処理
             * (TwitterBootstrap2.xレイアウト)
             * @param name 項目名(未指定時全て)
             */
            clearErrorTb2:function (name) {
                if (name){
                    var field = $(this).find("*[name='" + name + "']");
                    $(field).closest('.control-group')
                        .removeClass('error')
                        .find('.error_message').remove();
                }
                else{
                    $(this).find('.control-group')
                        .removeClass('error')
                        .find('.error_message').remove();
                }
            },

            /**
             * 指定箇所エラー表示処理
             * (TwitterBootstrap2.xレイアウト)
             * @param name
             * @param message
             */
            setErrorTb2:function (name, message) {
                var field = $(this).find("*[name='" + name + "']");
                $(field).closest('.control-group').addClass('error');
                $(field).closest('.controls').append('<div class="help-block error_message">' + message + '</div>');
            },

            /**
             * パラメータチェック
             */
            validate:function (options) {
                var settings = $.extend($(this).data(pluginName+".settings"), options);

                methods.clearError.apply(this);
                var result = true;
                var arrErrors = methods.getValidateResult.apply(this, [settings]);
                if (0 < arrErrors.length) {
                    methods.dispError.apply(this, [arrErrors]);
                    result = false;
                }
                if ($.isFunction(settings.result)){
                    result = settings.result.apply(this, [result, arrErrors]);
                }
                return result;
            },

            /**
             * パラメータチェック
             * (エラー時アラート)
             */
            validate_alert:function (options) {
                var settings = $.extend($(this).data(pluginName+".settings"), options);

                var result = true;
                var arrErrors = methods.getValidateResult.apply(this, [settings]);
                if (0 < arrErrors.length) {
                    alert(settings.MESSAGE.VALIDATE_ERROR+'\n' + helpers.join(arrErrors));
                    if (settings.focusError){
                        // 最初のエラーにフォーカス
                        methods.focusError.apply(this, [arrErrors[0].name]);
                    }
                    result = false;
                }
                if ($.isFunction(settings.result)){
                    result = settings.result.apply(this, [result, arrErrors]);
                }
                return result;
            },

            /**
             * パラメータチェック結果取得
             */
            getValidateResult:function (options) {
                var form = this;
                var settings = $.extend($(this).data(pluginName+".settings"), options);

                var arrErrors = [];
                var fields = settings.fields;

                if (!$.isArray(fields)) {
                    return arrErrors;
                }

                $.each (fields, function(i, field){
                    if (!field.rules) {
                        return true;
                    }

                    // パラメータチェック方法
                    var arrRules = field.rules;
                    if (!$.isArray(arrRules)) {
                        arrRules = [arrRules];
                    }
                    // パラメータ値
                    var $objVal = $(form).find("*[name='" + field.name + "']");
                    // 値存在チェック
                    var bValueExists = helpers.existsValue($objVal);

                    // 各パラメータのチェック処理
                    $.each(arrRules, function(i, rule){
                        var arrRuleErrors = [];
                        var errors;
                        var params;

                        //------------------
                        // ルール分岐
                        //------------------
                        // ルールが配列
                        // [ 'ルール名', [<パラメータ配列>]]
                        if ($.isArray(rule)) {
                            if (!rule[0]){
                                return;
                            }
                            if (rule[1]){
                                params = rule[1];
                                if (!$.isArray(params)){
                                    params = [params];
                                }
                            }
                            rule = rule[0];
                        }
                        // ルールがObject
                        // { rule:'ルール名', params:[<パラメータ配列>]}
                        else if (typeof rule == 'object') {
                            if (!rule.rule){
                                return;
                            }
                            if (rule.params){
                                params = rule.params;
                                if (!$.isArray(params)){
                                    params = [params];
                                }
                            }
                            rule = rule.rule;
                        }
                        // ルールが文字列(旧仕様)
                        else if (typeof rule == 'string') {
                            // パラメータ解析処理
                            params = rule.split(':', 2);
                            if (params[0]) {
                                rule = params[0];
                            }
                            if (params[1]) {
                                try{
                                    params = JSON.parse(params[1]);
                                }
                                catch (e){
                                    params = params[1].split(',');
                                }
                                if (!$.isArray(params)){
                                    params = [params];
                                }
                            } else {
                                params = [];
                            }
                        }

                        // 独自チェック関数
                        if ($.isFunction(rule)) {
                            errors = rule.apply(form, [field, $objVal, params, settings]);
                            helpers.pushErrors(arrRuleErrors, field, errors);
                        }
                        else if (typeof rule == 'string') {
                            // 指定フィールドに値が入っているとき
                            if (bValueExists){
                                if (validateExistsMethods[rule]) {
                                    errors = validateExistsMethods[rule].apply(form, [field, $objVal, params, settings]);
                                    helpers.pushErrors(arrRuleErrors, field, errors);
                                }
                                else {
                                    //$.error( 'validateExistsMethod "' +  rule + '" does not exist in '+pluginName+' plugin!');
                                }
                            }
                            // 指定フィールドに値が入っていないとき
                            else {
                                // 必須項目チェック
                                if (rule == 'required'){
                                    helpers.pushErrors(arrRuleErrors, field, settings.MESSAGE.REQUIRED);
                                }
                                else if (validateMethods[rule]) {
                                    errors = validateMethods[rule].apply(form, [field, $objVal, params, settings]);
                                    helpers.pushErrors(arrRuleErrors, field, errors);
                                }
                                else {
                                    //$.error( 'validateMethods "' +  rule + '" does not exist in '+pluginName+' plugin!');
                                }
                            }
                        }

                        // エラー時追加
                        if (arrRuleErrors && 0 < arrRuleErrors.length) {
                            arrErrors = arrErrors.concat(arrRuleErrors);
                        }
                    });
                    return true;
                });
                return arrErrors;
            }
        };

        var validateMethods = {
            /*
             * 郵便番号の4桁部分が入力された場合
             * 3桁部が入力必須になるチェック
             */
            zip_ex:function (field, objVal, params, settings) {
                var zip_after = $(this).find("*[name='" + field.name + settings.zip_suffix + "']");
                if (objVal && helpers.getValue(objVal) && (!zip_after || !zip_after.val()))
                    return '不足しています.';
                return null;
            },

            /**
             * 年月日チェック
             * フォーム name+"_Y", name+"_M", name+"_D"のチェックを行う
             */
            ymd : function(field, objVal, params){
                // 変数宣言
                var arrErrors = [];

                // 日付オブジェクト取得
                var year = null, month = null, day = null;
                var b_year = false, b_month = false, b_day = false;
                var objY = $(this).find("*[name='"+field.name+"_Y']");
                var objM = $(this).find("*[name='"+field.name+"_M']");
                var objD = $(this).find("*[name='"+field.name+"_D']");
                if (objY && objY.val() != ""){
                    b_year = true;
                    year = objY.val();
                }
                if (objM && objM.val() != ""){
                    b_month = true;
                    month = objM.val();
                }
                if (objD && objD.val() != ""){
                    b_day = true;
                    day = objD.val();
                }

                // 日付必須チェック
                if (params[0] == 'required'){
                    if(!b_year)
                        arrErrors.push('(年) は入力必須項目です.');
                    if(!b_month)
                        arrErrors.push('(月) は入力必須項目です.');
                    if(!b_day)
                        arrErrors.push('(日) は入力必須項目です.');
                }
                else{
                    // 日付の年月日が一部のみ入力されているとき
                    if ((b_year || b_month || b_day) && !(b_year && b_month && b_day) ){
                        if(!b_year)
                            arrErrors.push('(年) が不足しています.');
                        if(!b_month)
                            arrErrors.push('(月) が不足しています.');
                        if(!b_day)
                            arrErrors.push('(日) が不足しています.');
                    }
                }
                // 年数値チェック
                if(!helpers._isInteger(year)) {
                    arrErrors.push('(年)は整数値を入力して下さい.');
                }
                // 月数値チェック
                if(!helpers._isInteger(month)) {
                    arrErrors.push('(月)は整数値を入力して下さい.');
                }
                // 日数値チェック
                if(!helpers._isInteger(day)) {
                    arrErrors.push('(日)は整数値を入力して下さい.');
                }

                // 年月日チェック
                if (arrErrors.length == 0 && !helpers._isDate(year, month, day)) {
                    arrErrors.push('日付が間違っています.');
                }

                return arrErrors;
            }
        };

        /*
        * パラメータチェック群
        *
        * @param field パラメータ名
        * @param rule チェックコマンド
        * @param objVal 値オブジェクト
        *
        * @return	string|null エラーメッセージ 文字列 or 配列
        */
        var validateExistsMethods = {
            /*
            * 確認項目
            */
            confirm : function(field, objVal, params, settings){
                var confirmVal = $(this).find("*[name='"+field.name+settings.confirm_suffix+"']");
                if(!objVal || !confirmVal || helpers.getValue(objVal) != confirmVal.val())
                    return '確認'+(field.d_name ? field.d_name:'項目')+'と異なっています.';
                return null;
            },
            /*
            * E-Mailチェック
            */
            email : function(field, objVal){
                var val = helpers.getValue(objVal);
                if (val) {
                    var email_error = helpers._isEmailEx(val);
                    if (email_error != "") {
                        return email_error;
                    }
                }
                return null;
            },
            /*
            * 全角
            */
            zenkaku : function(field, objVal){
                if (!helpers._isZenkaku(helpers.getValue(objVal))){
                    return '全角で入力してください.';
                }
                return null;
            },
            /*
            * 半角
            */
            hankaku : function(field, objVal){
                if (!helpers._isHankaku(helpers.getValue(objVal))){
                    return '半角で入力してください.';
                }
                return null;
            },
            /*
            * 全角カタカナ
            */
            zen_katakana : function(field, objVal){
                if (!helpers._isAllkana(helpers.getValue(objVal))){
                    return '全角カタカナで入力してください.';
                }
                return null;
            },
            /*
            * 全角ひらがな
            */
            hiragana : function(field, objVal){
                if (!helpers._isAllHiragana(helpers.getValue(objVal))){
                    return '全角ひらがなで入力してください.';
                }
                return null;
            },
            /*
            * 電話番号
            */
            tel : function(field, objVal){
                if (!helpers._isTel(helpers.getValue(objVal))){
                    return '数字-()で入力してください.';
                }
                return null;
            },
            /*
            * 最小文字数
            */
            minlength : function(field, objVal, params){
                var min= Number(params[0]);
                if (helpers.getValue(objVal).length<min)
                    return min+'文字以上で入力して下さい.';
                return null;
            },
            /*
            * 最大文字数
            */
            maxlength : function(field, objVal, params){
                var max= Number(params[0]);
                if (max<helpers.getValue(objVal).length)
                    return max+'文字以下で入力して下さい.';
                return null;
            },
            /*
            * 数値チェック
            */
            number : function(field, objVal, params, settings){
                var val = helpers.getValue(objVal);
                if(!$.isNumeric(val) || (val.indexOf(' ') != -1)){
                    return settings.MESSAGE.NUMERICAL_VALUE;
                }
                return null;
            },
            /*
            * 数値桁数チェック
            */
            numlength : function(field, objVal, params){
                var val = helpers.getValue(objVal);
                var reg_tmp = params[0];
                var err_message_tmp = params[0];
                if (params[1]){
                    reg_tmp += ","+params[1];
                    err_message_tmp += "～"+params[1];
                }
                var reg = new RegExp("^\\d{"+reg_tmp+"}$");
                if (!reg.test(val)){
                    return err_message_tmp+'桁の数字を入力してください.';
                }
                return null;
            },
            /*
            * 最小値
            */
            min : function(field, objVal, params){
                var val = helpers.getValue(objVal);
                if(!helpers._isInteger(val)) {
                    return '整数値を入力して下さい.';
                }
                var min= Number(params[0]);
                if (val<min)
                    return min+' ～ の数字を入力してください.';
                return null;
            },
            /*
            * 最大値
            */
            max : function(field, objVal, params){
                var val = helpers.getValue(objVal);
                if(!helpers._isInteger(val)) {
                    return '整数値を入力して下さい.';
                }
                var max= Number(params[0]);
                if (max<val)
                    return '～ '+max+' の数字を入力してください.';
                return null;
            },
            /*
            * 数値範囲
            */
            range : function(field, objVal, params){
                var val = helpers.getValue(objVal);
                if(!helpers._isInteger(val)) {
                    return '整数値を入力して下さい.';
                }
                var min= Number(params[0]);
                var max= Number(params[1]);
                if (val<min || max<val)
                    return min+' ～ '+max+' の数字を入力してください.';
                return null;
            },
            /*
            * 日付
            */
            date : function(field, objVal){
                var val = helpers.getValue(objVal);
                var reg = new RegExp("^((\\d{1,4})[/-](\\d{1,2})[/-](\\d{1,2}))$", "g");
                // 1980/1/2
                //				↓
                // 1980/1/2,1980/1/2,1980,1,2
                if(!val.match(reg)){
                    return '[YYYY/MM/DD]書式で記述してください.';
                }
                // 年月日チェック
                if(!helpers._isDate(RegExp.$2, RegExp.$3, RegExp.$4)){
                    return '日付が間違っています.';
                }
                return null;
            },
            /*
            * 日時チェック
            * [YYYY-MM-DD hh:mm:ss]または[YYYY/MM/DD]の書式でチェックする
            */
            datetime : function(field, objVal){
                var val = helpers.getValue(objVal);
                var reg = new RegExp("^((\\d{1,4})[/-](\\d{1,2})[/-](\\d{1,2}))( ((\\d{1,2}):(\\d{1,2})(:(\\d{1,2}))?))?$", "g");
                // 1980/1/2 24:12:11
                //      ↓
                // 1980/1/2 24:12:11,1980/1/2,1980,1,2, 24:12:11,24:12:11,24,12,11
                if(!val.match(reg)){
                    return '[YYYY/MM/DD hh:mm:ss]書式で記述してください.';
                }
                // 年月日チェック
                if(!helpers._isDate(RegExp.$2, RegExp.$3, RegExp.$4)){
                    return '日付が間違っています.';
                }
                if(RegExp.$6 && !helpers._isTime(RegExp.$7, RegExp.$8, RegExp.$9)){
                    return '時間が間違っています.';
                }
                return null;
            },
            /*
            * 日付チェック
            * [YYYY/MM/DD] or [YYYY/MM] or [YYYY]の書式でチェックする
            */
            date_ex : function(field, objVal){
                var val = helpers.getValue(objVal);
                var reg = new RegExp('^(\\d{1,4})([/-](\\d{1,2})([/-](\\d{1,2}))?)?$');
                // 1980/1/2
                //      ↓
                // 1980/1/2,1980/1/2,1980,1,2
                if(!val.match(reg)){
                    return '[YYYY/MM/DD] or [YYYY/MM] or [YYYY]書式で記述してください.';
                }
                // 年月日チェック
                var y = RegExp.$1;
                var m = RegExp.$3 ? RegExp.$3 : 1;
                var d = RegExp.$5 ? RegExp.$5 : 1;
                if(!helpers._isDate(y, m, d)){
                    return '日付が間違っています.';
                }
                return null;
            },
            /*
            * 時間チェック
            * [hh:mm:ss]の書式でチェックする
            */
            time : function(field, objVal, params){
                var val = helpers.getValue(objVal);
                var reg;
                if (params[0]=="hm") {
                    reg = new RegExp("^(\\d{1,2}):(\\d{1,2})$", "g");
                    if(!val.match(reg)){
                        return '[hh:mm]書式で記述してください.';
                    }
                    if(!helpers._isTime(RegExp.$1, RegExp.$2, 0)){
                        return '時間が間違っています.';
                    }
                }
                else {
                    reg = new RegExp("^(\\d{1,2}):(\\d{1,2}):(\\d{1,2})$", "g");
                    if(!val.match(reg)){
                        return '[hh:mm:ss]書式で記述してください.';
                    }
                    if(!helpers._isTime(RegExp.$1, RegExp.$2, RegExp.$3)){
                        return '時間が間違っています.';
                    }
                }
                return null;
            },
            /*
             * 郵便番号
             */
            zip : function(field, objVal){
                var val = helpers.getValue(objVal);
                var reg = new RegExp("^\\d{1,3}-\\d{1,4}$", "g");
                if(!val.match(reg)){
                    return '[nnn-nnnn]書式で記述してください.';
                }
                return null;
            },
            /*
             * チェックボックス
             */
            checkbox : function(field, objVal, params){
                var check = objVal.filter(":checked").length;
                var min= Number(params[0]);
                var max;
                if (2<=params.length){
                    max = Number(params[1]);
                    if (check<min || max<check)
                        return min+'～'+max+' 個の間でチェックしてください.';
                }
                else {
                    if (check<min)
                        return min+' 個チェックしてください.';
                }
            },

            /*
             * 正規表現チェック
             * @param string field フィールド名
             * @param object objVal 値
             * @param string|array params 正規表現パラメータ
             *        params[0]:正規表現(文字列 or 正規表現クラス)
             *        params[1]:正規表現フラグ(オプション)
             *        params[1 or 2]:エラーメッセージ(オプション)
             */
            regexp : function(field, objVal, params){
                var val = helpers.getValue(objVal);
                if(!$.isArray(params)){
                    params = [params];
                }
                var reg, err_message;
                try{
                    if (typeof params[0] == 'string'){
                        reg = new RegExp(params[0], params[1]?params[1]:undefined);
                        err_message = params[2];
                    }
                    else{
                        reg = params[0];
                        err_message = params[1];
                    }
                    if (!reg.test(val))
                        return (err_message ? err_message:'書式が間違っています.');
                }
                catch(e){
                    return '正規表現が間違っています.';
                }
                return null;
            }
        };

        var helpers = {
            /**
             * 値が存在するか？
             *
             * @param objVal 値Object
             * @returns true:存在する
             */
            existsValue : function(objVal){
                var ret;
                if (!objVal) {
                    ret = false;
                }
                else if (objVal.attr('type')=='checkbox'){
                    ret = (0<objVal.filter(":checked").length);
                }
                else{
                    ret = helpers.getValue(objVal) ? true:false;
                }
                return ret;
            },
            /**
             * 値を返す
             *
             * @param objVal 値Object
             * @returns 値
             */
            getValue : function(objVal){
                var type = objVal.attr('type');
                var val;
                if (type == 'radio'){
                    val = objVal.filter(':checked').val();
                }
                else if(type!='checkbox'){
                    val = objVal.val();
                }
                else{
                    val = [];
                    objVal.filter(':checked').each(function () {
                        val.push($(this).val());
                    });
                }
                return val;
            },
            /**
             * エラー配列付加
             *
             * @param	arrErrors	エラー情報
             * @param	field		フィールド情報
             * @param	errors		追加エラー情報
             *
             * @return	array arrErrors
             */
            pushErrors : function(arrErrors, field, errors){
                if (typeof errors == 'string' && errors) {
                    arrErrors.push({name:field.name, d_name:field.d_name, message:errors});
                }
                else if($.isArray(errors)){
                    $.each(errors, function(i, error){
                        arrErrors.push({name:field.name, d_name:field.d_name, message:error});
                    });
                }
                return arrErrors;
            },
            /**
            * 半角英数字チェック
            *
            * @param    _text	文字列
            *
            * @return	boolean true:OK, false:NG
            */
            _isHankaku : function(_text) {
                // 半角以外が存在する場合
                return !(/[^\x20-\x7E]/).test(_text);
            },

            /**
            * 全角チェック
            *
            * @param    _text	文字列
            *
            * @return	boolean true:OK, false:NG
            */
            _isZenkaku : function(_text) {
                return !(/[\w\-\.]/).test(_text);
            },

            /**
            * 電話番号チェック
            *
            * @param	inpText	文字列
            *
            * @return	boolean true:OK, false:NG
            */
            _isTel : function(inpText) {
                // 「0～9」「-」「(」「)」以外があったらエラー
                return !(/[^0-9\-\(\)]/).test(inpText);
            },

            /**
            *	整数チェック
            *
            * @param	_value	値
            *
            * @return	boolean true:OK, false:NG
            */
            _isInteger : function(_value){
                var test = /^(-\d+|\d*)$/.test(''+_value);
                return test & !isNaN(_value);
            },

            /**
            *	年月日整合性チェック
            *
            * @param	_year	年
            * @param	_month	月
            * @param	_day	日
            *
            * @return	boolean true:OK, false:NG
            */
            _isDate : function(_year, _month, _day) {
                //==========================
                // 年範囲チェック
                //==========================
                if(_year < 1900 || 9999 < _year){
                    return false;
                }
                //==========================
                // 月範囲チェック
                //==========================
                if(_month < 1 || 12 < _month){
                    return false;
                }
                //==========================
                // 日範囲チェック
                //==========================
                // 最小値
                if(_day < 1){
                    return false;
                }
                // 最大値
                var arrMaxMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
                // 2月うるう年補正
                if((_year % 4 == 0 && _year % 100 != 0) || _year % 400 == 0){
                    arrMaxMonth[1] = 29;
                }
                return !(arrMaxMonth[_month-1] < _day);
            },

            /**
            *	時分整合性チェック
            *
            * @param	_hour	時
            * @param	_minute	分
            * @param	_second	秒(null=未チェック)
            *
            * @return	boolean true:OK, false:NG
            */
            _isTime : function(_hour, _minute, _second){
                //====================
                //	時範囲チェック
                //====================
                if(_hour < 0 || 24 <= _hour){
                    return false;
                }
                //=====================
                //	分範囲チェック
                //=====================
                if(_minute < 0 || 60 <= _minute){
                    return false;
                }
                //=====================
                //	秒範囲チェック
                //=====================
                return !(_second !== null && (_second < 0 || 60 <= _second));
            },

            /**
            *	全角カタカナチェック
            *
            * @param	_inpText	文字列
            *
            * @return	boolean true:OK, false:NG
            */
            _isAllkana : function(_inpText){
                for(var i=0; i<_inpText.length; i++){
                    //if(_inpText.charAt(i) < 'ア' || _inpText.charAt(i) > 'ン'){
                    if(_inpText.charAt(i) < 'ァ' || _inpText.charAt(i) > 'ヶ'){
                        if(_inpText.charAt(i) != 'ー' && _inpText.charAt(i) != ' ' && _inpText.charAt(i) != '　'){
                            return false;
                        }
                    }
                }
                return true;
            },

            /**
            *	全角ひらがなチェック
            *
            * @param	_inpText	文字列
            *
            * @return	boolean true:OK, false:NG
            */
            _isAllHiragana : function(_inpText){
                for(var i=0; i<_inpText.length; i++){
                    if(_inpText.charAt(i) < 'ぁ' || _inpText.charAt(i) > 'ん'){
                        if(_inpText.charAt(i) != 'ー' && _inpText.charAt(i) != ' ' && _inpText.charAt(i) != '　'){
                            return false;
                        }
                    }
                }
                return true;
            },

            /**
            *	EMailチェック
            *
            * @param	_strEmail	EMAIL
            *
            * @return	string
            *           "":エラー無し
            *			""以外:エラー
            */
            _isEmailEx : function(_strEmail) {
                var emailPat=/^(.+)@(.+)$/;
                var specialChars="\\(\\)<>@,;:\\\\\\\"\\.\\[\\]";
                var validChars="[^\\s" + specialChars + "]";
            //	var quotedUser="(\"[^\"]*\")";
                var ipDomainPat=/^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/;
                var atom=validChars + '+';
            //	var word="(" + atom + "|" + quotedUser + ")";
            //	var userPat=new RegExp("^" + word + "(\\." + word + ")*$");

                var domainPat=new RegExp("^" + atom + "(\\." + atom +")*$");

                // 最初の「@」で分割
                var matchArray=_strEmail.match(emailPat);

                // 「@」がない
                if(matchArray==null) {
                    return("正しくありません(@).");
                }

                // ユーザーとドメインとして格納
            //	var user=matchArray[1];
                var domain=matchArray[2];

            // KUMA:携帯用パッチ
            /*
                // ユーザー部が無い
                if (user.match(userPat)==null) {
                    return("正しくありません(USER)."+userPat);
                }
            */
                // ドメイン名のIPパターンチェック
                var IPArray=domain.match(ipDomainPat);
                if ( IPArray != null ) {
                    for ( var i=1; i <= 4; i++ ) {
                        if ( IPArray[i] > 255 ) {
                            return("正しくありません(IP).");
                        }
                    }
                }

                // ドメイン名パターンチェック
                var domainArray=domain.match(domainPat);
                if (domainArray==null) {
                    return("ドメイン名がありません(DOMAIN).");
                }

                var atomPat=new RegExp(atom,"g");
                var domArr=domain.match(atomPat);
                var len=domArr.length;

                // 最後のドメインが2文字か3文字の以外のとき、エラー
                // ex) jp,comはOK
                if (domArr[domArr.length-1].length < 2 || 4 < domArr[domArr.length-1].length) {
                    return("正しくありません(LOCALE).");
                }

                if (len<2) {
                    return("ドメイン名の書式が誤っています.");
                }
                return "";
            },
            join : function(arrErrors, delimiter) {
                if (delimiter == undefined) delimiter = '\n';
                var arrErrorMessages = [];
                $.each(arrErrors, function(i, error){
                    if (typeof error == 'string' && error) {
                        arrErrorMessages.push(error);
                    }
                    else {
                        arrErrorMessages.push((error.d_name ? error.d_name: error.name)+' : '+error.message);
                    }
                });
                return arrErrorMessages.join(delimiter);
            }
        };

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error( 'Method "' +  method + '" does not exist in '+pluginName+' plugin!');
        }
        return true;
    }
})(jQuery);
