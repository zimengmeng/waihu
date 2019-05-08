
// 是否在浏览器的console中显示log。true-显示；false-不显示
var showConsoleLogFlag = true;
// 错误提示信息小气泡使用风格，可以设置的参数有：tip-darkgray、tip-green、tip-skyblue、tip-twitter、tip-violet、tip-yellow、tip-yellowsimple
var errorTipClassName = "tip-yellowsimple";
// 页面主体宽度
var pageMainContainerWidth;
// 默认垂直滚动条宽度
var defaultScrollYWidth = 20;

var defaultListPageSize = 15;

/**
 * 配置lhgdialog框架全局默认参数
 */
if($.dialog && $.dialog.setting) {
	(function(config) {
		config["lock"] = true;// 开启锁屏遮罩，中断用户对话框之外的交互
		//config["background"] = "#000000";// 锁屏遮罩颜色。V4.2.0版本，锁屏层的background 参数和 opacity 参数被取消，由 CSS 文件定义
		//config["opacity"] = 0.9;// 锁屏遮罩透明度。V4.2.0版本，锁屏层的background 参数和 opacity 参数被取消，由 CSS 文件定义
		config["max"] = false;// 不显示最大化按钮
		config["min"] = false;// 不显示最小化按钮
		//config['fixed'] = true;// 开启静止定位，静止定位是css2.1的一个属性，它静止在浏览器某个地方不动，也不受滚动条拖动影响
	})($.dialog.setting);
}

/**
 * 所有页面（包含图片等文件在内的所有元素）都加载完成后默认执行的方法
 */
window.onload = function() {
	// 处理页面所有iframe高度自适应
	try {
		adapt_iframeHeight();
	} catch(e) {
		showConsoleLog("Excute Function adapt_iframeHeight() Error:");
		showConsoleLog(e);
	}
	
	try {
		hideLoading();
	} catch(e) {
		showConsoleLog("Excute Function hideLoading() Error:");
		showConsoleLog(e);
	}
}

/**
 * 自适应iframe高度
 */
function adapt_iframeHeight() {
	if(window.self != window.top) {
		var currentWindow = window.parent;
		while(true) {
			var allParentFrames = currentWindow.document.getElementsByTagName("iframe");
			for(var i = 0; i < allParentFrames.length; i ++) {
				var currentFrame = allParentFrames[i];
				// 必须将高度清零，否则高度可能会出现不正常
				currentFrame.height = 0;
				if(currentFrame.contentDocument.body && currentFrame.contentDocument.body.scrollHeight) {
					if("true" === currentFrame.getAttribute("needRealHeight")) {
						currentFrame.height = currentFrame.contentDocument.body.scrollHeight;
					} else {
						if(parseInt(currentFrame.contentDocument.body.scrollHeight) > 399) {
							currentFrame.height = currentFrame.contentDocument.body.scrollHeight;
						} else {
							currentFrame.height = 400;
						}
					}
				} else {
					if("true" === currentFrame.getAttribute("needRealHeight")) {
						currentFrame.height = 0;
					} else {
						currentFrame.height = 400;
					}
				}
			}
			
			if(currentWindow != window.top) {
				currentWindow = currentWindow.parent;
			} else {
				break;
			}
		}
	}
}

$(function() {
	
	// 浏览器放大或者缩小事件监听
	$(window).bind("resize", function() {
		browserResizeHandle();
	});
	
	// 自适应页面主体框架宽度
	try {
		adaptPageMainContainerWidth();
	} catch(e) {
		showConsoleLog("Excute Function adaptPageMainContainerWidth() Error:");
		showConsoleLog(e);
	}
	
	// 自适应页面内容区域框架宽度
	try {
		adaptPageRightContainerWidth();
	} catch(e) {
		showConsoleLog("Excute Function adaptPageRightContainerWidth() Error:");
		showConsoleLog(e);
	}
	
	// 错误信息特殊处理方法
	try {
		errorMessageHandle();
	} catch(e) {
		showConsoleLog("Excute Function errorMessageHandle() Error:");
		showConsoleLog(e);
	}

});

/**
 * 调整浏览器大小时执行的宽度自动适应处理方法
 */
