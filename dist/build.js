/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _lajaxModule = __webpack_require__(2);

	var _lajaxModule2 = _interopRequireDefault(_lajaxModule);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	window.Lajax = _lajaxModule2.default; /**
	                                       * lajax
	                                       * log + ajax 前端日志解决方案
	                                       * Author: Sky.Sun
	                                       * Date: 2017/08/15
	                                       */

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * lajax
	 * log + ajax 前端日志解决方案
	 * Author: Sky.Sun
	 * Date: 2017/08/15
	 */

	/**
	 * 使 Error 对象支持 JSON 序列化
	 */
	if (!('toJSON' in Error.prototype)) {
	    /* eslint-disable no-extend-native */
	    Object.defineProperty(Error.prototype, 'toJSON', {
	        value: function value() {
	            var alt = {};
	            Object.getOwnPropertyNames(this).forEach(function (key) {
	                alt[key] = this[key];
	            }, this);
	            return alt;
	        },

	        configurable: true,
	        writable: true
	    });
	    /* eslint-enable no-extend-native */
	}

	var Lajax = function () {
	    /* eslint-disable no-console, no-bitwise*/
	    function Lajax(param) {
	        _classCallCheck(this, Lajax);

	        var config = param;
	        if (typeof config === 'undefined') {
	            throw new Error('lajax初始化错误 - 构造函数的参数不能为空！');
	        }
	        if (typeof config === 'string') {
	            config = {
	                url: param
	            };
	        } else if ((typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object') {
	            if (typeof param.url !== 'string') {
	                throw new Error('lajax初始化错误 - 构造函数的参数 url 必须是一个字符串！');
	            } else if (param.logAjaxFilter != null && typeof param.logAjaxFilter !== 'function') {
	                throw new Error('lajax初始化错误 - 构造函数的参数 logAjaxFilter 必须是一个函数！');
	            } else if (param.customDesc != null && typeof param.customDesc !== 'function') {
	                throw new Error('lajax初始化错误 - 构造函数的参数 customDesc 必须是一个函数！');
	            }
	        } else {
	            throw new Error('lajax初始化错误 - 构造函数的参数格式不正确！');
	        }

	        // 服务端 url 地址
	        this.url = config.url;

	        // 是否自动记录未捕获错误
	        this.autoLogError = config.autoLogError == null ? true : config.autoLogError;

	        // 是否自动记录 Promise 错误
	        this.autoLogRejection = config.autoLogRejection == null ? true : config.autoLogRejection;

	        // 是否自动记录 ajax
	        this.autoLogAjax = config.autoLogAjax == null ? true : config.autoLogAjax;

	        // 默认的 ajax 自动记录情况过滤
	        var defaultLogAjaxFilter = function defaultLogAjaxFilter(ajaxUrl, ajaxMethod) {
	            return true;
	        };

	        // ajax 自动记录情况过滤，返回 true 代表要记录日志，false 代表不记录日志
	        this.logAjaxFilter = config.logAjaxFilter == null ? defaultLogAjaxFilter : config.logAjaxFilter;

	        // 是否要格式化 console 打印的内容
	        this.stylize = config.stylize == null ? true : config.stylize;

	        this.stylize = this.stylize && this._stylizeSupport();

	        // 是否显示描述信息
	        this.showDesc = config.showDesc == null ? true : config.showDesc;

	        // 自定义的描述信息内容
	        this.customDesc = config.customDesc;

	        // 默认的间隔发送时间（毫秒）
	        var defaultInterval = 10000;

	        // 间隔发送时间
	        this.interval = config.interval == null ? defaultInterval : config.interval;

	        // 默认的最大请求出错次数
	        var defaultMaxErrorReq = 5;

	        // 发送请求出错的最大次数，超过此次数则不再发送请求，但依然会记录请求到队列中
	        this.maxErrorReq = config.maxErrorReq == null ? defaultMaxErrorReq : config.maxErrorReq;

	        // 当前请求出错次数
	        this.errorReq = 0;

	        // 日志队列
	        this.queue = [];

	        // 发送日志请求的 xhr 对象
	        this.xhr = null;

	        // xhr 原生 open 方法
	        this.xhrOpen = XMLHttpRequest.prototype.open;

	        // xhr 原生 send 方法
	        this.xhrSend = XMLHttpRequest.prototype.send;

	        // 初始化
	        this._init();
	    }

	    /**
	     * 初始化方法
	     * 
	     * @memberof Lajax
	     */


	    _createClass(Lajax, [{
	        key: '_init',
	        value: function _init() {
	            var _this = this;

	            // 获取唯一请求id
	            this._getReqId();

	            // 加载之前未发送的历史日志
	            this._loadFromStorage();

	            // 打印描述信息
	            this._printDesc();

	            // 自动记录异常
	            this._exceptionHandler();

	            // 自动记录 ajax 请求
	            this._ajaxHandler();

	            // 绑定页面卸载事件
	            this._storageUnsendData();

	            // 定时发送日志请求
	            this.timer = setInterval(function () {
	                _this._send();
	            }, this.interval);
	        }

	        /**
	         * 获取或者生成唯一请求 id
	         * 
	         * @memberof Lajax
	         */

	    }, {
	        key: '_getReqId',
	        value: function _getReqId() {
	            this.reqId = document.querySelector('[name="_reqId"]') ? document.querySelector('[name="_reqId"]').content : '';
	            if (!this.reqId) {
	                this.reqId = window._reqId;
	            }
	            if (this.reqId) {
	                // 存在 reqId，说明这是一个服务器端生成的页面，设置一个标示
	                this.idFromServer = true;
	            } else {
	                // 如果不存在 reqId，说明这是一个纯前端的页面，就自己生成一个 reqId https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/8809472#8809472
	                var time = Date.now();
	                if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
	                    // 使用更高精度的时间
	                    time += performance.now();
	                }
	                this.reqId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
	                    var rand = (time + Math.random() * 16) % 16 | 0;
	                    time = Math.floor(time / 16);
	                    return (char === 'x' ? rand : rand & 0x3 | 0x8).toString(16);
	                });
	                this.idFromServer = false;
	            }
	        }

	        /**
	         * 默认的描述信息方法
	         * 
	         * @param {number} lastUnsend - 上次页面卸载前未发送的日志数
	         * @param {string} reqId - 请求id
	         * @param {boolean} idFromServer - 请求id是否来自服务器
	         * @returns 最终的描述信息
	         * @memberof Lajax
	         */

	    }, {
	        key: '_defaultDesc',
	        value: function _defaultDesc(lastUnsend, reqId, idFromServer) {
	            return '\uD83D\uDE80 lajax \u524D\u7AEF\u65E5\u5FD7\u6A21\u5757\u52A0\u8F7D\u5B8C\u6210\u3002\n\u81EA\u52A8\u8BB0\u5F55\u9875\u9762\u9519\u8BEF\uFF1A      ' + (this.autoLogError ? '✔' : '✘') + '\n\u81EA\u52A8\u8BB0\u5F55Promise\u5F02\u5E38\uFF1A   ' + (this.autoLogRejection ? '✔' : '✘') + '\n\u81EA\u52A8\u8BB0\u5F55Ajax\u8BF7\u6C42\uFF1A      ' + (this.autoLogAjax ? '✔' : '✘') + '\n\u5F53\u524D\u9875\u9762\u8BF7\u6C42id\uFF1A' + reqId + (idFromServer ? ' (来自服务端)' : ' (自动生成)');
	        }

	        /**
	         * 打印描述信息
	         * 
	         * @memberof Lajax
	         */

	    }, {
	        key: '_printDesc',
	        value: function _printDesc() {
	            if (console && this.showDesc) {
	                var desc = void 0;
	                if (this.customDesc) {
	                    // 自定义描述
	                    desc = this.customDesc(this.lastUnsend, this.reqId, this.idFromServer);
	                } else {
	                    // 默认描述
	                    desc = this._defaultDesc(this.lastUnsend, this.reqId, this.idFromServer);
	                }
	                if (this.stylize) {
	                    console.log('%c' + desc, 'color: ' + Lajax.colorEnum.desc + '; font-family: \u5B8B\u4F53; line-height: 1.5;');
	                } else {
	                    console.log(desc);
	                }
	            }
	        }

	        /**
	         * 是否开启了无痕模式
	         * 
	         * @returns 
	         * @memberof Lajax
	         */

	    }, {
	        key: '_isSecret',
	        value: function _isSecret() {
	            try {
	                var testKey = 'lajax-test';
	                window.localStorage.setItem(testKey, '1');
	                window.localStorage.removeItem(testKey);
	                return false;
	            } catch (error) {
	                return true;
	            }
	        }

	        /**
	         * 从 localStorage 加载之前未发送的历史日志
	         * 
	         * @memberof Lajax
	         */

	    }, {
	        key: '_loadFromStorage',
	        value: function _loadFromStorage() {
	            if (!this._isSecret()) {
	                var lastData = JSON.parse(window.localStorage.getItem('lajax'));
	                if (Array.isArray(lastData) && lastData.length) {
	                    this.lastUnsend = lastData.length;
	                    this.queue = lastData;

	                    // 立即发送一次
	                    this._send();
	                }
	                window.localStorage.removeItem('lajax');
	            }
	        }

	        /**
	         * 自动记录异常
	         * 
	         * @memberof Lajax
	         */

	    }, {
	        key: '_exceptionHandler',
	        value: function _exceptionHandler() {
	            var _this2 = this;

	            // 页面未捕获异常
	            if (this.autoLogError) {
	                window.addEventListener('error', function (err) {
	                    _this2.error('[OnError]', err.message, '(' + err.lineno + '\u884C' + err.colno + '\u5217)');
	                });
	            }

	            // Promise 未捕获异常
	            if (this.autoLogRejection) {
	                window.addEventListener('unhandledrejection', function (err) {
	                    _this2.error('[OnRejection]', err.reason);
	                });
	            }
	        }

	        /**
	         * 是否支持格式化 console 打印的内容
	         * 只有 Chrome 和 firefox 浏览器开启
	         * 
	         * @memberof Lajax
	         */

	    }, {
	        key: '_stylizeSupport',
	        value: function _stylizeSupport() {
	            var isChrome = !!window.chrome;
	            var isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;
	            return isChrome || isFirefox;
	        }

	        /**
	         * 解析 url
	         * 
	         * @param {string} url
	         * @returns 
	         * @memberof Lajax
	         */

	    }, {
	        key: '_resolveUrl',
	        value: function _resolveUrl(url) {
	            var link = document.createElement('a');
	            link.href = url;
	            return link.protocol + '//' + link.host + link.pathname + link.search + link.hash;
	        }

	        /**
	         * 自动记录 ajax 请求
	         * 
	         * @memberof Lajax
	         */

	    }, {
	        key: '_ajaxHandler',
	        value: function _ajaxHandler() {
	            if (this.autoLogAjax) {
	                var that = this;

	                // 重写 open 方法
	                XMLHttpRequest.prototype.open = function () {
	                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	                        args[_key] = arguments[_key];
	                    }

	                    this._lajaxMethod = args[0];
	                    this._lajaxUrl = that._resolveUrl(args[1]);
	                    that.xhrOpen.apply(this, args);
	                };

	                // 重写 send 方法
	                XMLHttpRequest.prototype.send = function (data) {
	                    // 请求开始时间
	                    var startTime = new Date();

	                    // 排除掉用户自定义不需要记录日志的 ajax
	                    if (that.logAjaxFilter(this._lajaxUrl, this._lajaxMethod)) {
	                        // 添加一条日志到队列中
	                        that._pushToQueue(startTime, Lajax.levelEnum.info, '[ajax] \u53D1\u9001' + this._lajaxMethod.toLowerCase() + '\u8BF7\u6C42\uFF1A' + this._lajaxUrl);

	                        // 请求头中添加请求 id
	                        this.setRequestHeader('X-Request-Id', that.reqId);
	                    }

	                    // 添加 readystatechange 事件
	                    this.addEventListener('readystatechange', function () {
	                        // 排除掉用户自定义不需要记录日志的 ajax
	                        if (that.logAjaxFilter(this._lajaxUrl, this._lajaxMethod)) {
	                            try {
	                                if (this.readyState === XMLHttpRequest.DONE) {
	                                    // 这里将发送接口请求的日志打印到控制台和添加到队列分开执行
	                                    if (console && console.group && that.stylize) {
	                                        console.group('%cajax请求', 'color: ' + Lajax.colorEnum.ajaxGroup + ';');
	                                    }
	                                    that._printConsole(startTime, Lajax.levelEnum.info, '[ajax] \u53D1\u9001' + this._lajaxMethod.toLowerCase() + '\u8BF7\u6C42\uFF1A' + this._lajaxUrl);

	                                    // 请求结束时间
	                                    var endTime = new Date();

	                                    // 请求耗时
	                                    var costTime = (endTime - startTime) / 1000;

	                                    var msgs = [];
	                                    if (this.status >= 200 && this.status < 400) {
	                                        msgs.push('接口请求成功。');
	                                    } else {
	                                        msgs.push('接口请求失败！');
	                                    }
	                                    msgs.push('\u8BF7\u6C42\u8017\u65F6\uFF1A' + costTime + 's URL\uFF1A' + this._lajaxUrl + ' \u8BF7\u6C42\u65B9\u5F0F\uFF1A' + this._lajaxMethod);
	                                    if (this._lajaxMethod.toLowerCase() === 'post') {
	                                        msgs.push('表单数据：', JSON.parse(data));
	                                    }
	                                    msgs.push('\u72B6\u6001\u7801\uFF1A' + this.status);
	                                    if (this.status >= 200 && this.status < 400) {
	                                        that.info.apply(that, ['[ajax]'].concat(msgs));
	                                    } else {
	                                        that.error.apply(that, ['[ajax]'].concat(msgs));
	                                    }

	                                    if (console && console.group) {
	                                        console.groupEnd();
	                                    }
	                                }
	                            } catch (err) {
	                                var _msgs = [];
	                                _msgs.push('接口请求出错！');
	                                _msgs.push('URL\uFF1A' + this._lajaxUrl + ' \u8BF7\u6C42\u65B9\u5F0F\uFF1A' + this._lajaxMethod);
	                                if (this._lajaxMethod.toLowerCase() === 'post') {
	                                    _msgs.push('表单数据：', JSON.parse(data));
	                                }
	                                _msgs.push('\u72B6\u6001\u7801\uFF1A' + this.status);
	                                _msgs.push('ERROR\uFF1A' + err);
	                                that.error.apply(that, ['[ajax]'].concat(_msgs));
	                            }
	                        }
	                    });

	                    // 排除掉自身发送日志的 ajax 和用户自定义不需要记录日志的 ajax
	                    // if (this._lajaxUrl !== that.url && that.logAjaxFilter(this._lajaxUrl, this._lajaxMethod)) {
	                    //     const waiter = setInterval(() => {
	                    //         try {
	                    //             if (this.readyState === XMLHttpRequest.DONE) {
	                    //                 // 请求结束时间
	                    //                 const endTime = Date.now();

	                    //                 // 请求耗时
	                    //                 const costTime = (endTime - startTime) / 1000;

	                    //                 const msgs = [];
	                    //                 if (this.status >= 200 && this.status < 400) {
	                    //                     msgs.push('接口请求成功。');
	                    //                 } else {
	                    //                     msgs.push('接口请求失败！');
	                    //                 }
	                    //                 msgs.push(`请求耗时：${costTime}s URL：${this._lajaxUrl} 请求方式：${this._lajaxMethod}`);
	                    //                 if (this._lajaxMethod.toLowerCase() === 'post') {
	                    //                     msgs.push('表单数据：', JSON.parse(data));
	                    //                 }
	                    //                 msgs.push(`状态码：${this.status}`);
	                    //                 if (this.status >= 200 && this.status < 400) {
	                    //                     that.info('[ajax]', ...msgs);
	                    //                 } else {
	                    //                     that.error('[ajax]', ...msgs);
	                    //                 }
	                    //             }
	                    //         } catch (err) {
	                    //             const msgs = [];
	                    //             msgs.push('接口请求出错！');
	                    //             msgs.push(`URL：${this._lajaxUrl} 请求方式：${this._lajaxMethod}`);
	                    //             if (this._lajaxMethod.toLowerCase() === 'post') {
	                    //                 msgs.push('表单数据：', JSON.parse(data));
	                    //             }
	                    //             msgs.push(`状态码：${this.status}`);
	                    //             msgs.push(`ERROR：${err}`);
	                    //             that.error('[ajax]', ...msgs);
	                    //         } finally {
	                    //             clearInterval(waiter);
	                    //         }
	                    //     }, 50);
	                    // }

	                    that.xhrSend.call(this, data);
	                };
	            }
	        }

	        /**
	         * 页面卸载前检查是否还有未发送的日志
	         * 
	         * @memberof Lajax
	         */

	    }, {
	        key: '_storageUnsendData',
	        value: function _storageUnsendData() {
	            var _this3 = this;

	            window.onunload = function () {
	                // 处理未发送的数据
	                if (_this3.queue.length) {
	                    if (navigator.sendBeacon && navigator.sendBeacon(_this3.url, JSON.stringify(_this3.queue))) {
	                        // 如果客户端支持sendBeacon，且预计能够成功发送数据，则清空队列
	                        _this3.queue = [];
	                    } else if (!_this3._isSecret()) {
	                        // 不支持sendBeacon，且不是无痕模式，则存入localStorage，下次进入页面时会自动发送一次日志
	                        window.localStorage.setItem('lajax', JSON.stringify(_this3.queue));
	                    } else {
	                        // 是无痕模式，只能尝试发送日志，成不成功就看造化了
	                        _this3._send();
	                    }
	                }
	            };
	        }

	        /**
	         * 发送日志请求
	         * 
	         * @memberof Lajax
	         */

	    }, {
	        key: '_send',
	        value: function _send() {
	            var _this4 = this;

	            var logCount = this.queue.length;
	            if (logCount) {
	                // 如果存在 this.xhr，说明上一次的请求还没有结束，就又准备发送新的请求了，则直接终止上次请求
	                if (this.xhr) {
	                    // 这里必须将上次的回调设为null，否则会打印出请求失败
	                    this.xhr.onreadystatechange = null;
	                    this.xhr.abort();
	                }
	                this.xhr = new XMLHttpRequest();
	                this.xhrOpen.call(this.xhr, 'POST', this.url, true);
	                this.xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	                this.xhrSend.call(this.xhr, JSON.stringify(this.queue));
	                this.xhr.onreadystatechange = function () {
	                    if (_this4.xhr.readyState === XMLHttpRequest.DONE) {
	                        if (_this4.xhr.status >= 200 && _this4.xhr.status < 400) {
	                            // 日志发送成功，从队列中去除已发送的
	                            _this4.queue.splice(0, logCount);

	                            // 重置请求出错次数
	                            _this4.errorReq = 0;

	                            // 显示日志发送成功
	                            if (console) {
	                                if (_this4.stylize) {
	                                    console.log('%c[' + _this4._getTimeString(null) + '] - ' + logCount + '\u6761\u65E5\u5FD7\u53D1\u9001\u6210\u529F\uFF01', 'color: ' + Lajax.colorEnum.sendSuccess);
	                                } else {
	                                    console.log(logCount + '\u6761\u65E5\u5FD7\u53D1\u9001\u6210\u529F\uFF01');
	                                }
	                            }
	                        } else {
	                            _this4._printConsole(null, Lajax.levelEnum.error, '\u53D1\u9001\u65E5\u5FD7\u8BF7\u6C42\u5931\u8D25\uFF01\u914D\u7F6E\u7684\u63A5\u53E3\u5730\u5740\uFF1A' + _this4.url + ' \u72B6\u6001\u7801\uFF1A' + _this4.xhr.status);
	                            _this4._checkErrorReq();
	                        }
	                        _this4.xhr = null;
	                    }
	                };
	            }
	        }

	        /**
	         * 检查请求出错次数
	         * 
	         * @memberof Lajax
	         */

	    }, {
	        key: '_checkErrorReq',
	        value: function _checkErrorReq() {
	            // 将出错次数 +1
	            this.errorReq++;

	            // 超过最大次数则认为服务器不可用，停止定时器
	            if (this.errorReq >= this.maxErrorReq) {
	                clearInterval(this.timer);
	                this._printConsole(null, Lajax.levelEnum.warn, '\u53D1\u9001\u65E5\u5FD7\u8BF7\u6C42\u7684\u8FDE\u7EED\u5931\u8D25\u6B21\u6570\u8FC7\u591A\uFF0C\u5DF2\u505C\u6B62\u53D1\u9001\u65E5\u5FD7\u3002\u8BF7\u68C0\u67E5\u65E5\u5FD7\u63A5\u53E3 ' + this.url + ' \u662F\u5426\u6B63\u5E38\uFF01');
	            }
	        }

	        /**
	         * 获取时间字符串
	         * 
	         * @param {Date} time - 记录时间 
	         * @returns 
	         * @memberof Lajax
	         */

	    }, {
	        key: '_getTimeString',
	        value: function _getTimeString(time) {
	            var now = time === null ? new Date() : time;

	            // 时
	            var hour = String(now.getHours());
	            if (hour.length === 1) {
	                hour = '0' + hour;
	            }

	            // 分
	            var minute = String(now.getMinutes());
	            if (minute.length === 1) {
	                minute = '0' + minute;
	            }

	            // 秒
	            var second = String(now.getSeconds());
	            if (second.length === 1) {
	                second = '0' + second;
	            }

	            // 毫秒
	            var millisecond = String(now.getMilliseconds());
	            if (millisecond.length === 1) {
	                millisecond = '00' + millisecond;
	            } else if (millisecond.length === 2) {
	                millisecond = '0' + millisecond;
	            }

	            return hour + ':' + minute + ':' + second + '.' + millisecond;
	        }

	        /**
	         * 获取日期时间字符串
	         * 
	         * @param {Date} time - 记录时间
	         * @returns 
	         * @memberof Lajax
	         */

	    }, {
	        key: '_getDateTimeString',
	        value: function _getDateTimeString(time) {
	            var now = time === null ? new Date() : time;

	            // 年
	            var year = String(now.getFullYear());

	            // 月
	            var month = String(now.getMonth() + 1);
	            if (month.length === 1) {
	                month = '0' + month;
	            }

	            // 日
	            var day = String(now.getDate());
	            if (day.length === 1) {
	                day = '0' + day;
	            }

	            return year + '-' + month + '-' + day + ' ' + this._getTimeString(now);
	        }

	        /**
	         * 调用系统 console 打印日志
	         * 
	         * @param {any} time 
	         * @param {any} level 
	         * @param {any} args 
	         * @memberof Lajax
	         */

	    }, {
	        key: '_printConsole',
	        value: function _printConsole(time, level) {
	            if (console) {
	                for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	                    args[_key2 - 2] = arguments[_key2];
	                }

	                if (this.stylize) {
	                    var _console;

	                    (_console = console)[level].apply(_console, ['%c[' + this._getTimeString(time) + '] [' + level.toUpperCase() + '] -', 'color: ' + Lajax.colorEnum[level]].concat(args));
	                } else {
	                    var _console2;

	                    (_console2 = console)[level].apply(_console2, args);
	                }
	            }
	        }

	        /**
	         * 将日志添加到队列中
	         * 
	         * @param {any} time 
	         * @param {any} level 
	         * @param {any} args 
	         * @memberof Lajax
	         */

	    }, {
	        key: '_pushToQueue',
	        value: function _pushToQueue(time, level) {
	            for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
	                args[_key3 - 2] = arguments[_key3];
	            }

	            args.unshift('{' + this.reqId + '}');
	            this.queue.push({
	                time: this._getDateTimeString(time),
	                level: level,
	                messages: args,
	                url: window.location.href,
	                agent: navigator.userAgent
	            });
	        }

	        /**
	         * 将日志打印到控制台并添加到队列
	         * 
	         * @param {Date} time - 记录时间
	         * @param {Lajax.levelEnum} level - 日志级别
	         * @param {any} args - 日志内容
	         * @memberof Lajax
	         */

	    }, {
	        key: '_log',
	        value: function _log(time, level) {
	            for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
	                args[_key4 - 2] = arguments[_key4];
	            }

	            // 调用系统 console 打印日志
	            this._printConsole.apply(this, [time, level].concat(args));

	            // 将日志添加到队列中
	            this._pushToQueue.apply(this, [time, level].concat(args));
	        }

	        /**
	         * 记录一条信息日志
	         * 
	         * @param {any} args - 日志内容
	         * @memberof Lajax
	         */

	    }, {
	        key: 'info',
	        value: function info() {
	            for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
	                args[_key5] = arguments[_key5];
	            }

	            this._log.apply(this, [null, Lajax.levelEnum.info].concat(args));
	        }

	        /**
	         * 记录一条普通日志
	         * info 方法的别名
	         * 
	         * @param {any} args 
	         * @memberof Lajax
	         */

	    }, {
	        key: 'log',
	        value: function log() {
	            this.info.apply(this, arguments);
	        }

	        /**
	         * 记录一条警告日志
	         * 
	         * @param {any} args - 日志内容
	         * @memberof Lajax
	         */

	    }, {
	        key: 'warn',
	        value: function warn() {
	            for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
	                args[_key6] = arguments[_key6];
	            }

	            this._log.apply(this, [null, Lajax.levelEnum.warn].concat(args));
	        }

	        /**
	         * 记录一条错误日志
	         * 
	         * @param {any} args - 日志内容
	         * @memberof Lajax
	         */

	    }, {
	        key: 'error',
	        value: function error() {
	            for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
	                args[_key7] = arguments[_key7];
	            }

	            this._log.apply(this, [null, Lajax.levelEnum.error].concat(args));
	        }
	        /* eslint-enable no-console, no-bitwise*/

	    }]);

	    return Lajax;
	}();

	/**
	 * 日志级别枚举
	 */


	Lajax.levelEnum = {
	    /**
	     * 信息
	     */
	    info: 'info',

	    /**
	     * 警告
	     */
	    warn: 'warn',

	    /**
	     * 错误
	     */
	    error: 'error'
	};

	/**
	 * 日志颜色枚举
	 */
	Lajax.colorEnum = {
	    /**
	     * 信息日志颜色，默认宝蓝色
	     */
	    info: 'DodgerBlue',

	    /**
	     * 警告日志颜色，默认橘黄色
	     */
	    warn: 'orange',

	    /**
	     * 错误日志颜色，默认红色
	     */
	    error: 'red',

	    /**
	     * ajax分组颜色，默认紫色
	     */
	    ajaxGroup: '#800080',

	    /**
	     * 日志发送成功颜色，默认绿色
	     */
	    sendSuccess: 'green',

	    /**
	     * 描述文字颜色，默认粉红色
	     */
	    desc: '#d30775'
	};

	exports.default = Lajax;

/***/ })
/******/ ]);