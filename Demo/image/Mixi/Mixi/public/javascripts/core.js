/**
 * @author ZhangYi
 */


//充值中心命名空间
if(typeof FWK == 'undefined') {
	FWK = {};
}

FWK.UA = function() {
	var ua = navigator.userAgent,
		m,
		o = {
			webkit : 0,
			chrome : 0,
			safari : 0,
			gecko : 0,
			firefox : 0,
			ie : 0,
			opera : 0,
			mobile : '',
			isStrict : document.compatMode == "CSS1Compat"
		},
		numberify = function(s) {
			var c = 0;
			// convert '1.2.3.4' to 1.234
            return parseFloat(s.replace(/\./g, function() {
                return (c++ === 0) ? '.' : '';
            }));
		};
	
		if((m = ua.match(/AppleWebKit\/([\d.]*)/)) && m[1]) {//WebKit
			o.webkit = numberify(m[1]);
			
			
			if((m = ua.match(/Chrome\/([\d.]*)/)) && m[1]) {//Chrome
				o.chrome = numberify(m[1]);
			} else if((m = ua.match(/\/([\d.]*) Safari/)) && m[1]) { // Safari
				o.safari = numberify(m[1]);
			}
			
			if(/ Mobile\//.test(ua)) {// Apple Mobile
				o.mobile = 'Apple'; // iPad, iPhone or iPod Touch
			} else if((m = ua.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/))) {
				 o.mobile = m[0]; // Nokia N-series, Android, webOS, ex: NokiaN95
			}
		} else {//Not WebKit
			
			if((m = ua.match(/Opera\/.* Version\/([\d.]*)/)) && m[1]) {//Opera
				o.opera = numberify(m[1]);
				
				if((ua.match(/Opera Mini[^;]*/))) {
					o.mobile = m[0]; // ex: Opera Mini/2.0.4509/1316
				}
			} else {//Not WebKit、Opera
				
				//MSIE
				if((m = ua.match(/MSIE\s([^;]*)/)) && m[1]) {
					o.ie = numberify(m[1]);
				} else {//Not WebKit、Opera、MSIE
					//Gecko
					if((m = ua.match(/Gecko/))) {
						o.gecko = 1; // Gecko detected, look for revision
						
						if((m = ua.match(/rv:([\d.]*)/)) && m[1]) {
							 o.gecko = numberify(m[1]);
						}
						
						//Firefox
						if ((m = ua.match(/Firefox\/([\d.]*)/)) && m[1]) {
	                        o.firefox = numberify(m[1]);
	                    }
						
					}
				}
			}
		}
		
	return o;
}();

if(FWK.UA.ie && FWK.UA.ie < 7) {//背景图片不缓存bug
	try { document.execCommand("BackgroundImageCache",false,true);} catch(ex) {}
}

FWK.emptyFn = function() {};

FWK.$ = function() {
	return typeof arguments[0] === 'string' ? document.getElementById(arguments[0]) : arguments[0]; 
}

/**
 * 对对象追加属性
 * @param {Object} destination 目标对象
 * @param {Object} source 需要追加的对象属性
 * @param {Boolean} notOverWrite  不覆写，默认直接覆写
 */
FWK.extend = function(destination, source, notOverWrite) {
	 for (var property in source) {
	 	if (source.hasOwnProperty(property) && (!notOverWrite || !(property in destination))) {
			destination[property] = source[property];
		}
	  }
	  return destination;
}

FWK.getParam = function(paraName, url) {
	url = url || document.location.search;
	var	reg = new RegExp("[?&]+"+paraName+"=([^&]+)");
	
	return url && reg.test(url) ? RegExp['$1'] : null;
}


FWK.Cookie = {
	/**
	 * 设置一个cookie
	 * @param {String} name cookie名称
	 * @param {String} value cookie值
	 * @param {String} domain 所在域名
	 * @param {String} path 所在路径
	 * @param {Number} hour 存活时间，单位:小时
	 * @return {Boolean} 是否成功
	 * @example 
	 *  FWK.Cookie.set('name1',"value1",".9917.com","/text", 24); //设置cookie 
	 */
	set : function(name, value, domain, path, hour) {
		if (hour) {
			var today = new Date();
			var expire = new Date();
			expire.setTime(today.getTime() + 1000*60*60 * hour);
		}
		
		path = path ? path : "/";
		domain = domain ? domain : ".mixi.com";
		
		document.cookie = name + "=" + value + "; " + (hour ? ("expires=" + expire.toGMTString() + "; ") : "") + "path=" + path + "; domain=" + domain; 
		return true;
	},
	/**
	 * 删除指定的Cookie
	 * 
	 * @param {String} name cookie名称
	 * @param {String} domain 所在域
	 * @param {String} path 所在路径
	 */
	del : function(name, domain, path) {
		path = path ? path : "/";
		domain = domain ? domain : ".9917.com";
		
		document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; path=" + path + "; domain=" + domain + ";";
	}
}

FWK.getCookie = function(key) {
	if(!navigator.cookieEnabled) {//判定浏览器是否支持cookie
		return null;
	}
	
	if(typeof key === "string") {
		var reg = new RegExp("(?:; )?"+key+"=([^;]*)");
		if(reg.test(document.cookie)) {
			return RegExp["$1"];
		}
	}
	
	return null;
}

FWK.getLoginInfo = function() {
	var cuid = FWK.getCookie('CUID'), pic = FWK.getCookie('PIC');
		
	if(!cuid && !pic) {
		return null;
	}
	
	if(!cuid && /^\w+_(.*)$/.test(pic)) {
		cuid = RegExp['$1'];
	}
	var arr = cuid.split("-");
	arr[1] = unescape(arr[1]);//昵称进行解码
	
	return arr;	
}

FWK.userHandler = {
	PathParse : function(resId, ResPath) {
		var userRootStr = "", LevelNum = 4, PerNum = 500, ResPath = (ResPath === undefined) ? "" : ResPath;
		
		var gene = 1;
		for (var i = 1; i < LevelNum; i++) {
			gene *= PerNum;
		}
		var tempUserID = parseInt(resId);
		for (var i = 0; i < LevelNum; i++) {
			if (LevelNum != i + 1) {
				var temp = Math.floor(tempUserID / gene);
				tempUserID = tempUserID % gene;
				userRootStr += temp + "/";
				gene /= PerNum;
			} else {
				userRootStr += resId;
			}
		}
		return ResPath + userRootStr;
	},
	getHome : function(uId) {
		return 'http://home.9917.com/' + uId;
	},
	getHeadPic : function(uId, type) {
		return this.PathParse(uId, "http://prof.9917.com/user/")+"/_"+type+".jpg";
	}
}

FWK.trim = function(str) {
	return (str || "").replace(/(^[\s\t\xa0\u3000]+)|([\u3000\xa0\s\t]+$)/g, "");
}

FWK.byteLength = function(str) {
	return (str || "").replace(/[^\x00-\xFF]/g, "**").length;
}

String.prototype.uniLeft = function(len) {
	var uniLen = FWK.byteLength(this);
	if(uniLen<=len) 
		return this.substr(0);
	for(var i=Math.floor((len=len-2)/2),l=uniLen; i<l; i++)
		if(FWK.byteLength(this.substr(0,i)) >= len)
			return this.substr(0,i) +"\u2026";
	return this.substr(0);
}


FWK.Template = function(str, symbol) {
	return new arguments.callee.init(str, symbol);
}
FWK.Template.init = function(str, symbol) {
	this.sourceStr = str.join ? str.join("") : str.toString();
	this.symbol = symbol || "$";
}
FWK.Template.init.prototype = {
	toString : function() {
		return this.sourceStr;
	},
	replace : function(data) {
		if (data) {
			return this.parse(data);
		} else {
			return this.toString();
		}
	},
	parse : function(data) {
		
		if (!this.sourceArr) {
			this.sourceArr = this.sourceStr.split(this.symbol);
			this.contentArr = this.sourceArr.concat();
		}
		
		var a = this.sourceArr, b = this.contentArr;
		
		for (var i = 1, len = a.length; i < len; i += 2) {
			b[i] = data[a[i]];
		}
		
		return b.join("");
	}
};