function browserResizeHandle() {
	var pageMainContainerDiv = $("#pageMainContainer");
	if(pageMainContainerDiv && document.getElementById("pageMainContainer") && !isNullOrEmpty(pageMainContainerWidth)) {
		var browserWindowWidth = parseInt($(window).width());
		if(browserWindowWidth > pageMainContainerWidth) {
			pageMainContainerWidth = browserWindowWidth;
			pageMainContainerDiv.css("width", pageMainContainerWidth + "");
			
			// 自适应页面内容区域框架宽度
			adaptPageRightContainerWidth();
		}
	}
}

/**
 * 自适应页面主体框架宽度
 */
function adaptPageMainContainerWidth() {
	var pageMainContainerDiv = $("#pageMainContainer");
	if(pageMainContainerDiv && document.getElementById("pageMainContainer")) {
		if(isNullOrEmpty(pageMainContainerWidth)) {
			var screenWidth = parseInt(window.screen.width);
			var browserWindowWidth = parseInt($(window).width());
			var checkScrollXY = checkScrollXYDisplayed();
			if(checkScrollXY && checkScrollXY.scrollY) {
				if((screenWidth - defaultScrollYWidth) > browserWindowWidth) {
					pageMainContainerWidth = screenWidth - defaultScrollYWidth;
				} else {
					pageMainContainerWidth = browserWindowWidth;
				}
			} else {
				pageMainContainerWidth = browserWindowWidth;
			}
		}
		pageMainContainerDiv.css("width", pageMainContainerWidth + "");
	}
}

/**
 * 自适应页面内容区域框架宽度
 */
function adaptPageRightContainerWidth() {
	var pageRightContainerDiv = $("#pageRightContainer");
	if(pageRightContainerDiv && document.getElementById("pageRightContainer")) {
		var pageRightContainerWidth = getPageRightContainerWidth();
		pageRightContainerDiv.css("width", pageRightContainerWidth + "");
	}
}

/**
 * 自动计算页面内容区域框架宽度
 * @returns {Number}
 */
function getPageRightContainerWidth() {
	var marginLeftWidth = 30;
	var marginRightWidth = 30;
	var mainLeftMenuWidth = 200;
	var paddingLeftWidth = 21;
	var pageRightContainerWidth = pageMainContainerWidth - marginLeftWidth - marginRightWidth - mainLeftMenuWidth - paddingLeftWidth - 2;
	
	return pageRightContainerWidth;
}

/**
 * 错误信息特殊处理方法
 */
function errorMessageHandle() {
	if($("#errorMessage") && $("#errorMessage").html()) {
		var errorMessage = $("#errorMessage").html();
		if(errorMessage == "对不起，您还未登录，请先登录后再试！") {
			alert(errorMessage);
			window.top.location.href="index.do";
		} else {
			return;
		}
	} else {
		return;
	}
}

/**
 * 设置主页面iFrame源文件，主要提供main页面使用，会给点击区域增加选中CSS效果。
 * 
 * @param obj 当前点击的element对象，会给该点击的element对象增加选中CSS效果。
 * @param srcUrl 设置iFrame的源
 */
function setMain_iframeSrc(obj, srcUrl) {
	var aTags = window.top.document.getElementById("main_LeftMenu").getElementsByTagName("a");
	for(var i = 0; i < aTags.length; i ++) {
		if(aTags[i].getAttribute("class") && "cur" === aTags[i].getAttribute("class")) {
			aTags[i].removeAttribute("class");
		}
	}
	obj.setAttribute("class", "cur");
	window.top.document.getElementById("main_iframe").src = srcUrl;
    setMain_iframeHeight(window.top.document.getElementById("main_iframe"))
}
// 设置主页面iframe的自适应高度
function setMain_iframeHeight(iframe) {
    // 放在闭包中，防止iframe触发load事件的时候下标不匹配
    (function () {
        iframe.onload = function () {
            this.contentWindow.onbeforeunload = function () {
                iframe.style.visibility = 'hidden';
                // iframe[_i].style.display = 'none';
                iframe.setAttribute('height', 'auto');
            };
			if(this.contentWindow.document.body.scrollHeight < 690) {
                this.setAttribute('height', 690);
            }else {
                this.setAttribute('height', this.contentWindow.document.body.scrollHeight);
            }
            this.style.visibility = 'visible';
            // this.style.display = 'block';
        };
    })();
}

/**
 * 为指定的IFrame设置源
 * 
 * @param iFrameId 指定的iFrame元素的id
 * @param srcUrl 设置iFrame的源
 */
function setIframeSrcById(iFrameId, srcUrl) {
	document.getElementById(iFrameId).src = srcUrl;
}

