/**
 * @file パラメータチェックプラグイン
 * (TwitterBootstrap4.x対応)
 * @version 1.8.x
 * @see https://github.com/tghkuma/jquery.form_validate_btfw
 * @copyright {@link https://team-grasshopper.info/ Team-Grasshopper}
 */

/**
 * See (https://jquery.com/).
 * @name jQuery
 * @class
 * See the jQuery Library  (https://jquery.com/) for full details.  This just
 * documents the function and classes that are added to jQuery by this plug-in.
 */

/**
 * See (https://jquery.com/)
 * @name fn
 * @class
 * See the jQuery Library  (https://jquery.com/) for full details.  This just
 * documents the function and classes that are added to jQuery by this plug-in.
 * @memberOf jQuery
 */

/**
 * @class
 * @name jQuery
 * @namespace jQuery
 * @external jQuery
 * @exports $ as jQuery
 */
(function ($, window) {
  'use strict'

  /** @default */
  const pluginName = 'formValidate'
  const pluginSettings = pluginName + '.settings'

  /**
   * formValidate Plugin - an awesome jQuery plugin.
   *
   * @class formValidate
   * @memberOf jQuery.fn
   */
  $.fn[pluginName] = function (method) {
    let settings
    const methods = {
      /**
       * 初期化処理
       * @param {Object} options オプション
       * @returns {*}
       */
      init: function (options) {
        settings = $.extend({}, $.fn[pluginName].defaults, options)
        return this.each(function () {
          const $element = $(this)
          $element.data(pluginSettings, settings)
          // イベント登録処理
          const eventNames = ['submit']
          $.each(eventNames, function () {
            const func = settings[this]
            if (typeof func === 'string') {
              $element.on(this + '.' + pluginName, function () {
                return $element[pluginName](func)
              })
            } else if (typeof func === 'function') {
              $element.on(this + '.' + pluginName, func)
            }
          })
        })
      },
      /**
       *
       * @returns {*}
       */
      destroy: function () {
        return this.each(function () {
          const $element = $(this)
          // イベント削除処理
          const eventNames = ['submit']
          $.each(eventNames, function () {
            $element.off(this + '.' + pluginName)
          })
        })
      },
      /**
       * エラー表示処理
       * @param {Object[]} arrErrors エラー一覧
       * @param {string} arrErrors[].name フィールド名
       * @param {string} arrErrors[].message エラーメッセージ
       */
      dispError: function (arrErrors) {
        const settings = $(this).data(pluginSettings)
        const self = this
        $.each(arrErrors, function (i, error) {
          methods.setError.apply(self, [error.name, error.message])
        })
        if (arrErrors.length && settings.focusError > 0) {
          // 最初のエラーにフォーカス
          methods.focusError.apply(this, [arrErrors[0].name])
        }
      },

      /**
       * 指定のエラーにフォーカス
       * @param {string} name
       */
      focusError: function (name) {
        const settings = $(this).data(pluginSettings)
        const field = $(this).find("*[name='" + name + "']")
        let p = 0
        if (field.length !== 0) {
          $(field).trigger('focus')
          p = $(field).offset().top - $(window).innerHeight() / 2
          if (p < 0) {
            p = 0
          }
        } else {
          console.warn(helpers.format(settings.messages.NOT_EXISTS_FIELD, name))
        }
        if ($.fn.animate !== undefined) {
          $('html,body').animate({ scrollTop: p }, settings.focusErrorSpeed)
        } else {
          $('html,body').scrollTop(p)
        }
      },

      /**
       * エラークリア処理
       * @param {string} name 項目名(未指定時全て)
       */
      clearError: function (name) {
        const settings = $(this).data(pluginSettings)
        if (typeof settings.clearError === 'function') {
          settings.clearError.apply(this, [name])
        } else if (settings.errorType === 'bs3') {
          methods.clearErrorBootstrap3.apply(this, [name])
        } else if (settings.errorType === 'tb2') {
          methods.clearErrorTb2.apply(this, [name])
        } else {
          methods.clearErrorBootstrap.apply(this, [name])
        }
        return this
      },

      /**
       * 指定箇所エラー表示処理
       * @param {string} name 項目名
       * @param {string} message エラー文言
       */
      setError: function (name, message) {
        const settings = $(this).data(pluginSettings)
        if (typeof settings.setError === 'function') {
          settings.setError.apply(this, [name, message])
        } else if (settings.errorType === 'bs3') {
          methods.setErrorBootstrap3.apply(this, [name, message])
        } else if (settings.errorType === 'tb2') {
          methods.setErrorTb2.apply(this, [name, message])
        } else {
          methods.setErrorBootstrap.apply(this, [name, message])
        }
        return this
      },

      /**
       * エラークリア処理
       * (Bootstrap4レイアウト)
       * @param {string} name 項目名(未指定時全て)
       */
      clearErrorBootstrap: function (name) {
        if (name) {
          const field = $(this).find("*[name='" + name + "']")
          $(field).removeClass('is-invalid')
            .nextAll('.invalid-feedback').remove()
        } else {
          $(this).find('.is-invalid')
            .removeClass('is-invalid')
            .nextAll('.invalid-feedback').remove()
        }
        return this
      },

      /**
       * 指定箇所エラー表示処理
       * (Bootstrap4レイアウト)
       * @param {string} name 項目名
       * @param {string} message エラー文言
       */
      setErrorBootstrap: function (name, message) {
        const field = $(this).find("*[name='" + name + "']")
        const errorMessage = '<div class="invalid-feedback">' + message + '</div>'

        if (['radio', 'checkbox'].indexOf(field.attr('type')) === -1) {
          $(field).addClass('is-invalid')
          if (!$(field).parent().hasClass('input-group')) {
            $(field).filter(':last').after(errorMessage)
          } else {
            $(field).parent().append(errorMessage)
          }
        } else {
          const formCheck = $(field).addClass('is-invalid').closest('.form-check').addClass('is-invalid')
          $(formCheck).filter(':last').after(errorMessage)
        }
        return this
      },

      /**
       * エラークリア処理
       * (Bootstrap3レイアウト)
       * @param {string} name 項目名(未指定時全て)
       */
      clearErrorBootstrap3: function (name) {
        if (name) {
          const field = $(this).find("*[name='" + name + "']")
          $(field).closest('.form-group')
            .removeClass('has-error')
            .find('.errorMessage').remove()
        } else {
          $(this).find('.form-group')
            .removeClass('has-error')
            .find('.errorMessage').remove()
        }
        return this
      },

      /**
       * 指定箇所エラー表示処理
       * (Bootstrap3レイアウト)
       * @param {string} name 項目名
       * @param {string} message エラー文言
       */
      setErrorBootstrap3: function (name, message) {
        const field = $(this).find("*[name='" + name + "']")
        const errorMessage = '<span class="help-block errorMessage">' + message + '</span>'
        $(field).closest('.form-group').addClass('has-error')
        if (['radio', 'checkbox'].indexOf(field.attr('type')) === -1) {
          const inputGroup = $(field).closest('.input-group')
          if ($(inputGroup).length !== 0) {
            $(inputGroup).after(errorMessage)
          } else {
            $(field).filter(':last').after(errorMessage)
          }
        } else {
          $(field).filter(':last').parent().after(errorMessage)
        }
        return this
      },

      /**
       * エラークリア処理
       * (TwitterBootstrap2.xレイアウト)
       * @param {string} name 項目名(未指定時全て)
       */
      clearErrorTb2: function (name) {
        if (name) {
          const field = $(this).find("*[name='" + name + "']")
          $(field).closest('.control-group')
            .removeClass('error')
            .find('.errorMessage').remove()
        } else {
          $(this).find('.control-group')
            .removeClass('error')
            .find('.errorMessage').remove()
        }
        return this
      },

      /**
       * 指定箇所エラー表示処理
       * (TwitterBootstrap2.xレイアウト)
       * @param {string} name 項目名
       * @param {string} message エラー文言
       */
      setErrorTb2: function (name, message) {
        const field = $(this).find("*[name='" + name + "']")
        $(field).closest('.control-group').addClass('error')
        $(field).closest('.controls').append('<div class="help-block errorMessage">' + message + '</div>')
        return this
      },

      /**
       * パラメータチェック
       * @param {Object} options オプション
       */
      validate: function (options) {
        settings = $.extend($(this).data(pluginSettings), options)

        methods.clearError.apply(this)
        let result = true
        const arrErrors = methods.getValidateResult.apply(this, [settings])
        if (arrErrors.length > 0) {
          methods.dispError.apply(this, [arrErrors])
          result = false
        }
        if (typeof settings.result === 'function') {
          result = settings.result.apply(this, [result, arrErrors])
        }
        return result
      },

      /**
       * パラメータチェック
       * (エラー時アラート)
       * @param {Object} options オプション
       * @returns {boolean|string[]} エラー値
       */
      validate_alert: function (options) {
        settings = $.extend($(this).data(pluginSettings), options)

        let result = true
        const arrErrors = methods.getValidateResult.apply(this, [settings])
        if (arrErrors.length > 0) {
          window.alert(settings.messages.VALIDATE_ERROR + '\n' + helpers.join(arrErrors))
          if (settings.focusError) {
            // 最初のエラーにフォーカス
            methods.focusError.apply(this, [arrErrors[0].name])
          }
          result = false
        }
        if (typeof settings.result === 'function') {
          result = settings.result.apply(this, [result, arrErrors])
        }
        return result
      },

      /**
       * パラメータチェック結果取得
       * @param {Object} [options] オプションフィールド情報
       * @returns {boolean|string[]} エラー値
       */
      getValidateResult: function (options) {
        const form = this
        settings = $.extend($(this).data(pluginSettings), options)

        let arrErrors = []
        const fields = settings.fields ||
            methods.getFieldsRules.apply(this, [settings])

        // 未サポートパラメータ
        if (!Array.isArray(fields)) {
          return arrErrors
        }

        $.each(fields, function (i, field) {
          if (!field.rules) {
            return true
          }

          // パラメータチェック方法
          let arrRules = field.rules
          if (!Array.isArray(arrRules)) {
            arrRules = [arrRules]
          }
          // パラメータ値
          const $objVal = $(form).find("*[name='" + field.name + "']")
          // 値存在チェック
          const bValueExists = helpers.existsValue($objVal)

          // 各パラメータのチェック処理
          $.each(arrRules, function (i, rule) {
            const arrRuleErrors = []
            let errors
            let params

            // ------------------
            // ルール分岐
            // ------------------
            // ルールが配列
            // [ 'ルール名', [<パラメータ配列>]]
            // [ 'ルール名', <パラメータ1>, <パラメータ2>..., <パラメータn> ]
            if (Array.isArray(rule)) {
              if (rule.length === 0) {
                return
              } else if (rule.length === 2) {
                params = rule[1]
                if (!Array.isArray(params)) {
                  params = [params]
                }
              } else if (rule.length >= 3) {
                params = rule.slice(1)
              }
              rule = rule[0]
            } else if (typeof rule === 'object') {
              // ルールがObject
              // { rule:'ルール名', params:[<パラメータ配列>]}
              if (!rule.rule) {
                return
              }
              if (rule.params) {
                params = rule.params
                if (!Array.isArray(params)) {
                  params = [params]
                }
              }
              rule = rule.rule
            } else if (typeof rule === 'string') {
              // ルールが文字列(旧仕様)
              // パラメータ解析処理
              params = rule.split(':', 2)
              if (params[0]) {
                rule = params[0]
              }
              if (params[1]) {
                try {
                  params = JSON.parse(params[1])
                } catch (e) {
                  params = params[1].split(',')
                }
                if (!Array.isArray(params)) {
                  params = [params]
                }
              } else {
                params = []
              }
            }

            // 独自チェック関数
            if (typeof rule === 'function') {
              errors = rule.apply(form, [field, $objVal, params, settings])
              helpers.pushErrors(arrRuleErrors, field, errors)
            } else if (typeof rule === 'string') {
              // 指定フィールドに値が入っているとき
              if (bValueExists) {
                if (validateExistsMethods[rule]) {
                  errors = validateExistsMethods[rule].apply(form, [field, $objVal, params, settings])
                  helpers.pushErrors(arrRuleErrors, field, errors)
                }
                // else {
                //   $.error( 'validateExistsMethod "' +  rule + '" does not exist in '+pluginName+' plugin!');
                // }
              } else {
                // 指定フィールドに値が入っていないとき
                // 必須項目チェック
                if (rule === 'required') {
                  helpers.pushErrors(arrRuleErrors, field, settings.messages.REQUIRED)
                } else if (rule === 'checkbox') {
                  errors = validateExistsMethods[rule].apply(form, [field, $objVal, params, settings])
                  helpers.pushErrors(arrRuleErrors, field, errors)
                } else if (validateMethods[rule]) {
                  errors = validateMethods[rule].apply(form, [field, $objVal, params, settings])
                  helpers.pushErrors(arrRuleErrors, field, errors)
                }
                // else {
                //   $.error( 'validateMethods "' +  rule + '" does not exist in '+pluginName+' plugin!');
                // }
              }
            }

            // エラー時追加
            if (arrRuleErrors && arrRuleErrors.length > 0) {
              arrErrors = arrErrors.concat(arrRuleErrors)
            }
          })
          return true
        })
        return arrErrors
      },

      /**
       * フィールド/ルール情報取得
       * @returns {Array<Object>}
       */
      getFieldsRules: function () {
        const fields = []
        const formElements = $(this).get(0).elements
        Array.from(formElements).forEach(function (element) {
          const name = element.name
          if (!name) {
            return
          }
          const type = element.getAttribute('type')
          if (type === 'radio' || type === 'checkbox') {
            if (fields.find(item => item.name === element.name)) {
              return
            }
          }
          const rules = []
          if (element.required) {
            rules.push('required')
          }
          // 属性によるパターン
          [['minLength', 'minlength'], ['maxLength', 'maxlength'], 'min', 'max', ['pattern', 'regexp']].forEach(function (attr) {
            let rule
            if (Array.isArray(attr)) {
              rule = attr[1]
              attr = attr[0]
            } else {
              rule = attr
            }
            const value = element.getAttribute(attr)
            if (value !== null) {
              rules.push([rule, value])
            }
          })
          // type="xxx"によるバリデート判別
          let rule
          switch (type) {
            case 'date':
            case 'email':
            case 'tel':
              rule = type
              break
            case 'number':
              rule = 'numeric'
              break
            case 'time':
              rule = ['time', 'hm']
              break
          }
          if (rule) {
            rules.push(rule)
          }
          fields.push({ name: name, rules: rules })
        })
        return fields
      }
    }

    /**
     * バリデート処理群
     * @class
     */
    const validateMethods = {
      /**
       * 数値チェック(値なし)
       * @param {object} field フィールド
       * @param {jQuery} objVal 値オブジェクト
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      numeric: function (field, objVal) {
        // type="number"時の仮対策
        if (objVal[0] && objVal[0].validity && objVal[0].validity.badInput) {
          return objVal[0].validationMessage
        }
        return null
      },
      /**
       * 数値チェック(値なし,エイリアス)
       * @alias validateMethods.numeric
       * @param {object} field フィールド
       * @param {jQuery} objVal 値オブジェクト
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      number: function (field, objVal) {
        return validateMethods.numeric.apply(this, [field, objVal])
      },

      /**
       * 郵便番号の4桁部分が入力された場合
       * 3桁部が入力必須になるチェック
       * @param {Object} field フィールド名
       * @param {string} field.name フィールド物理名
       * @param {jQuery} objVal 値オブジェクト
       * @param {*} params ルールパラメータ
       * @param {Object} settings 設定情報
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      zip_ex: function (field, objVal, params, settings) {
        const zipAfter = $(this).find("*[name='" + field.name + settings.zip_suffix + "']")
        if (objVal && helpers.getValue(objVal) && (!zipAfter || !zipAfter.val())) {
          return settings.messages.INSUFFICIENT
        }
        return null
      },

      /**
       * 年月日チェック
       * フォーム name+"_y", name+"_m", name+"_d"のチェックを行う
       * @param {Object} field フィールド名
       * @param {string} field.name フィールド物理名
       * @param {jQuery} objVal 値オブジェクト
       * @param {string[]} params ルールパラメータ
       * @param {string} params.0 "required":必須チェック
       * @returns {string[]} エラー一覧(正常時空配列)
       */
      ymd: function (field, objVal, params) {
        // 変数宣言
        const arrErrors = []

        // 日付オブジェクト取得
        let year = null
        let month = null
        let day = null
        let isYear = false
        let isMonth = false
        let isDay = false
        const objY = $(this).find("*[name='" + field.name + settings.ymd_suffix_y + "']")
        const objM = $(this).find("*[name='" + field.name + settings.ymd_suffix_m + "']")
        const objD = $(this).find("*[name='" + field.name + settings.ymd_suffix_d + "']")
        if (objY && objY.val() !== '') {
          isYear = true
          year = objY.val()
        }
        if (objM && objM.val() !== '') {
          isMonth = true
          month = objM.val()
        }
        if (objD && objD.val() !== '') {
          isDay = true
          day = objD.val()
        }

        // 日付必須チェック
        if (params[0] === 'required') {
          if (!isYear) {
            arrErrors.push(helpers.format(settings.messages.REQUIRED_PART, settings.messages.DATE_PART_Y))
          }
          if (!isMonth) {
            arrErrors.push(helpers.format(settings.messages.REQUIRED_PART, settings.messages.DATE_PART_M))
          }
          if (!isDay) {
            arrErrors.push(helpers.format(settings.messages.REQUIRED_PART, settings.messages.DATE_PART_D))
          }
        } else {
          // 日付の年月日が一部のみ入力されているとき
          if ((isYear || isMonth || isDay) && !(isYear && isMonth && isDay)) {
            if (!isYear) {
              arrErrors.push(helpers.format(settings.messages.INSUFFICIENT_PART, settings.messages.DATE_PART_Y))
            }
            if (!isMonth) {
              arrErrors.push(helpers.format(settings.messages.INSUFFICIENT_PART, settings.messages.DATE_PART_M))
            }
            if (!isDay) {
              arrErrors.push(helpers.format(settings.messages.INSUFFICIENT_PART, settings.messages.DATE_PART_D))
            }
          }
        }
        // 年数値チェック
        if (isYear && !helpers._isInteger(year)) {
          arrErrors.push(helpers.format(settings.messages.INTEGER_PART, settings.messages.DATE_PART_Y))
        }
        // 月数値チェック
        if (isMonth && !helpers._isInteger(month)) {
          arrErrors.push(helpers.format(settings.messages.INTEGER_PART, settings.messages.DATE_PART_M))
        }
        // 日数値チェック
        if (isDay && !helpers._isInteger(day)) {
          arrErrors.push(helpers.format(settings.messages.INTEGER_PART, settings.messages.DATE_PART_D))
        }

        // 年月日チェック
        if (arrErrors.length === 0 && !helpers._isDate(year, month, day)) {
          arrErrors.push(helpers.format(settings.messages.DATE_INVALID))
        }

        return arrErrors
      }
    }

    /**
     * パラメータチェック群
     * @class
     */
    const validateExistsMethods = {
      /**
       * 確認項目
       * @param {Object} field フィールド名
       * @param {Object} field.name フィールド物理名
       * @param {Object} field.d_name フィールド表示名
       * @param {jQuery} objVal 値オブジェクト
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      confirm: function (field, objVal) {
        const confirmVal = $(this).find("*[name='" + field.name + settings.confirm_suffix + "']")
        if (!objVal || !confirmVal || helpers.getValue(objVal) !== confirmVal.val()) {
          return helpers.format(settings.messages.CONFIRM, (field.d_name ? field.d_name : settings.messages.CONFIRM_FIELD))
        }
        return null
      },
      /**
       * E-Mailチェック
       * @param {object} field フィールド
       * @param {jQuery} objVal 値オブジェクト
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      email: function (field, objVal) {
        const val = helpers.getValue(objVal)
        if (val) {
          const errorEmail = helpers._isEmailEx(val)
          if (errorEmail !== '') {
            return errorEmail
          }
        }
        return null
      },
      /**
       * 全角
       * @param {object} field フィールド
       * @param {jQuery} objVal 値オブジェクト
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      zenkaku: function (field, objVal) {
        if (!helpers._isZenkaku(helpers.getValue(objVal))) {
          return settings.messages.ZENKAKU
        }
        return null
      },
      /**
       * 半角
       * @param {object} field フィールド
       * @param {jQuery} objVal 値オブジェクト
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      hankaku: function (field, objVal) {
        if (!helpers._isHankaku(helpers.getValue(objVal))) {
          return settings.messages.HANKAKU
        }
        return null
      },
      /**
       * 全角カタカナ
       * @param {object} field フィールド
       * @param {jQuery} objVal 値オブジェクト
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      zen_katakana: function (field, objVal) {
        if (!helpers._isAllKana(helpers.getValue(objVal))) {
          return settings.messages.ZEN_KANA
        }
        return null
      },
      /**
       * 全角ひらがな
       * @param {object} field フィールド
       * @param {jQuery} objVal 値オブジェクト
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      hiragana: function (field, objVal) {
        if (!helpers._isAllHiragana(helpers.getValue(objVal))) {
          return settings.messages.HIRAGANA
        }
        return null
      },
      /**
       * 電話番号
       * @param {object} field フィールド
       * @param {jQuery} objVal 値オブジェクト
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      tel: function (field, objVal) {
        if (!helpers._isTel(helpers.getValue(objVal))) {
          return settings.messages.TEL
        }
        return null
      },
      /**
       * 最小文字数
       * @param {object} field フィールド
       * @param {jQuery} objVal 値オブジェクト
       * @param {Array<string|number>} params ルールパラメータ
       * @param {string|number} params.0 最小文字数
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      minlength: function (field, objVal, params) {
        const min = Number(params[0])
        if (helpers.getValue(objVal).length < min) {
          return helpers.format(settings.messages.MIN_LENGTH, min)
        }
        return null
      },
      /**
       * 最大文字数
       * @param {object} field フィールド
       * @param {jQuery} objVal 値オブジェクト
       * @param {Array<string|number>} params ルールパラメータ
       * @param {string|number} params.0 最大文字数
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      maxlength: function (field, objVal, params) {
        const max = Number(params[0])
        if (max < helpers.getValue(objVal).length) {
          return helpers.format(settings.messages.MAX_LENGTH, max)
        }
        return null
      },
      /**
       * 数値チェック
       * @param {object} field フィールド
       * @param {jQuery} objVal 値オブジェクト
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      numeric: function (field, objVal) {
        const val = helpers.getValue(objVal)
        if (!isFinite(val) || val.indexOf(' ') !== -1 || val.indexOf('0x') !== -1) {
          return settings.messages.NUMERICAL_VALUE
        }
        return null
      },
      /**
       * 数値チェック(エイリアス)
       * @alias validateExistsMethods.numeric
       * @param {object} field フィールド
       * @param {jQuery} objVal 値オブジェクト
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      number: function (field, objVal) {
        return validateExistsMethods.numeric.apply(this, [field, objVal])
      },
      /**
       * 数値桁数チェック
       * @param {object} field フィールド
       * @param {jQuery} objVal 値オブジェクト
       * @param {Array<string|number>} params ルールパラメータ
       * @param {string|number} params.0 最小桁数
       * @param {string|number} params.1 最大桁数
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      numlength: function (field, objVal, params) {
        const val = helpers.getValue(objVal)
        let tmpReg = params[0]
        let tmpErrMessage = params[0]
        if (params[1]) {
          tmpReg += ',' + params[1]
          tmpErrMessage += '～' + params[1]
        }
        const reg = new RegExp('^\\d{' + tmpReg + '}$')
        if (!reg.test(val)) {
          return helpers.format(settings.messages.NUM_LENGTH, tmpErrMessage)
        }
        return null
      },
      /**
       * 最小値
       * @param {object} field フィールド
       * @param {jQuery} objVal 値オブジェクト
       * @param {Array<string|number>} params ルールパラメータ
       * @param {string|number} params.0 最小値
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      min: function (field, objVal, params) {
        const val = helpers.getValue(objVal)
        if (!helpers._isInteger(val)) {
          return settings.messages.INTEGER
        }
        const min = Number(params[0])
        if (val < min) {
          return helpers.format(settings.messages.MIN, min)
        }
        return null
      },
      /**
       * 最大値
       * @param {object} field フィールド
       * @param {jQuery} objVal 値オブジェクト
       * @param {Array<string|number>} params ルールパラメータ
       * @param {string|number} params.0 最大値
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      max: function (field, objVal, params) {
        const val = helpers.getValue(objVal)
        if (!helpers._isInteger(val)) {
          return settings.messages.INTEGER
        }
        const max = Number(params[0])
        if (max < val) {
          return helpers.format(settings.messages.MIN, max)
        }
        return null
      },
      /**
       * 数値範囲
       * @param {object} field フィールド
       * @param {jQuery} objVal 値オブジェクト
       * @param {Array<string|number>} params ルールパラメータ
       * @param {string|number} params.0 最小値
       * @param {string|number} params.1 最大値
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      range: function (field, objVal, params) {
        const val = helpers.getValue(objVal)
        if (!helpers._isInteger(val)) {
          return settings.messages.INTEGER
        }
        const min = Number(params[0])
        const max = Number(params[1])
        if (val < min || max < val) {
          return helpers.format(settings.messages.RANGE, min, max)
        }
        return null
      },
      /**
       * 日付
       * @param {object} field フィールド
       * @param {jQuery} objVal 値オブジェクト
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      date: function (field, objVal) {
        const val = helpers.getValue(objVal)
        // 1980/1/2
        //      ↓
        // 1980/1/2,1980/1/2,1980,1,2
        if (!val.match(/^((\d{1,4})[/-](\d{1,2})[/-](\d{1,2}))$/g)) {
          return settings.messages.DATE
        }
        // 年月日チェック
        if (!helpers._isDate(RegExp.$2, RegExp.$3, RegExp.$4)) {
          return settings.messages.DATE_INVALID
        }
        return null
      },
      /**
       * 日時チェック
       * [YYYY-MM-DD hh:mm:ss]または[YYYY/MM/DD]の書式でチェックする
       * @param {object} field フィールド
       * @param {jQuery} objVal 値オブジェクト
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      datetime: function (field, objVal) {
        const val = helpers.getValue(objVal)
        // 1980/1/2 24:12:11
        //      ↓
        // 1980/1/2 23:12:11,1980/1/2,1980,1,2, 24:12:11,23:12:11,23,12,11
        if (!val.match(/^((\d{1,4})[/-](\d{1,2})[/-](\d{1,2}))( ((\d{1,2}):(\d{1,2})(:(\d{1,2}))?))?$/g)) {
          return settings.messages.DATETIME
        }
        // 年月日チェック
        if (!helpers._isDate(RegExp.$2, RegExp.$3, RegExp.$4)) {
          return settings.messages.DATE_INVALID
        }
        if (RegExp.$6 && !helpers._isTime(RegExp.$7, RegExp.$8, RegExp.$10)) {
          return settings.messages.TIME_INVALID
        }
        return null
      },
      /**
       * 日付チェック
       * [YYYY/MM/DD] or [YYYY/MM] or [YYYY]の書式でチェックする
       * @param {object} field フィールド
       * @param {jQuery} objVal 値オブジェクト
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      date_ex: function (field, objVal) {
        const val = helpers.getValue(objVal)
        // 1980/1/2
        //      ↓
        // 1980/1/2,1980/1/2,1980,1,2
        if (!val.match(/^(\d{1,4})([/-](\d{1,2})([/-](\d{1,2}))?)?$/)) {
          return settings.messages.DATE_EX
        }
        // 年月日チェック
        const y = RegExp.$1
        const m = RegExp.$3 ? RegExp.$3 : 1
        const d = RegExp.$5 ? RegExp.$5 : 1
        if (!helpers._isDate(y, m, d)) {
          return settings.messages.DATE_INVALID
        }
        return null
      },
      /**
       * 時間チェック
       * [hh:mm:ss]の書式でチェックする
       * @param {object} field フィールド
       * @param {jQuery} objVal 値オブジェクト
       * @param {string[]} params ルールパラメータ
       * @param {string} params.0 'hm':[hh:mm]の書式でチェック
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      time: function (field, objVal, params) {
        const val = helpers.getValue(objVal)
        if (params[0] === 'hm') {
          if (!val.match(/^(\d{1,2}):(\d{1,2})$/g)) {
            return settings.messages.TIME_HM
          }
          if (!helpers._isTime(RegExp.$1, RegExp.$2, 0)) {
            return settings.messages.TIME_INVALID
          }
        } else {
          if (!val.match(/^(\d{1,2}):(\d{1,2}):(\d{1,2})$/g)) {
            return settings.messages.TIME
          }
          if (!helpers._isTime(RegExp.$1, RegExp.$2, RegExp.$3)) {
            return settings.messages.TIME_INVALID
          }
        }
        return null
      },
      /**
       * 郵便番号
       * @param {object} field フィールド
       * @param {jQuery} objVal 値オブジェクト
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      zip: function (field, objVal) {
        const val = helpers.getValue(objVal)
        if (!val.match(/^\d{1,3}-\d{1,4}$/g)) {
          return settings.messages.ZIP
        }
        return null
      },
      /**
       * チェックボックス
       * @param {object} field フィールド
       * @param {jQuery} objVal 値オブジェクト
       * @param {Array<string|number>} params ルールパラメータ
       * @param {string|number} params.0 最小選択数
       * @param {string|number} params.1 最大選択数
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      checkbox: function (field, objVal, params) {
        const check = objVal.filter(':checked').length
        const min = Number(params[0])
        if (params.length >= 2) {
          const max = Number(params[1])
          if (check < min || max < check) {
            return helpers.format(settings.messages.CHECKBOX_RANGE, min, max)
          }
        } else {
          if (check < min) {
            return helpers.format(settings.messages.CHECKBOX_MIN, min)
          }
        }
      },

      /**
       * 正規表現チェック
       * @param {object} field フィールド
       * @param {jQuery} objVal 値オブジェクト
       * @param {Array<string|RegExp>} params 正規表現パラメータ
       * @param {string|RegExp} params.0 正規表現(文字列 or 正規表現クラス)
       * @param {string} params.1 正規表現フラグ(オプション)
       * @param {string} params.{1|2} エラーメッセージ(オプション)
       * @returns {string|null} エラーメッセージ(正常時null)
       */
      regexp: function (field, objVal, params) {
        const val = helpers.getValue(objVal)
        let reg, errorMessage
        if (!Array.isArray(params)) {
          params = [params]
        }
        try {
          if (typeof params[0] === 'string') {
            reg = new RegExp(params[0], params[1] ? params[1] : undefined)
            errorMessage = params[2]
          } else {
            reg = params[0]
            errorMessage = params[1]
          }
          if (!reg.test(val)) {
            return (errorMessage || settings.messages.REGEXP_INVALID_VALUE)
          }
        } catch (e) {
          return settings.messages.REGEXP_INVALID_PARAM
        }
        return null
      }
    }

    /**
     * 補助処理群
     * @class
     */
    const helpers = {
      /**
       * 値が存在するか？
       * @param {jQuery} objVal 値オブジェクト
       * @returns {boolean} true:存在する
       */
      existsValue: function (objVal) {
        let ret
        if (!objVal) {
          ret = false
        } else if (objVal.attr('type') === 'checkbox') {
          ret = (objVal.filter(':checked').length > 0)
        } else {
          ret = !!helpers.getValue(objVal)
        }
        return ret
      },
      /**
       * 値を返す
       * @param {jQuery} objVal 値オブジェクト
       * @returns {*} 値
       */
      getValue: function (objVal) {
        const type = objVal.attr('type')
        let val
        if (type === 'radio') {
          val = objVal.filter(':checked').val()
        } else if (type !== 'checkbox') {
          val = objVal.val()
        } else {
          val = []
          objVal.filter(':checked').each(function () {
            val.push($(this).val())
          })
        }
        return val
      },
      /**
       * エラー配列付加
       * @param {string[]|Object[]} arrErrors エラー情報配列
       * @param {Object} field    フィールド情報
       * @param {string|string[]} errors 追加エラー情報
       * @return {string[]|Object[]} array arrErrors
       */
      pushErrors: function (arrErrors, field, errors) {
        if (typeof errors === 'string' && errors) {
          arrErrors.push({ name: field.name, d_name: field.d_name, message: errors })
        } else if (Array.isArray(errors)) {
          $.each(errors, function (i, error) {
            arrErrors.push({ name: field.name, d_name: field.d_name, message: error })
          })
        }
        return arrErrors
      },
      /**
       * 半角英数字チェック
       * @param {string} _text  文字列
       * @return {boolean} true:OK, false:NG
       */
      _isHankaku: function (_text) {
        // 半角以外が存在する場合
        return !(/[^\x20-\x7E]/).test(_text)
      },

      /**
       * 全角チェック
       * @param {string} _text  文字列
       * @return {boolean} true:OK, false:NG
       */
      _isZenkaku: function (_text) {
        return !(/[\w\-.]/).test(_text)
      },

      /**
       * 電話番号チェック
       * @param {string} inpText  文字列
       * @return {boolean} true:OK, false:NG
       */
      _isTel: function (inpText) {
        // 「0～9」「-」「(」「)」以外があったらエラー
        return !(/[^0-9-()]/).test(inpText)
      },

      /**
       * 整数チェック
       * @param {?string} _value 値
       * @return {boolean} true:OK, false:NG
       */
      _isInteger: function (_value) {
        const test = /^(-\d+|\d*)$/.test('' + _value)
        return test && !isNaN(_value)
      },

      /**
       * 年月日整合性チェック
       * @param {?string|?number} _year  年
       * @param {?string|?number} _month 月
       * @param {?string|?number} _day 日
       * @return {boolean} true:OK, false:NG
       */
      _isDate: function (_year, _month, _day) {
        //= =========================
        // 年範囲チェック
        //= =========================
        if (_year < 1900 || _year > 9999) {
          return false
        }
        //= =========================
        // 月範囲チェック
        //= =========================
        if (_month < 1 || _month > 12) {
          return false
        }
        //= =========================
        // 日範囲チェック
        //= =========================
        // 最小値
        if (_day < 1) {
          return false
        }
        // 最大値
        const arrMaxMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        // 2月うるう年補正
        if ((_year % 4 === 0 && _year % 100 !== 0) || _year % 400 === 0) {
          arrMaxMonth[1] = 29
        }
        return !(arrMaxMonth[_month - 1] < _day)
      },

      /**
       * 時分整合性チェック
       * @param {string|number} _hour  時
       * @param {string|number} _minute  分
       * @param {?string|?number} _second  秒(null=未チェック)
       * @return {boolean} true:OK, false:NG
       */
      _isTime: function (_hour, _minute, _second) {
        // ====================
        // 時範囲チェック
        // ====================
        if (_hour < 0 || _hour >= 24) {
          return false
        }
        // =====================
        // 分範囲チェック
        // =====================
        if (_minute < 0 || _minute >= 60) {
          return false
        }
        // =====================
        // 秒範囲チェック
        // =====================
        return !(_second !== null && (_second < 0 || _second >= 60))
      },

      /**
       * 全角カタカナチェック
       * @param {string} _text  文字列
       * @return {boolean} true:OK, false:NG
       */
      _isAllKana: function (_text) {
        for (let i = 0; i < _text.length; i++) {
          // if(_text.charAt(i) < 'ア' || _text.charAt(i) > 'ン'){
          if (_text.charAt(i) < 'ァ' || _text.charAt(i) > 'ヶ') {
            if (_text.charAt(i) !== 'ー' && _text.charAt(i) !== ' ' && _text.charAt(i) !== '　') {
              return false
            }
          }
        }
        return true
      },

      /**
       * 全角ひらがなチェック
       * @param {string} _text  文字列
       * @return {boolean} true:OK, false:NG
       */
      _isAllHiragana: function (_text) {
        for (let i = 0; i < _text.length; i++) {
          if (_text.charAt(i) < 'ぁ' || _text.charAt(i) > 'ん') {
            if (_text.charAt(i) !== 'ー' && _text.charAt(i) !== ' ' && _text.charAt(i) !== '　') {
              return false
            }
          }
        }
        return true
      },

      /**
       * EMailチェック
       * @param {string} _strEmail  EMAIL
       * @return {string} '':エラー無し, ''以外:エラー
       */
      _isEmailEx: function (_strEmail) {
        const emailPat = /^(.+)@(.+)$/
        const specialChars = '\\(\\)<>@,;:\\\\"\\.\\[\\]'
        const validChars = '[^\\s' + specialChars + ']'
        // const quotedUser = '("[^"]*")';
        const ipDomainPat = /^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})]$/
        const atom = validChars + '+'
        // const word = '(' + atom + '|' + quotedUser + ')';
        // const userPat = new RegExp('^' + word + '(\.' + word + ')*$');
        const domainPat = new RegExp('^' + atom + '(\\.' + atom + ')*$')

        // 最初の「@」で分割
        const matchArray = _strEmail.match(emailPat)

        // 「@」がない
        if (matchArray === null) {
          return settings.messages.MAIL_NO_AT
        }

        // ユーザーとドメインとして格納
        // const user=matchArray[1];
        const domain = matchArray[2]

        // KUMA:携帯用パッチ
        /*
        // ユーザー部が無い
        if (user.match(userPat)==null) {
            return "正しくありません(USER)."+userPat;
        }
        */
        // ドメイン名のIPパターンチェック
        const IPArray = domain.match(ipDomainPat)
        if (IPArray !== null) {
          for (let i = 1; i <= 4; i++) {
            if (IPArray[i] > 255) {
              return settings.messages.MAIL_INVALID_IP
            }
          }
        }

        // ドメイン名パターンチェック
        const domainArray = domain.match(domainPat)
        if (domainArray === null) {
          return settings.messages.MAIL_NO_DOMAIN
        }

        const atomPat = new RegExp(atom, 'g')
        const domArr = domain.match(atomPat)
        const len = domArr.length

        // 最後のドメインが2文字か3文字の以外のとき、エラー
        // ex) jp,comはOK
        if (domArr[domArr.length - 1].length < 2 || domArr[domArr.length - 1].length > 4) {
          return settings.messages.MAIL_INVALID_LOCALE
        }

        if (len < 2) {
          return settings.messages.MAIL_INVALID_DOMAIN
        }
        return ''
      },
      format: function () {
        const args = Array.prototype.slice.call(arguments, 0)
        let message = args.shift()
        $.each(args, function (index, element) {
          message = message.replace(new RegExp('\\{' + index + '}', 'g'), element)
        })
        return message
      },
      /**
       * エラーメッセージを返す
       * @param {string[]|Object[]} arrErrors エラー情報配列
       * @param {?string} delimiter デリミタ
       * @returns {string} エラーメッセージ
       */
      join: function (arrErrors, delimiter) {
        if (delimiter === undefined) delimiter = '\n'
        const arrErrorMessages = []
        $.each(arrErrors, function (i, error) {
          if (typeof error === 'string' && error) {
            arrErrorMessages.push(error)
          } else {
            // -----------------------
            // エラー情報追加
            // error.name フィールド名
            // error.d_name フィールド表示名
            // error.message エラーメッセージ
            // -----------------------
            arrErrorMessages.push((error.d_name ? error.d_name : error.name) + ' : ' + error.message)
          }
        })
        return arrErrorMessages.join(delimiter)
      }
    }

    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1))
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments)
    } else {
      $.error('Method "' + method + '" does not exist in ' + pluginName + ' plugin!')
    }
  }
  /**
   * デフォルト設定値
   * @external:"jQuery.fn".formValidate.defaults
   */
  $.fn[pluginName].defaults = {
    submit: 'validate',
    confirm_suffix: '_confirm',
    zip_suffix: '_after',
    ymd_suffix_y: '_y',
    ymd_suffix_m: '_m',
    ymd_suffix_d: '_d',
    fields: null,
    errorType: null,
    clearError: null,
    setError: null,
    focusError: true,
    focusErrorSpeed: 'fast',
    // メッセージ定義
    messages: {
      VALIDATE_ERROR: '入力に誤りがあります.',
      // Required
      REQUIRED: '必須項目です.',
      REQUIRED_PART: '{0} は必須項目です.',
      INSUFFICIENT: '不足しています.',
      INSUFFICIENT_PART: '{0} が不足しています.',
      CONFIRM: '確認{0}と異なっています.',
      CONFIRM_FIELD: '項目',
      // input a numerical value
      NUMERICAL_VALUE: '数値を入力して下さい.',
      INTEGER: '整数値を入力して下さい.',
      INTEGER_PART: '{0} は整数値を入力して下さい.',
      MIN: '{0} ～ の数値を入力してください.',
      MAX: '～ {0} の数値を入力してください.',
      RANGE: '{0} ～ {1} の数値を入力してください.',
      MIN_LENGTH: '{0}文字以上で入力して下さい.',
      MAX_LENGTH: '{0}文字以下で入力して下さい.',
      NUM_LENGTH: '{0}桁の数値を入力してください.',
      CHECKBOX_MIN: '{0} 個チェックしてください.',
      CHECKBOX_RANGE: '{0}～{1} 個の間でチェックしてください.',
      ZENKAKU: '全角で入力してください.',
      HANKAKU: '半角で入力してください.',
      ZEN_KANA: '全角カタカナで入力してください.',
      HIRAGANA: 'ひらがなで入力してください.',
      TEL: '数値-()で入力してください.',
      ZIP: '[nnn-nnnn]書式で記述してください.',
      // 日付系
      DATE: '[YYYY/MM/DD]書式で記述してください.',
      DATE_EX: '[YYYY/MM/DD] or [YYYY/MM] or [YYYY]書式で記述してください.',
      DATETIME: '[YYYY/MM/DD hh:mm:ss]書式で記述してください.',
      TIME: '[hh:mm:ss]書式で記述してください.',
      TIME_HM: '[hh:mm:ss]書式で記述してください.',
      DATE_INVALID: '日付が間違っています.',
      TIME_INVALID: '時間が間違っています.',
      DATE_PART_Y: '(年)',
      DATE_PART_M: '(月)',
      DATE_PART_D: '(日)',
      // 正規表現系
      REGEXP_INVALID_PARAM: '正規表現が間違っています.',
      REGEXP_INVALID_VALUE: '書式が間違っています.',
      // メール系
      MAIL_NO_AT: '正しくありません(@).',
      MAIL_INVALID_IP: '正しくありません(IP).',
      MAIL_NO_DOMAIN: 'ドメイン名がありません(DOMAIN).',
      MAIL_INVALID_LOCALE: '正しくありません(LOCALE).',
      MAIL_INVALID_DOMAIN: 'ドメイン名の書式が誤っています.',
      // その他
      NOT_EXISTS_FIELD: 'フィールド名[{0}]が存在しません.'
    }
  }
})(window.jQuery, window, document)