FWK.getFrameWindow = function(fId) {
	var frameElem = FWK.$(fId);
	
	return frameElem ? frameElem.contentWindow : null;
}

FWK.getClientHeight = function() {
	return document.compatMode == "CSS1Compat" ? document.documentElement.clientHeight : document.body.clientHeight;
}

FWK.getClientWidth = function() {
	return document.compatMode == "CSS1Compat" ? document.documentElement.clientWidth : document.body.clientWidth;
}

FWK.getScrollLeft = function() {
	return Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
}

FWK.getScrollTop = function() {
	return  Math.max(document.documentElement.scrollTop, document.body.scrollTop);
}

FWK.getScrollHeight = function() {
	return Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
}

FWK.getXY = function(el, doc) {
	 var _t = 0, _l = 0, _doc = doc || document;
		 
	if (el) {
		if (_doc.documentElement.getBoundingClientRect && el.getBoundingClientRect) { // IE、firefox3、chrome2、chrome2、opera9.63支持
			
			var box = el.getBoundingClientRect(), 
				oDoc = el.ownerDocument, 
				_fix = FWK.UA.ie ? 2 : 0; // 修正ie和firefox之间的2像素差异

			_t = box.top - _fix + FWK.getScrollTop();
			_l = box.left - _fix + FWK.getScrollLeft();
		} else {// 这里只有safari执行
			while (el.offsetParent) {
				_t += el.offsetTop;
				_l += el.offsetLeft;
				el = el.offsetParent;
			}
		}
	}
	
	return [_l, _t];
}

FWK.setXY = function(el, x, y) {
	el = FWK.$(el);
		
	var _ml = parseInt(el.style.marginLeft, 10) || 0;
	var _mt = parseInt(el.style.marginTop, 10) || 0;
	
	el.style.left = parseInt(x, 10) - _ml + "px";
	el.style.top = parseInt(y, 10) - _mt + "px";
}