/**
 * JSON请求实体
 * 
 * @returns
 */
function JSONRequest() {}

/**
 * 使用jQuery.ajax提交JSON数据
 * 
 * @param postUrl 提交的URL地址，不允许为空。
 * @param successFunc 成功回调的方法（即：响应体中的status值为00），该参数如果为空时则通过同步方式执行接口并直接返回数据。
 * @param postData 提交的JSON对象，对象需使用 new JSONRequest() 生成，不允许为空。
 * @param errorFunc 失败回调的方法，允许为空，为空时会回调默认的“defaultErrorHandle”方法（successFunc为空时无效果）。
 * @param needLoading 是否显示loading加载遮罩：true-显示，false-不显示，默认为true显示遮罩。
 * @param needHideLoading 该参数仅当needLoading为true时有效，通信完成时，是否关闭loading遮罩：true-需要关闭，false-不需要关闭，默认为true需要关闭遮罩。
 */
function AjaxPost(postUrl, successFunc, postData, errorFunc, needLoading, needHideLoading) {
	var loadingFlag = true;
    // postUrl = 'http://192.168.7.100:8082' + postUrl
    // postUrl = 'http://192.168.6.59:8080' + postUrl
	if(("boolean" === typeof(needLoading) && !needLoading) || ("string" === typeof(needLoading) && "false" === needLoading)) {
		loadingFlag = false;
	}
	
	var hideLoadingFlag = true;
	if(("boolean" === typeof(needHideLoading) && !needHideLoading) || ("string" === typeof(needHideLoading) && "false" === needHideLoading)) {
		hideLoadingFlag = false;
	}
	
	showConsoleLog("Request PostUrl:" + postUrl);
	showConsoleLog("Request Data:" + JSON.stringify(postData));
//	var postDataStr = encodeURIComponent(JSON.stringify(postData));
	var postDataStr = JSON.stringify(postData);
	if(loadingFlag) {
		showLoading();
	}
	if(successFunc) {// 由回调函数来处理结果数据（异步）
		$.ajax({
			url:postUrl,
			type:"POST",
			data:postDataStr,
			dataType:"json",
			contentType:"application/json",
			success:function (data, textStatus) {
				if(loadingFlag && hideLoadingFlag) {
					hideLoading();
				}
				showConsoleLog("Response Status:" + textStatus);
				showConsoleLog("Response Data:" + JSON.stringify(data));
				if(data && data.ret_code && "00000000" === data.ret_code) {
					successFunc(data);
				} else {
					if(errorFunc && data && data.ret_code && "01" === data.ret_code) {
						errorFunc(data);
					} else {
						defaultErrorHandle(data);
					}
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown) {
				if(loadingFlag && hideLoadingFlag) {
                    hideLoading();
				}
				showConsoleLog("Response Status:" + textStatus);
				//alert("系统出现异常！");
			}
		});
	} else {// 直接返回结果数据（同步）,不会调用回调函数
		var jsonResult = $.ajax({
			url:postUrl,
			async:false,
			type:"POST",
			data:postDataStr,
			dataType:"json",
			contentType:"application/json",
			success:function (data, textStatus) {
				if(loadingFlag && hideLoadingFlag) {
					hideLoading();
				}
				showConsoleLog("Response Status:" + textStatus);
				showConsoleLog("Response Data:" + JSON.stringify(data));
			},
			error:function(XMLHttpRequest, textStatus, errorThrown) {
				if(loadingFlag && hideLoadingFlag) {
					hideLoading();
				}
				showConsoleLog("Response Status:" + textStatus);
				//alert("系统出现异常！");
			}
		}).responseText;
		return jsonResult;
	}
}

/**
 * Ajax通信默认错误处理
 */
function defaultErrorHandle(data) {
	debugger
	if(typeof(data) === "object" && data && data.ret_msg) {
		if (data.ret_code === '00101999') {
            alert(data.ret_msg);
           top.location.href = '../login/login.html'
		} else {
            alert(data.ret_msg);
		}
	} else {
		alert("系统出现异常！");
	}
}

/**
 * 通信时显示loading和遮罩
 */
function showLoading() {
	/*var pageShadow = window.top.document.getElementById("pageShadow");
	var loadingLayout = window.top.document.getElementById("loadingLayout");
	if(pageShadow) {
		pageShadow.height = window.top.document.body.scrollHeight;
		pageShadow.style.display = "block";
	}
	if(loadingLayout) {
		loadingLayout.style.display = "block";
	}*/
	if ($.dialog) {
		$.dialog({id:"showLoading", title:false});
	}
}

/**
 * 通信完成隐藏loading和遮罩
 */
function hideLoading() {
	/*var pageShadow = window.top.document.getElementById("pageShadow");
	var loadingLayout = window.top.document.getElementById("loadingLayout");
	if(pageShadow) {
		pageShadow.style.display = "none";
	}
	if(loadingLayout) {
		loadingLayout.style.display = "none";
	}*/
	if ($.dialog) {
		$.dialog({id:"showLoading"}).close();
	}
}

/**
 * 判断水平滚动条、垂直滚动条是否显示，返回一个JSON对象，对象中包含scrollX、scrollY。<br />
 * true-表示显示；false-表示未显示。
 * @param el 指定的页面Element元素，例如一个DIV。
 * @returns JSONObject：scrollX、scrollY
 */
function checkScrollXYDisplayed(el) {
	// test targets
	var elems = el ? [el] : [document.documentElement, document.body];
	var scrollX = false, scrollY = false;
	for (var i = 0; i < elems.length; i++) {
		var o = elems[i];
		// test horizontal
		var sl = o.scrollLeft;
		o.scrollLeft += (sl > 0) ? -1 : 1;
		o.scrollLeft !== sl && (scrollX = scrollX || true);
		o.scrollLeft = sl;
		// test vertical
		var st = o.scrollTop;
		o.scrollTop += (st > 0) ? -1 : 1;
		o.scrollTop !== st && (scrollY = scrollY || true);
		o.scrollTop = st;
	}
	// result Object
	var resultObj = {
		scrollX: scrollX,
		scrollY: scrollY
	};
	
	return resultObj;
}

var urlGetParameters = new Array();
/**
 * 获取URL的所有GET参数值<br />
 * 范例：<br />
 * var value = getUrlParameter("pageNo"); //获取参数pageNo的值
 */
function getUrlParameter(keyStr) {
	if(urlGetParameters && urlGetParameters.length > 0) {
		return urlGetParameters[keyStr];
	} else {
		var currentUrl = window.location.href;
		urlGetParameters = new Array();
		if(currentUrl.indexOf("?") > -1) {
			var parametersStr = currentUrl.substring(currentUrl.indexOf("?") + 1);
			var parametersArr = parametersStr.split("&");
			for(var i = 0; i < parametersArr.length; i ++) {
				var currentParameterStr = parametersArr[i];
				var currentKey = currentParameterStr.substring(0, currentParameterStr.indexOf("="));
				var currentValue = currentParameterStr.substring(currentParameterStr.indexOf("=") + 1);
				while(currentValue.substring(currentValue.length - 1) === "#") {
					currentValue = currentValue.substring(0, currentValue.length - 1);
				}
				urlGetParameters[currentKey] = currentValue;
			}
		}
		return urlGetParameters[keyStr];
	}
}

/**
 * 获取页面访问地址的前缀，格式为：[http|https]://ServerName:ServerPort/ContextPath/
 * 
 * @returns
 */
function getUrlPrefix() {
	var currentUrl = window.location.href;
	var pathName = document.location.pathname;
	
	var contextPathEndIndex = pathName.substr(1).indexOf("/");
	var contextPath = pathName.substr(0, contextPathEndIndex + 2);
	
	return currentUrl.substr(0, currentUrl.indexOf(contextPath) + contextPath.length);
}

/**
 * 列表过长时点击top返回顶部
 */
function praSroll() {
	var $aa = $('<a>');
	$aa.attr('id','jScrollTop'); 
	$aa.attr('href','javascript:scrollToTop();');
	$(this.parent.parent.parent.window.document.body).append($aa);
	 if($.browser.msie || $.browser.mozilla || $.browser.webkit) {
        $aa.get(0).click();
    }else {
    	window.open($aa.attr('href'), $aa.attr('target'));
    }
}

function scrollToTop() {
	$('body,html').animate({
		scrollTop: 0
	},500);
	$('#jScrollTop').remove();
}

function historyBack() {
	window.history.back(-1);
}

/**
 * 进入欢迎页面
 */
function returnWelcomePage() {
	var aTags = window.top.document.getElementById("main_LeftMenu").getElementsByTagName("a");
	for(var i = 0; i < aTags.length; i ++) {
		if(aTags[i].getAttribute("class") && "cur" === aTags[i].getAttribute("class")) {
			aTags[i].removeAttribute("class");
		}
	}
	
	window.top.document.getElementById("main_iframe").src = "Welcome.do";
}

/**
 * 非空判断
 *
 * @param obj 判断的对象
 */
function isNullOrEmpty(obj) {
	if(typeof(obj) === "number" && 0 === obj) {
		return false;
	} else {
		if(obj) {
			return false;
		} else {
			return true;
		}
	}
}

/**
 * 账号464格式化
 *
 * @param str 待格式化账号
 */
function accountNumberFormat464(str) {
	if (str) {
		return str.substring(0, 4) + "******" + str.substring(str.length - 4);
	} else {
		return str;
	}
}

/**
 * 金额格式化：根据规则，日元和韩元等金额无小数位数，其它两位小数。
 *
 * @param s 待格式化金额
 * @param currency 币种，允许为空
 */
function formatMoney(s, currency) {
	// 小数点位数
	var n = 2;
	if (currency && (currency === "025" || currency === "BEF" || currency === "026" || currency === "ITL" || currency === "027" || currency === "JPY" || currency === "035"  || currency === "GLD" || currency === "064" || currency === "VND" || currency === "068" || currency === "088"|| currency === "KRW")) {
		n = 0;
	} else {
		n = 2;
	}
	
	s = s || 0;
	n = (n >= 0 && n <= 20) ? n : 2;
	s = (s + "").replace(/[^\d\.-]/g, "");
	if (s === "") return s;
	s = parseFloat(s).toFixed(n) + "";
	var l = s.split(".")[0].split("").reverse(),
		r = s.split(".")[1];
	t = "";
	for (var i = 0; i < l.length; i++) {
		t += l[i] + ((i + 1) % 3 === 0 && (i + 1) != l.length ? "," : "");
	}
	var str = "";
	if (r == undefined) {
		str = t.split("").reverse().join("");
	} else {
		str = t.split("").reverse().join("") + "." + r;
	}
	str = str.replace(/-,/, "-");
	return str;
}

/**
 * 鼠标移动上去部分显示灰色背景
 */
function onMouseOverFunction(obj) {
	if(obj) {
		obj.style.backgroundColor = "#F1F1F1";
	}
}

/**
 * 鼠标移开后恢复背景颜色
 */
function onMouseOutFunction(obj) {
	if(obj) {
		obj.style.backgroundColor = "";
	}
}

/**
 * 当前页面跳转公共方法
 */
function currentWindowLocationHref(str) {
	window.location.href = str;
}

/**
 * Console打印公共方法。showConsoleLogFlag值为true时打印，为false时不打印。
 *
 * @param str 待打印的内容
 */
function showConsoleLog(str) {
	try {
		if(showConsoleLogFlag) {
			// console.log(str);
		}
	} catch(e) {}
}

/**
 * 将UTF-16字符串转化为UTF-8字符串
 * 
 * @param str 待转化的字符串
 * @returns
 */
function utf16ToUTF8(str) {
	var out, i, len, c;
	
	out = "";
	len = str.length;
	for(i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		}
	}
	return out;
}

/**
 * 将UTF-8字符串转化为UTF-16字符串
 * 
 * @param str 待转化的字符串
 * @returns
 */
function utf8ToUTF16(str) {
	var out, i, len, c;
	var char2, char3;
	
	out = "";
	len = str.length;
	i = 0;
	while(i < len) {
		c = str.charCodeAt(i++);
		switch(c >> 4) {
			case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
				// 0xxxxxxx
				out += str.charAt(i-1);
				break;
			case 12: case 13:
				// 110x xxxx   10xx xxxx
				char2 = str.charCodeAt(i++);
				out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
				break;
			case 14:
				// 1110 xxxx  10xx xxxx  10xx xxxx
				char2 = str.charCodeAt(i++);
				char3 = str.charCodeAt(i++);
				out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
				break;
		}
	}
	
	return out;
}

/**
 * 手机号显示格式化。例如：18812345678，格式化后返回：188****5678
 *
 * @param str 待格式化手机号
 */
function formatMobileNumber(str) {
	if (str) {
		return str.substring(0, 3) + "****" + str.substring(str.length - 4);
	} else {
		return str;
	}
}

function newWindowOpen(url) {
	window.open(url, "newwindow", "height=650, width=1050, top=5, left=158, toolbar=no, menubar=no, scrollbars=yes,resizable=no,location=no, status=no");
}