FWK.event = {
	KEYS : {
		BACKSPACE : 8,
		TAB : 9,
		RETURN : 13,
		ESC : 27,
		SPACE : 32,
		LEFT : 37,
		UP : 38,
		RIGHT : 39,
		DOWN : 40,
		DELETE : 46
	},
	extendType : /(click|mousedown|mouseover|mouseout|mouseup|mousemove|scroll|contextmenu|resize)/i,
	_eventListDictionary : {},
	_fnSeqUID : 0,
	_objSeqUID : 0,
	/**
	 * 事件绑定
	 * 
	 * @param {HTMLElement} obj 需要添加事件的DOM对象
	 * @param {String} eventType 需要添加的事件
	 * @param {Function} fn 事件需要绑定到的处理函数
	 * @param {Array} argArray 参数数组
	 * @type Boolean
	 * @return 是否绑定成功(true为成功，false为失败)
	 * @example FWK.event.addEvent(FWK.dom.get('demo'),'click',hello);
	 */
	addEvent : function(obj, eventType, fn, argArray) {
		
		eventType = (eventType || "").replace(/^on/, "");
		
		var cfn = null, res = false, evtList = null;

		if (!obj) {
			return res;
		}
		
		if (!obj.handleId) {//在DOM上绑定唯一标识:handleId
			obj.handleId = (++FWK.event._objSeqUID);
		}
		
		if(!(evtList = FWK.event._eventListDictionary[obj.handleId])) {//每一个DOM元素均有一个事件对象
			evtList = FWK.event._eventListDictionary[obj.handleId] = {};
			
			FWK.event._eventListDictionary[obj.handleId]['__DOM__'] = obj;//记录事件对象，页面离开时清除所有事件绑定
		}
		
		if (!fn.__elUID) {//函数上也绑定了唯一标识
			fn.__elUID = obj.handleId + "_" + (++FWK.event._fnSeqUID);
		}
		
		if(!evtList[eventType]) {
			evtList[eventType] = {};
		}
		
		if(typeof evtList[eventType][fn.__elUID] == 'function') {//已绑定过此类型的此方法
			return false;
		}
		
		var argArray = argArray || [];
		
		//利用闭包引用参数
		cfn = function(_fn, _o, _args) {
			return function(e) {
				return _fn.apply(_o, ([FWK.event.getEvent(e)]).concat(_args));
			}
		}(fn, obj, argArray);
		
		if (obj.addEventListener) {
			obj.addEventListener(eventType, cfn, false);
			res = true;
		} else if (obj.attachEvent) {
			res = obj.attachEvent("on" + eventType, cfn);
		} else {
			res = false;
		}
		
		if (res) {
			evtList[eventType][fn.__elUID] = cfn;
		}
		
		//清除引用
		obj = cfn = evtList = fn = argArray = null;
		
		return res;
	},

	/**
	 * 取消事件绑定
	 * 
	 * @param {DocumentElement} obj 需要取消事件绑定的页面对象
	 * @param {String} eventType 需要取消绑定的事件
	 * @param {Function} fn 需要取消绑定的函数
	 * @return 是否成功取消(true为成功，false为失败)
	 * @type Boolean
	 * @example FWK.event.removeEvent(FWK.$('demo'),'click',hello);
	 */
	removeEvent : function(obj, eventType, fn) {
		
		var cfn = null, res = false, evtList = null;

		if (!obj) {
			return res;
		}
		
		if (!fn) {//没有传入指定的函数则清除该一类型的所有事件
			return FWK.event.purgeEvent(obj, eventType);
		}
		
		if (!obj.handleId) {
			obj.handleId = (++FWK.event._objSeqUID);
		}
		
		if (!(evtList = FWK.event._eventListDictionary[obj.handleId])) {
			evtList = FWK.event._eventListDictionary[obj.handleId] = {};
		}

		if (!fn.__elUID) {
			fn.__elUID = obj.handleId + "_" + (++FWK.event._fnSeqUID);
		}

		if (!evtList[eventType]) {
			evtList[eventType] = {};
		}
		
		if (FWK.event.extendType.test(eventType) && evtList[eventType] && evtList[eventType][fn.__elUID]) {
			cfn = evtList[eventType][fn.__elUID];
		} else {
			cfn = fn;
		}

		if (obj.removeEventListener) {
			obj.removeEventListener(eventType, cfn, false);
			res = true;
		} else if (obj.detachEvent) {
			obj.detachEvent("on" + eventType, cfn);
			res = true;
		} else {
			return false;
		}
		if (res && evtList[eventType]) {//删除某一事件类型的指定函数
			delete evtList[eventType][fn.__elUID];
		}
		
		//清除引用
		obj = fn = cfn = evtList = null;
		
		return res;
	},

	/**
	 * 取消全部某类型的方法绑定
	 * 
	 * @param {HTMLElement} obj 需要取消事件绑定的DOM对象
	 * @param {String} eventType 需要取消绑定的事件
	 * @example FWK.event.purgeEvent(FWK.$('demo'),'click');
	 * @return {Boolean} 是否成功取消(true为成功，false为失败)
	 */
	purgeEvent : function(obj, type) {
		var evtList = null;
		
		if(obj.handleId && (evtList = FWK.event._eventListDictionary[obj.handleId]) && evtList[type]) {
			for (var k in evtList[type]) {
				if (evtList[type].hasOwnProperty(k)) {
					if (obj.removeEventListener) {
						obj.removeEventListener(type, evtList[type][k], false);
					} else if(obj.detachEvent) {
						obj.detachEvent('on' + type, evtList[type][k]);
					}
				}
			}
		}
		
		if (obj['on' + type]) {
			obj['on' + type] = null;
		}
		
		if (evtList) {
			evtList[type] = null;
			delete evtList[type];
		}
		
		return true;
	},

	/**
	 * 根据不同浏览器获取对应的Event对象
	 * 
	 * @param {Event} evt
	 * @return 修正过的Event对象, 同时返回一个修正button的自定义属性;
	 * @type Event
	 * @example FWK.event.getEvent();
	 * @return Event
	 */
	getEvent : function(evt) {
		
		var evt = evt || window.event;

		/* 修正Mozilla的event事件 */
		if (!evt && !FWK.UA.ie) {
			var c = FWK.event.getEvent.caller, cnt = 1;
			
			while (c) {
				evt = c.arguments[0];
				if (evt && Event == evt.constructor) {
					break;
				}else if(cnt > 32){
					break;
				}
				c = c.caller;
				cnt++;
			}
		}
		
		return evt;
	},

	/**
	 * 获得鼠标按键
	 * 
	 * @param {Object} evt
	 * @example FWK.event.getButton(evt);
	 * @return {number} 鼠标按键 -1=无法获取event 0=左键 1= 中键 2= 右键
	 */
	getButton : function(evt) {
		var e = FWK.event.getEvent(evt);
		
		if (!e) {
			return -1
		}

		if (FWK.UA.ie) {
			return e.button - Math.ceil(e.button / 2);
		} else {
			return e.button;
		}
	},

	/**
	 * 返回事件触发的对象
	 * 
	 * @param {Object} evt
	 * @example FWK.event.getTarget(evt);
	 * @return {object}
	 */
	getTarget : function(evt) {
		var e = FWK.event.getEvent(evt);
		
		return e ? (e.target || e.srcElement) : null;
	},

	/**
	 * 返回获得焦点的对象
	 * 
	 * @param {Object} evt
	 * @example FWK.event.getCurrentTarget();
	 * @return {object}
	 */
	getCurrentTarget : function(evt) {
		var e = FWK.event.getEvent(evt);
		
		return e ? (e.currentTarget || document.activeElement) : null;//activeElement
	},

	/**
	 * 阻止事件冒泡传播
	 * 
	 * @param {Event} evt 事件，非必要参数
	 * @example FWK.event.cancelBubble();
	 */
	cancelBubble : function(evt) {
		evt = FWK.event.getEvent(evt);
		
		if (!evt) {
			return false
		}
		
		if (evt.stopPropagation) {
			evt.stopPropagation();
		} else {
			if (!evt.cancelBubble) {
				evt.cancelBubble = true;
			}
		}
	},

	/**
	 * 取消浏览器的默认事件
	 * 
	 * @param {Event} evt 事件，非必要参数
	 * @example FWK.event.preventDefault();
	 */
	preventDefault : function(evt) {
		evt = FWK.event.getEvent(evt);
		
		if (!evt) {
			return false
		}
		
		if (evt.preventDefault) {
			evt.preventDefault();
		} else {
			evt.returnValue = false;
		}
	},

	/**
	 * 获取事件触发时的鼠标位置x
	 * 
	 * @param {Object} evt 事件对象引用
	 * @example FWK.event.mouseX();
	 */
	mouseX : function(evt) {
		evt = FWK.event.getEvent(evt);
		return evt.pageX || (evt.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
	},

	/**
	 * 获取事件触发时的鼠标位置y
	 * 
	 * @param {Object} evt 事件对象引用
	 * @example FWK.event.mouseX();
	 */
	mouseY : function(evt) {
		evt = FWK.event.getEvent(evt);
		return evt.pageY || (evt.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
	},

	/**
	 * 获取事件RelatedTarget
	 * @param {Object} evt 事件对象引用
	 * @example FWK.event.getRelatedTarget();
	 */
	getRelatedTarget: function(ev) {
		ev = FWK.event.getEvent(ev);
		var t = ev.relatedTarget;
		if (!t) {
			if (ev.type == "mouseout") {
				t = ev.toElement;
			} else if (ev.type == "mouseover") {
				t = ev.fromElement;
			}
		}
		return t;
	},
	/**
	 * 将方法绑定在对象上，能够保护this指针不会“漂移”
	 * 
	 * @param {Object} obj 母体对象
	 * @param {Object} method 目标方法
	 * @example var e = FWK.event.bind(objA,funB);
	 */
	bind : function(obj, method) {
		var args = Array.prototype.slice.call(arguments, 2);
		
		return function() {
			var _obj = obj || this;
			var _args = args.concat(Array.prototype.slice.call(arguments, 0));
			if (typeof(method) == "string") {
				if (_obj[method]) {
					return _obj[method].apply(_obj, _args);
				}
			} else {
				return method.apply(_obj, _args);
			}
		}
	}
}

//解除所有事件的绑定
FWK.event.addEvent(window, 'unload', function() {
	var evList = FWK.event._eventListDictionary, evItems = null;
	
	for (var i in evList) {
		if (evList.hasOwnProperty(i)) {
			evItems = evList[i];
			for (var p in evItems) {
				if (evItems.hasOwnProperty(p) && p != "__DOM__") {
					FWK.event.purgeEvent(evItems['__DOM__'], p);
				}
			}
		}
	}
	
	delete FWK;
});





FWK.UI = {};
/**
 * 拖拽管理器，负责对dom对象进行拖拽的绑定。
 * 
 * @namespace FWK.UI.DragDrop
 */
FWK.UI.DragDrop = {
	/**
	 * 拖拽池，用来记录已经注册拖拽的对象
	 */
	dragdropPool : {},
	
	/**
	 * 拖拽对象临时ID.
	 * 
	 * @ignore
	 */
	dragTempId : 0,
	
	/**
	 * 自动滚屏的感知范围
	 */
	_scrollRange : 0,
	
	/**
	 * 拖拽的默认样式
	 */
	dragGhostStyle : "cursor:move;position:absolute;border:1px solid #06c;background:#6cf;z-index:111;color:#003;overflow:hidden",
	
	/**
	 * 注册拖拽对象, 注册后，返回 FWK.UI.DragDrop.eventController 拖放驱动对象
	 * 
	 * @param {HTMLElement} handle 推拽的对象的handler
	 * @param {HTMLElement} target 需要推拽的对象
	 * @param {Object} options 参数 {range,rangeElement,x,y,ghost,ghostSize,ghostStyle} <br/><br/>
	 *            range [left,top,right,bottom] 指定一个封闭的拖放区域,参数可以不必全设置，留空或设置为非数字如null[left,top,right,bottom]或为number
	 *            rangeElement [element,[left,top,right,bottom],isStatic] 制定拖放区域的对象，限制物体只能在这个区域内拖放。 
	 *            使用条件：[left,top,right,bottom] 是0或1,rangeElement和target必须是同一个坐标系，而且target必须在rangeElement内
	 *            isStatic {boolean} 是指 rangeElement没有使用独立的坐标系--例没有margin等(默认值是flase)。
	 *            
	 *            x,y 刻度偏移量，每次移动的偏移量
	 *            ghost 如果拖放的对象是浮动的，是否拖放出现影子 
	 *            ghostSize 代理层的尺寸，当设置了尺寸，初始位置就以鼠标位置定位了
	 *            注意 ignoreTagName 忽略的tagName 一般用来忽略一些 控件等 例如 object embed autoScroll 是否自动滚屏 cursor 鼠标
	 *            ghostStyle 设置ghost层次的样式
	 * @return 返回 FWK.UI.DragDrop.eventController 驱动对象
	 * @type FWK.UI.DragDrop.eventController
	 * @example
	 * 			FWK.UI.DragDrop.register(this.titleElement,this.mainElement,{range:[0,0,'',''],x:50,y:160});
	 */
	register : function(handler, target, options) {
		var _hDom = FWK.$(handler);
		
		if (!_hDom) {//检测是否已设置为可拖拽对象
			return null;
		} else if(this.dragdropPool[_hDom.id]) {
			return this.dragdropPool[_hDom.id];
		}
		
		options = FWK.extend({
			range : [null, null, null, null],
			ghost : 0
		}, options || {});
		
		//不传入默认为自身
		var targetObject = FWK.$(target) || _hDom;
		!_hDom.id ? (_hDom.id = "DragDrop_" + this.dragTempId++) : "";
		_hDom.style.cursor = options.cursor || "move";
		
		//缓存池内缓存所有拖拽对象
		this.dragdropPool[_hDom.id] = new this.eventController();
		
		//设置绑定事件
		this.dragdropPool[_hDom.id].bindHandler = function(_this) {
			return function() {
				var _args = [_hDom.id, targetObject, options];
				_this.startDrag.apply(_this,[arguments[0]].concat(_args));
			}
		}(this);
		
		//监听对象mousedown事件
		FWK.event.addEvent(_hDom, "mousedown", this.dragdropPool[_hDom.id].bindHandler);
		
		return this.dragdropPool[_hDom.id];
	},

	/**
	 * 取消注册拖拽对象
	 * 
	 * @param {HTMLElement} handle 推拽的对象的handler
	 */
	unRegister : function(handler) {
		var _hDom = FWK.$(handler);
		
		if (!_hDom || !this.dragdropPool[_hDom.id]) {
			return null
		}
		
		_hDom.style.cursor = "default";
		FWK.event.removeEvent(_hDom, "mousedown", this.dragdropPool[_hDom.id].bindHandler);
		delete this.dragdropPool[_hDom.id].bindHandler;
		delete this.dragdropPool[_hDom.id];
	},
	
	/**
	 * 开始拖放
	 * 
	 * @param {event} e 事件，如果直接截获到的 event element 对象有noDrag=true属性则不进行拖拽
	 * @param {string} handlerId handler 的编号
	 * @param {Object} target 拖放对象
	 * @param {Object} options 参数
	 */
	startDrag : function(e, handlerId, target, options) {
		var _srcElement = FWK.event.getTarget();//获取触发事件源的对象
		
		if(FWK.event.getButton() !== 0 || _srcElement.noDrag) {//只有鼠标左键才能触发拖拽
			return;
		}
		
		if(options.ignoreTagName == _srcElement.tagName || _srcElement.noDragDrop) {
			return;
		}
		
		var _size = [target.offsetWidth - 0, target.offsetHeight - 0];//不应用getSize取它真宽高
		var _stylePosition = target.style.position;
		var _isAbsolute = _stylePosition === "absolute" || _stylePosition === "fixed";
		var _ghost = null,
			_hasGhost = false,
			_xy = null;
		
		//限制拖拽的区域
		if(options.rangeElement) {
			var _re = options.rangeElement;
			var _el = FWK.$(_re[0]);
			
			var _elSize = [_el.scrollWidth, _el.scrollHeight];//_el.offsetHeight在IE与其它浏览器下取值不一致
			
			var _r = _re[1] || [1, 1, 0, 0];//默认只限制顶点
			
			if (!_re[2]){//[(left, top), (right, bottom)]->[(x1, y1), (x2, y2)]
				options.range = [_r[0] ? 0 : null, _r[1] ? 0 : null, _r[2] ? _elSize[0] : null, _r[3] ? _elSize[1] : null];
			} else {
				var _elXY = FWK.getXY(_el);
				options.range = [_r[0] ? _elXY[0] : null, _r[1] ? _elXY[1] : null, _r[2] ? _elXY[0] + _elSize[0] : null, _r[3] ? _elXY[1] + _elSize[1] : null];
			}
		}
		
		var _left = target.style.left, _top = target.style.top;
		
		//非绝对定位的对象使用鬼影层
		if(!_isAbsolute || options.ghost) {
			//获取拖拽目标的位置
			if(_isAbsolute && _left && _top) {
				_xy = [parseInt(_left, 10), parseInt(_top, 10)];
			} else {
				_xy = FWK.getXY(target);
			}
						
			//如果是 absolute 对象，则在对象的father对象上创建ghost
			_ghost = document.createElement("div");
			_ghost.style.cssText = (options.ghostStyle || this.dragGhostStyle);
			_ghost.style.position = _stylePosition;
			
			(_isAbsolute ? target.parentNode : document.body).appendChild(_ghost);
			_ghost.id = "dragGhost";
			
			if (FWK.UA.ie) {
				_ghost.style.filter = 'alpha(opacity=80)';
			} else {
				_ghost.style.opacity = .8;
			}
			
			// 延迟设置透明
			setTimeout(function() {
				if (FWK.UA.ie) {
					target.style.filter = 'alpha(opacity=50)';
				} else {
					target.style.opacity = .5;
				}
				target = null;
			}, 0);
			
			if (options.ghostSize) {
				_ghost.style.width = options.ghostSize[0] + 'px';
				_ghost.style.height = options.ghostSize[1] + 'px';
				_xy = [e.clientX + FWK.getScrollLeft() - 30, e.clientY + FWK.getScrollTop() - 20];
			} else {
				_ghost.style.width = _size[0] - 2 + 'px';//2是border宽度即两边1px像素宽度
				_ghost.style.height = _size[1] - 2 + 'px';
			}
			
			FWK.setXY(_ghost, _xy[0], _xy[1]);
			
			_hasGhost = true;
		} else {
			if(_left && _top) {
				_xy = [parseInt(_left, 10), parseInt(_top, 10)];
			} else {
				_xy = FWK.getXY(target);
			}
		}
		_left = _top = null;
		
		var _dragTarget = _ghost || target;
		
		// 缓存当前模块的信息
		var currentDragCache = {
			size : _size,
			xy : _xy,
			mXY : _xy,
			dragTarget : _dragTarget,
			target : target,
			x : e.clientX - parseInt(_xy[0], 10),
			y : e.clientY - parseInt(_xy[1], 10),
			ghost : _ghost,
			hasGhost : _hasGhost,
			isAbsolute : _isAbsolute,
			options : options,
			scrollRangeTop : FWK.UI.DragDrop._scrollRange,
			scrollRangeBottom : FWK.getClientHeight() - FWK.UI.DragDrop._scrollRange,
			maxScrollRange : Math.max(FWK.getScrollHeight() - FWK.getClientHeight(), 0)
		}
		
		// 监听并绑定拖拽事件
		this.dragdropPool[handlerId].moveHandler = function(_this) {
			return function() {
				var _args = [handlerId, currentDragCache, options];
				_this.doDrag.apply(_this,[arguments[0]].concat(_args));
			}
		}(this);
		
		this.dragdropPool[handlerId].upHandler = function(_this) {
			return function() {
				var _args = [handlerId, currentDragCache, options];
				_this.endDrag.apply(_this,[arguments[0]].concat(_args));
			}
		}(this);
		
		FWK.event.addEvent(document, "mousemove", this.dragdropPool[handlerId].moveHandler);
		FWK.event.addEvent(document, "mouseup", this.dragdropPool[handlerId].upHandler);
		this.dragdropPool[handlerId].onStartDrag.apply(null, [e, handlerId, currentDragCache, options]);
		
		//阻止默认行为
		FWK.event.preventDefault(e);
	},

	/**
	 * 拖放过程
	 * 
	 * @param {event} e 事件
	 * @param {string} handlerId handler 的编号
	 * @param {Object} dragCache 拖放对象cache
	 * @param {Object} options 参数
	 */
	doDrag : function(e, handlerId, dragCache, options) {
		var pos = {};
		
		// 如果没有区域限制，则开启滚屏感知功能
		if (options.autoScroll) {
			if (e.clientY < dragCache.scrollRangeTop) {
				if (!FWK.UI.DragDrop._scrollTop) {
					FWK.UI.DragDrop._stopScroll();
					
					if(FWK.UI.DragDrop._scrollTimer) {
						clearTimeout(FWK.UI.DragDrop._scrollTimer);
					}
					
					FWK.UI.DragDrop._scrollTimer = setTimeout(function() {
						FWK.UI.DragDrop._doScroll(true, dragCache)
					}, 200);
				}
			} else if (e.clientY > dragCache.scrollRangeBottom) {
				if (!FWK.UI.DragDrop._scrollBottom) {
					FWK.UI.DragDrop._stopScroll();
					
					if(FWK.UI.DragDrop._scrollTimer) {
						clearTimeout(FWK.UI.DragDrop._scrollTimer);
					}
					
					FWK.UI.DragDrop._scrollTimer = setTimeout(function() {
						FWK.UI.DragDrop._doScroll(false, dragCache)
					}, 200);
				}
			} else {
				FWK.UI.DragDrop._stopScroll();
			}
		}

		var mX = e.clientX - dragCache.x;
		var mY = e.clientY - dragCache.y;
		
		// 如果是拖放参考层
		var xy = this._countXY(mX, mY, dragCache.size, options);
		mX = xy.x;
		mY = xy.y;

		FWK.setXY(dragCache.dragTarget, mX, mY);
		dragCache.mXY = [mX, mY];
		
		this.dragdropPool[handlerId].onDoDrag.apply(null, [e, handlerId, dragCache, options]);
		if (FWK.UA.ie) {
			document.body.setCapture();
		} else if (window.captureEvents) {
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		}
		
		//阻止默认行为
		FWK.event.preventDefault(e);
	},

	/**
	 * 结束拖放
	 * 
	 * @param {event} e 事件
	 * @param {string} handlerId handler 的编号
	 * @param {Object} dragCache 拖放对象cache
	 * @param {Object} options 参数
	 */
	endDrag : function(e, handlerId, dragCache, options) {
		if (dragCache.hasGhost) {
			if(dragCache.dragTarget.parentNode) {
				dragCache.dragTarget.parentNode.removeChild(dragCache.dragTarget);
			}
			
			var _t = dragCache.target;
			
			setTimeout(function() {
				if (FWK.UA.ie) {
					_t.style.filter = "alpha(opacity=100)";
				} else {
					_t.style.opacity = 1;
				}
				_t = null;
			}, 0);
			
			// 对象是浮动层
			if (dragCache.isAbsolute) {
				var _x = dragCache.target.style.left;
				var _y = dragCache.target.style.top;
				var x,y;
				if(_x && _y) {
					x = parseInt(_x, 10);
					y = parseInt(_y, 10);
				} else {
					var _getXY = FWK.getXY(dragCache.target);
					x = _getXY[0];
					y = _getXY[1];
					_getXY = null;
				}
				x += (dragCache.mXY[0] - dragCache.xy[0]);
				y += (dragCache.mXY[1] - dragCache.xy[1]);
				
				var xy = this._countXY(x, y, dragCache.size, options);
				FWK.setXY(dragCache.target, xy.x, xy.y);
				_x = _y = x = y = xy = null;
			}
		}
		
		FWK.event.removeEvent(document, "mousemove", this.dragdropPool[handlerId].moveHandler);
		FWK.event.removeEvent(document, "mouseup", this.dragdropPool[handlerId].upHandler);
		this.dragdropPool[handlerId].onEndDrag.apply(null, [e, handlerId, dragCache, options]);		
		FWK.UI.DragDrop._stopScroll();
		
		if (FWK.UA.ie) {
			document.body.releaseCapture();
		} else if (window.releaseEvents){
			window.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		}
		
		delete this.dragdropPool[handlerId].moveHandler;
		delete this.dragdropPool[handlerId].upHandler;
		dragCache = null;
	},

	/**
	 * 开始滚屏
	 */
	_doScroll : function(isUp, dc) {
		step = isUp ? -15 : 15;
		var _st = FWK.getScrollTop();
		if (isUp && _st + step < 0) {
			step = 0;
		}
		
		if (!isUp && _st + step > dc.maxScrollRange) {
			step = 0;
		}
		
		document[document.compatMode == "CSS1Compat" && !FWK.UA.webkit ? "documentElement" : "body"].scrollTop = _st + step;
		
		dc.y = dc.y - step;
		FWK.UI.DragDrop._scrollTop = isUp;
		FWK.UI.DragDrop._scrollBottom = !isUp;
		
		if(FWK.UI.DragDrop._scrollTimer) {
			clearTimeout(FWK.UI.DragDrop._scrollTimer);
		}
		
		FWK.UI.DragDrop._scrollTimer = setTimeout(function() {
			FWK.UI.DragDrop._doScroll(isUp, dc)
		}, 16);
	},
	
	/**
	 * 停止滚动屏幕
	 */
	_stopScroll : function() {
		this._scrollTop = this._scrollBottom = false;
		if(this._scrollTimer) {
			clearTimeout(this._scrollTimer);
		}
	},

	/**
	 * 计算坐标
	 */
	_countXY : function(x, y, size, options) {
		var pos = {
			x : x,
			y : y
		};
		
		// 计算横坐标刻度
		if (options.x) {		
			pos["x"] = parseInt(pos["x"]/options.x,10) * options.x + (pos["x"] % options.x<options.x/2?0:options.x);
		}
		
		// 计算纵坐标刻度
		if (options.y) {
			pos["y"] = parseInt(pos["y"]/options.y,10) * options.y + (pos["y"] % options.y<options.y/2?0:options.y);
		}
		
		// 计算拖拽范围
		if (options.range) {
			var _r = options.range;
			var i = 0, j = 0;
			while (i < _r.length && j < 2) {
				// 非数字返回
				if (typeof _r[i] != "number") {
					i++;
					continue;
				};
				// 判断对象是否靠边
				var k = i % 2 ? "y" : "x";
				var v = pos[k];
				pos[k] = i < 2 ? Math.max(pos[k], _r[i]) : Math.min(pos[k], _r[i] - size[(i) % 2]);
				if (pos[k] != v) {
					j++;
				};
				i++;
			}
		}
		
		return pos;
	}
};
/**
 * 拖放事件驱动
 * 
 * @constructor FWK.UI.DragDrop.eventController
 */
FWK.UI.DragDrop.eventController = function() {
	this.onStartDrag = FWK.emptyFn;
	this.onDoDrag = FWK.emptyFn;
	this.onEndDrag = FWK.emptyFn;
};












/**
 * 对话框，参数默认为w*h = 400 * 300
 * 
 * @param {Number} width 窗体宽度
 * @param {Number} height 窗体高度
 */
FWK.DialogHandler = function(width, height) {
	width = width || 400;
	height = height || 300;
	
	var uniqueId = ++FWK.DialogHandler.uniqueId;
	
	this._id = uniqueId;
	this.id = "dialog_" + uniqueId;
	this.headId = "dialog_head_" + uniqueId;
	this.titleId = "dialog_title_" + uniqueId;
	this.closeId = "dialog_button_" + uniqueId;
	this.contentId = "dialog_content_" + uniqueId;
	this.frameId = "dialog_frame_" + uniqueId;
	this.zIndex = 6000 + uniqueId;
	
	var templateHTML = [
			'<div class="modelTL">',
				'<div class="modelTR">',
					'<div class="modelTM">',
						'<div class="tit">',
							'<div class="titM" id="'+this.headId+'">',
								'<a href="javascript:;" id="'+this.closeId+'" title="关闭">&nbsp;</a>',
								'<h3 id="'+this.titleId+'">&nbsp;</h3>',
							'</div>',
						'</div>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="modelML">',
				'<div class="modelMR">',
					'<div class="modelMM">',
						'<div id="'+this.contentId+'" style="_overflow:visible; zoom:1; display:inline-block;"></div>',/**firefox、chrome下产生margin collapse 边距重叠*/
					'</div>',
				'</div>',
			'</div>',
			'<div class="modelBL">',
				'<div class="modelBR">',
					'<div class="modelBM"></div>',
				'</div>',
			'</div>'
	];
	
	if (FWK.UA.ie && FWK.UA.ie < 7) {
		templateHTML.push('<iframe id="'+this.frameId+'" frameBorder="no" style="filter:alpha(opacity=0);border:0px;position:absolute;width:100%;height:100%;top:0px;left:0px;z-index:-1;"></iframe>');
	}
	
	this.dialog = document.createElement('div');
	this.dialog.id = this.id;
	this.dialog.className = 'model unselectable';
	this.dialog.innerHTML = templateHTML.join("");
	this.dialog.style.display = 'none';
	this.dialog.style.zIndex = this.zIndex;
	this.dialog.style.position = 'absolute';
	this.dialog.unselectable = "on";
	this.dialog.onselectstart = function() {return false;}
	document.body.appendChild(this.dialog);
		
	this.dialogContent = FWK.$(this.contentId);
	this.dialogHead = FWK.$(this.headId);
	this.dialogClose = FWK.$(this.closeId);
	
	this.setCenter(width, height);
	this.setSize(width, height);
	this.resetCloseHandler();
	
	//缓存引用
	FWK.DialogHandler.items[this._id] = this;
	
	//点击对话框关闭按钮时
	FWK.event.addEvent(this.dialogClose, 'click', function(ev, $pointer) {
		var ret = $pointer.$onBeforeClose();
		
		if (ret === false || ret === undefined) {//不返回任何值，默认为undefined或者返回false
			$pointer.unload();
		}
		FWK.event.preventDefault(ev);
	}, [this]);
	
	//监听mousedown事件
	FWK.event.addEvent(this.dialogClose, 'mousedown', function(ev) {
		FWK.event.cancelBubble(ev);
	});
}

FWK.DialogHandler.items = {};
FWK.DialogHandler.uniqueId = 1;

/**
 * 重置关闭时执行的函数，因为函数被重置过，返回需要改写为默认
 * 
 * 可覆写此函数，返回undefined则执行unload关闭对话框，返回非undefined则不调用unload，可自行调用unload
 */
FWK.DialogHandler.prototype.resetCloseHandler = function() {
	FWK.DialogHandler.prototype.$onBeforeClose = FWK.emptyFn;
	FWK.DialogHandler.prototype.$onAfterClose = FWK.emptyFn;
}
/**
 * 设置对话框居中，参数为对话框的大小
 * 
 * @param {Number} width
 * @param {Number} height
 */
FWK.DialogHandler.prototype.setCenter = function(width, height) {
	var state = this.dialog.style.display;
	
	if (!width) {
		this.dialog.style.display = "block";
	}
	
	width = width || this.dialog.clientWidth;
	height = height || this.dialog.clientHeight;
	
	this.dialog.style.display = state;//返回display状态，如果dialog为none得到的clientWidth将为0
	
	var _l = (FWK.getClientWidth() - width) / 2 + FWK.getScrollLeft();
	var _t = this.getTop(height);
	
	this.dialog.style.left = _l + 'px';
	this.dialog.style.top = _t + 'px';
}

/**
 * 设置对话框大小
 * 
 * @param {Number} width
 * @param {Number} height
 */
FWK.DialogHandler.prototype.setSize = function(width, height) {
	this._setWidth(width);
	this._setHeight(height);
}
/**
 * 设置对话框的宽度
 * 
 * @param {Number} w 对话框宽度
 */
FWK.DialogHandler.prototype._setWidth = function(w) {
	this.dialog.style.width = w + 'px';
}
/**
 * 设置对话框的最小高度
 * 
 * @param {Number} h 对话框高度
 */
FWK.DialogHandler.prototype._setHeight = function(h) {
	var state = this.dialog.style.display;
	
	if (!this.dialogHead.clientHeight) {//防止取到的高度为0
		this.dialog.style.display = "block";
	}	
	
	var headHeight = this.dialogHead.clientHeight;//获取头部的高度、display为none时无法获取
	
	this.dialog.style.display = state;
	
	var _h = (h - headHeight < 0) ? 50 : h - headHeight;
	
	this.dialogContent.style[FWK.UA.ie && FWK.UA.ie < 7 ? "height" : "minHeight"] = _h + 'px';
}
/**
 * 获取距离顶部的高度(距中高度)
 * 
 * @param {Number} h 对话框居中显示距离页面顶部的位置
 */
FWK.DialogHandler.prototype.getTop = function(h) {
	var _h = h || this.dialog.offsetHeight;
	
	if (!_h) {
		var state = this.dialog.style.display;//记录当前的display状态
		this.dialog.style.display = "block";
		_h = this.dialog.offsetHeight;
		this.dialog.style.display = state;
	}
	
	return Math.max((FWK.getClientHeight() - _h) / 2 + FWK.getScrollTop() - 5, 0);
}
/**
 * 显示对话框
 * 
 * @param {Function} fn 显示后调用的回调函数
 * @param {Boolean} noAnimate 是否关闭动画
 */
FWK.DialogHandler.prototype.show = function(fn, noAnimate) {
	var tempDialog = $(this.dialog);
	
	if (tempDialog.is(":animated")) {
		tempDialog.stop(true, false);
	}
	
	this.setCenter();//居中显示
	
	if (typeof fn != 'function') {
		fn = FWK.emptyFn;
	}
	
	if (this.isShow) {
		return fn();
	}
	
	//允许对话框拖拽
	FWK.UI.DragDrop.register(this.dialogHead, this.dialog, {
		rangeElement : [document.documentElement, [1, 1, 1, 1], 0],
		autoScroll : true,
		ghost : false,
		ghostSize : [50, 20]
	});
	
	this.isShow = true;//对话框已打开
	
	var _t = this.getTop();
	
	if (noAnimate) {//不执行动画
		tempDialog.show().css({'top':_t});
		fn();
	} else {//使用动画
		tempDialog.show().css({
			top : _t - 30,
			opacity : 0
		}).animate({
			top : _t,
			opacity : 1
		}, {
			duration : 300,
			easing : "",
			complete : fn
		});
	}
	
	tempDialog = null;
}
/**
 * 隐藏对话框
 * 
 * @param {Function} fn 隐藏后调用的回调函数
 * @param {Boolean} noAnimate 是否关闭执行动画
 */
FWK.DialogHandler.prototype.hide = function(fn, noAnimate) {
	
	if (typeof fn != 'function') {
		fn = FWK.emptyFn;
	}
	
	FWK.UI.DragDrop.unRegister(this.dialogHead);//取消拖拽事件的注册
	
	this.isShow = false;//对话框已关闭
	
	if (noAnimate) {//强制关闭，没有动画效果
		fn();
	} else {
		
		$(this.dialog).animate({
			top : Math.max(parseInt(this.dialog.style.top, 10) - 30, 0),//以dialog当前top来计算
			opacity : 0
		}, {
			duration : 300,
			easing : "",
			complete : fn
		});
	}
}
/**
 * 卸载对话框，并不从DOM上进行销毁
 * 
 * @param {Function} fn 销毁后的回调函数
 * @param {Boolean} noAnimate 是否关闭执行动画
 */
FWK.DialogHandler.prototype.unload = function(fn, noAnimate) {
	
	fn = typeof fn != 'function' ? this.$onAfterClose : fn;
	
	fn = function(_fn, _this) {
		return function() {
			_this.dialog.style.display = "none";
			_this.clearContent();
			
			return _fn.apply(_this, arguments);
		}
	}(fn, this);
	
	this.hide.apply(this, [fn, noAnimate]);
}
/**
 * 获取对话框的zIndex值
 */
FWK.DialogHandler.prototype.getZIndex = function() {
	return this.dialog.style.zIndex;
}
/**
 * 设置对话框标题
 * 
 * @param {String} tit 标题内容
 */
FWK.DialogHandler.prototype.fillTitle = function(tit) {
	var titleDom = FWK.$(this.titleId);
	
	titleDom.innerHTML = tit;
}
/**
 * 设置对话框内容
 * 
 * @param {HTMLElement|String} cont DOM对象DocumentFragment对象或html字符串
 */
FWK.DialogHandler.prototype.fillContent = function(cont) {
	var contElem = this.clearContent();
	
	if (typeof cont == 'string') {
		contElem.html(cont);
	} else if(cont && (cont.nodeType == 1 || cont.nodeType == 11)) {
		contElem.append(cont);
	}
}
/**
 * 清空对话框内容
 */
FWK.DialogHandler.prototype.clearContent = function() {
	var contElem = $(this.dialogContent);
	
	try {
		contElem.empty();
	} catch (ex) {
		window.status = ex.message;
	}
	
	return contElem;
}











/**
 * 共用蒙板
 */
FWK.maskLayout = function() {
	this.init.apply(this, arguments);
}
FWK.maskLayout.count = 0;
FWK.maskLayout.items = {};

FWK.maskLayout.prototype.init = function(zIndex, autoRender) {
	this.mId = ++FWK.maskLayout.count;
	
	zIndex = (zIndex || 5000) + this.mId ;
	
	var maskDiv = document.createElement('div');
		maskDiv.className = "dialog_mask";
		maskDiv.style.zIndex = zIndex;
		maskDiv.unselectable = "on";
		maskDiv.style.height = FWK.getScrollHeight() + 'px';
		
	if (FWK.UA.ie && FWK.UA.ie < 7) {
		maskDiv.innerHTML = '<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;filter:alpha(opacity=0);"></iframe>';
	}
		
	FWK.maskLayout.items[this.mId] = maskDiv;
	
	if (autoRender) {
		document.body.appendChild(maskDiv);
	}
	
	return maskDiv;
}
FWK.maskLayout.prototype.show = function() {
	this.getMask().style.display = "block";
}
FWK.maskLayout.prototype.hide = function() {
	this.getMask().style.display = "none";
}
FWK.maskLayout.prototype.getMask = function() {
	return FWK.maskLayout.items[this.mId];
}















FWK.widget = {};

/**
 * 显示对话框
 * 
 * @param {String|Null} title 对话框标题
 * @param {String|HTMLElement|Null} cont 对话框内容
 * @param {Object|Null} para 对话框其它参数
 */
FWK.widget.Dialog = function(title, cont, para) {
	title = title || "温馨提示";
	cont = cont || "<h2>服务繁忙，请稍候重试！</h2>";
	
	var _instance = FWK.widget.Dialog.getInstance();
		_instance.resetCloseHandler();
		_instance.fillTitle(title);
		_instance.fillContent(cont);
	
	//直接调用隐藏，不使用动画
	if (_instance.isShow) {
		_instance.hide(null, true);
	}
	
	para = para || {};
	//默认自动关闭
	para.autoClose = para.autoClose === false ? false : true;
	//是否显示关闭按钮
	para.showClose = para.showClose === false ? false : true;
	//显示对话框时，不使用动画
	para.noAnimate = !!para.noAnimate;
	
	_instance.dialogClose.style.display = para.showClose ? "block" : "none";
	
	//autoClose 与 onBeforeClose 控制是否关闭浮动框，其中优先判断onBeforeClose函数的返回值
	_instance.$onBeforeClose = function(_para, _dialog) {
		return function() {
			if (typeof _para.onBeforeClose == 'function') {
				return _para.onBeforeClose(_para, _dialog) || (_para.autoClose ? _dialog.mask.hide() : null);
			} else {
				//关闭蒙板
				return _dialog.mask.hide();
			}
		}
	}(para, _instance);
	
	//关闭对话框后的回调函数
	if (typeof para.onAfterClose == 'function') {
		_instance.$onAfterClose = para.onAfterClose;
	}
	
	//设置对话框宽度
	if (para.width || para.w) {
		_instance._setWidth(para.width || para.w);
	}
	//设置对话框高度
	if (para.height || para.h) {
		_instance._setHeight(para.height || para.h);
	}
	
	//需要重新调整对话框位置
	if (para.width || para.w || para.height || para.h) {
		_instance.setCenter();
	}
	
	//显示对话框之前的回调函数
	if (typeof para.onBeforeShow == 'function') {
		para.onBeforeShow();
	}
	
	_instance.mask.show();//显示蒙板
	
	//显示对话框之后的回调函数
	_instance.show(para.onAfterShow, para.noAnimate);//显示对话框
	
	para = null;
	_instance = null;
};
/**
 * 更新对话框的内容
 * 
 * @param {String} title
 * @param {String|HTMLElement} cont
 * @param {Object|Null} para
 */
FWK.widget.Dialog.updateCont = function(title, cont, para) {
	title = title || "温馨提示";
	
	var _instance = FWK.widget.Dialog.getInstance();
		_instance.resetCloseHandler();
		_instance.fillTitle(title);
		_instance.fillContent(cont);
	
	para = para || {};
	//是否显示关闭按钮
	para.showClose = para.showClose === false ? false : true;
	_instance.dialogClose.style.display = para.showClose ? "block" : "none";
	
	//设置对话框宽度
	if (para.width || para.w) {
		_instance._setWidth(para.width || para.w);
	}
	//设置对话框高度
	if (para.height || para.h) {
		_instance._setHeight(para.height || para.h);
	}
	
	if (para.width || para.w || para.height || para.h) {
		_instance.setCenter();
	}
}

/**
 * 显示加载对话框
 * 
 * @param {String} cont
 * @param {String} title
 */
FWK.widget.showLoading = function(cont, title) {
	FWK.widget.Dialog(title || '温馨提示', '<div class="Load"><img src="/assets/style/images/pic_20.gif" width="32" height="32" />'+(cont || '正在加载，请稍后……')+'</div>', {w:300, h:90, showClose:false});
}

/**
 * 获取对话框实例对象
 */
FWK.widget.Dialog.getInstance = function() {
	if (!FWK.widget.Dialog._instance) {
		FWK.widget.Dialog._instance = new FWK.DialogHandler(400, 100);
		FWK.widget.Dialog._instance.mask = new FWK.maskLayout('', true);
	}
	
	return FWK.widget.Dialog._instance;
}

/**
 * 关闭Dialog
 * 
 * @param {Function} fn  关闭时的回调函数
 * @param {Function} noAnimate 是否关闭执行动画
 */
FWK.widget.Dialog.close = function(fn, noAnimate) {
	var _instance = FWK.widget.Dialog.getInstance();
		_instance.mask.hide();
		_instance.unload.apply(_instance, arguments);
}

/**
 * 显示用户登录框
 * 
 * @param {Function|Null} fn 登录成功回调函数
 * @param {Object|Null} para 登录框的一些参数设置 
 */
FWK.widget.userLogin = function(fn, para) {
	para = para || {};
	
	FWK.widget.userLogin.loginCallBack = function(_callBack) {
		return function() {
			FWK.widget.Dialog.close(function() {
				/**
				 * callBack返回 'reload' 或者 callBack 为null都将刷新网页
				 */
				if ( _callBack === null || (typeof _callBack === 'function' && _callBack() === 'reload') ) {
					document.location.reload();
				}
			});
		}
	}(fn || null);
	
	FWK.widget.Dialog('用户登录', '<iframe frameBorder="0" scrolling="no" src="/login.html" id="loginIframe" name="loginIframe" style="width:300px; overflow:hidden; margin-left:15px;"></iframe>', {
		w : 350,
		h : 220,
		onBeforeShow : FWK.widget.userLogin.startTimer,
		onAfterShow : para.onAfterShow || null,
		onBeforeClose : para.onBeforeClose || function() {window.focus();},//登录框的焦点问题
		onAfterClose : FWK.widget.userLogin.stopTimer,
		autoClose : para.autoClose,
		showClose : para.showClose
	});
}
FWK.widget.userLogin.loginCallBack = function() {};//记录登录完成后的回调方法

//调整登录框iframe的大小
FWK.widget.userLogin.resizeIframe = function() {
	var frame = FWK.$("loginIframe");
	
	try {
		var h1 = frame.contentWindow.document.body.scrollHeight;
		var h2 = frame.contentWindow.document.documentElement.scrollHeight;
		var h = Math.max(h1, h2);
		
		frame.style.height = h + 'px';
	} catch(ex) {
		FWK.widget.userLogin.stopTimer();//清除定时器
	}
}
FWK.widget.userLogin.startTimer = function() {
	FWK.widget.userLogin.stopTimer();
	
	FWK.widget.userLogin._timer = setInterval(FWK.widget.userLogin.resizeIframe, 200);
}
FWK.widget.userLogin.stopTimer = function() {
	if (FWK.widget.userLogin._timer) {
		clearInterval(FWK.widget.userLogin._timer);
	}
}








/**
 * 弹出菜单
 * 
 * @param {Object} o
 */
FWK.UI.PopMenu = function(o) {
	if (!(this instanceof arguments.callee)) {//允许没有new操作的实例化
		return new arguments.callee(o);
	} else {
		this.initialize(o);
	}
	
	return this;
}

FWK.UI.PopMenu.prototype = {
	initialize : function(para) {
		
		if (!para || typeof para !== 'object') {
			throw new Error('参数传递的不正确');
		}
		
		this.menuData = para.data;
		this.width = para.width || para.w || 100;
		this.selectedItem = null;
		
		this.menu = document.createElement('div');
		this.menu.className = "pop_menu";
		this.menu.style.display = "none";
		this.menu.onselectstart = function() {return false;};
		this.menuCont = $('<div class="menu_bd">').appendTo(this.menu);
		this.menuList = $('<div class="menu_item_list">').appendTo(this.menuCont);
		
		this.setWidth(this.width);//设置菜单项宽度
		
		this._renderItems();//渲染菜单项
		
		document.body.appendChild(this.menu);
	},
	$itemChange : FWK.emptyFn,
	$show : FWK.emptyFn,
	$hide : FWK.emptyFn,
	$noMenuData : FWK.emptyFn,
	/**
	 * 菜单项被点击
	 * 
	 * @param {HTMLElement} el 被选中的DOM对象
	 */
	_itemSelected : function(el) {
		if (this.currentItem === el) {
			return ;
		}
		
		if (this.currentItem) {
			this._changeClass(this.currentItem, false, true);
		}
		
		this.currentItem = el;
		
		this._changeClass(this.currentItem, true);
		
		this.$itemChange();
	},
	/**
	 * 是否高亮当前的DOM对象，默认当前已被高亮则直接返回 isForce强制无论是否高亮均继续操作
	 * 
	 * @param {HTMLElement} el 
	 * @param {Boolean} isHighlight
	 * @param {Boolean} isForce 是否强制，默认undefined(不强制)
	 */
	_changeClass : function(el, isHighlight, isForce) {
		if (this.currentItem == el && !isForce) {
			return ;
		}
		
		$(el).removeClass(isHighlight ? "menu_item" : "menu_item_high").addClass(isHighlight ? "menu_item_high":"menu_item");
	},
	//渲染菜单项
	_renderItems : function() {
		var $pointer = this;
		
		var count = 0;
		for (var i in this.menuData) {
			++count;
			
			$('<div class="menu_item">'+this.menuData[i]+'</div>').hover(function() {//为每一项绑定事件
				$pointer._changeClass(this, true);
			}, function() {
				$pointer._changeClass(this, false);
			}).click(function() {
				$pointer._itemSelected(this);
			}).appendTo(this.menuList).attr("_itemId", i);
			
			if (count % 3 === 0) {
				$('<div class="menu_item_separator"><div></div></div>').appendTo(this.menuList);
			}
		}	
		
		var lastChild = this.menuList.find(">div:last");
		if (lastChild.hasClass("menu_item_separator")) {
			lastChild.remove();
		}
	},
	/**
	 * 设置菜单的位置
	 * 
	 * @param {Number} x 菜单的X坐标
	 * @param {Number} y 菜单的Y坐标
	 */
	_setXY : function(x, y) {
		if (x && /^[\d.]+$/.test(x)) {
			this.menu.style.left = parseInt(x, 10) + 'px';
		}
		if (y && /^[\d.]+$/.test(y)) {
			this.menu.style.top = parseInt(y, 10) + 'px';
		}
		
		return this;
	},
	//销毁菜项
	dispose : function() {
		this.menuList.empty();
		this.currentItem = null;
	},
	//更新菜单项
	update : function(para) {
		this.dispose();
		this.menuData = null;
		
		if (!!para && typeof para === 'object') {
			this.menuData = para;
			
			this._renderItems();
		}
		
		return this;
	},
	/**
	 * 设置菜单宽度
	 * 
	 * @param {Number} w 菜单宽度
	 */
	setWidth : function(w) {
		this.width = w || this.width;
		
		this.menuList.css('width', this.width);
		
		return this;
	},
	/**
	 * 获取当前菜单选中的项
	 * 
	 * return null || {key:'', value:''}
	 */
	getValue : function() {
		if (this.currentItem) {
			var _itemId = this.currentItem.getAttribute("_itemId", 2);
			
			return {
				key	: _itemId, 
				value : this.menuData[_itemId]
			};
		} 
		
		return null;
	},
	/**
	 * 显示菜单 
	 * 
	 * @param {Number} x 菜单的X坐标
	 * @param {Number} y 菜单的Y坐标
	 * @param {Null|Number} duration 菜单显示的动画时间
	 */
	show : function(x, y, duration) {
		
		if (!this.menuData) {//没有数据项，不进行显示
			this.$noMenuData();
			return false;
		}
		
		duration = duration || 500;
		
		this._setXY.apply(this, arguments);
		
		this.menu.style.display = 'block';
		
		var h = this.menu.scrollHeight;
		
		$(this.menu).stop(true, false).css({
			height : h * .3
		}).animate({
			height : h
		}, {
			duration : duration,
			easing : 'strongEaseOut',
			complete : FWK.event.bind(this, this.$show)
		});
		
		return this;
	},
	//隐藏菜单
	hide : function() {
		$(this.menu).stop(false, true).hide();
		this.$hide();
		
		return this;
	}
}







/**
 * 虚框动画效果
 * 
 * @param {HTMLElement|String} fId 动画起始时的DOM对象
 * @param {HTMLElement|String} tId 动画结束时到达的DOM对象
 * @param {Number|Null} duration 播放时间
 * @param {Function} callback 动画播放完成时的回调方法
 * @param {String|Null} easing  动画的算子函数
 */
FWK.UI.runBox = function(fId, tId, duration, callback, easing) {
	
	var fElem = typeof fId == 'string' ? $("#" + fId) : $(fId),
		tElem = typeof tId == 'string' ? $("#" + tId) : $(tId);
		
	callback = callback || FWK.emptyFn;
	
	var from = {
		xy : fElem.offset(),
		size : {
			width : fElem.outerWidth(),
			height : fElem.outerHeight()
		}
	};
	
	var to = {
		xy : tElem.offset(),
		size : {
			width : tElem.outerWidth(),
			height : tElem.outerHeight()
		}
	}
	
	var tempDiv = document.createElement('div');
		tempDiv.style.margin = '0';
		tempDiv.style.padding = '0';
		tempDiv.style.backgroundColor = 'transparent';
		tempDiv.style.position = 'absolute';
		tempDiv.style.border = '1px solid #999';
		tempDiv.style.zIndex = "9999";
		tempDiv.style.width = from.size.width + 'px';
		tempDiv.style.height = from.size.height + 'px';
		tempDiv.style.left = from.xy.left + 'px';
		tempDiv.style.top = from.xy.top + 'px';
		
	document.body.appendChild(tempDiv);
	
	function clearBox() {
		if (FWK.UI.runBox_child) {
			FWK.UI.runBox_child.stop(false, false).remove();
		}
		FWK.UI.runBox_child = null;
	}
	
	clearBox();
	
	
	FWK.UI.runBox_child = $(tempDiv);
	
	FWK.UI.runBox_child.css('opacity', .3).animate({
		top : to.xy.top,
		left : to.xy.left,
		width : to.size.width,
		height : to.size.height,
		borderWidth : 1,
		opacity : 1
	}, {
		duration : duration || 300,
		easing : easing || '',
		complete : function() {
			callback();
			clearBox();
			
			callback = null;
		},
		step : function() {},
		queue : true
	});
	
	tempDiv = tElem = fElem = from = to = null;
}

//扩展jQuery的动画特效
if (typeof jQuery === 'function' && (typeof jQuery.easing === 'object')) {
	jQuery.easing.strongEaseOut = function(p, n, firstNum, diff) {//t, b, c, d
		return (firstNum+diff) * ((p = p / diff - 1) * p * p * p * p + 1) + firstNum;
	}
}


Date.prototype.format = function(fmt) {
    if (!fmt) fmt = "yyyy-MM-dd hh:mm:ss";
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
