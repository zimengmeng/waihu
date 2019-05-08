

/**
 * ==================================================
 * 页面校验机制
 * ==================================================
 */

// 错误提示信息集合
var errorMessage = [];
// 正则表达式集合
var checkRegExp = [];

var ErrorMessageDefaults = {
	defaultText:"对不起，出现错误！",
	regExp:{
		inputText:"对不起，您输入的内容格式不正确！"
	},
	empty:{
		inputText:"对不起，此项为必填项！",
		radioOrCheckbox:"对不起，此项为必选项！"
	},
	length:{
		inputText:"对不起，您输入的内容长度不符合要求！"
	}
};

$(function() {

	try {
		inputCheckerBlur();
	} catch(e) {}

});

/**
 * 页面加载时默认给页面各个输入域增加校验机制监听
 */
function inputCheckerBlur() {
	var inputs = document.getElementsByTagName("input");
	for (var i = 0; i < inputs.length; i++) {
		if ((inputs[i].type == "text" || inputs[i].type == "number" || inputs[i].type == "password" || inputs[i].type == "date" || inputs[i].type == "search") && !isIgnore(inputs[i])) {
			inputs[i].addEventListener("blur", function () { inputCheckAndHideErrorMessageTips(this); }, false);
			inputs[i].addEventListener("click", function () { clearAllValidationErrorHandle(this); }, false);
		}
	}
	
	var textareas = document.getElementsByTagName("textarea");
	for (var i = 0; i < textareas.length; i++) {
		if(!isIgnore(textareas[i])) {
			textareas[i].addEventListener("blur", function () { inputCheckAndHideErrorMessageTips(this); }, false);
			textareas[i].addEventListener("click", function () { clearAllValidationErrorHandle(this); }, false);
		}
	}
}

/**
 * 输入域校验异常处理方法：<br />
 * 1、显示错误提示信息小气泡。<br />
 * 2、设置输入框背景色。通过在输入域增加属性：needSpecialBackgroundColor="false"即可关闭该处理。<br />
 * 3、设置输入框边框颜色（如果边框本身不显示不受影响）。通过在输入域增加属性：needSpecialBorderColor="false"即可关闭该处理。
 * @param obj 输入域Element
 * @param message 需要显示的错误提示信息
 */
function validationErrorHandle(obj, message) {
	// 显示错误提示信息小气泡
	showErrorMessageTip(obj, message);
	// 设置输入域背景色
	setValidationErrorSpecialBackgroundColor(obj);
	// 设置输入域边框颜色
	setValidationErrorSpecialBorderColor(obj);
}

/**
 * 清除所有的输入域校验失败时做的处理，恢复原样。<br />
 * 1、取消错误提示信息小气泡Tip。如果小气泡已经不显示了，则不做处理。<br />
 * 2、清除设置的输入域背景色。如果输入域设置了needSpecialBorderColor="false"或者框架未改变默认的边框颜色，则不做处理。<br />
 * 3、清除设置的输入域边框颜色。如果输入域设置了needSpecialBackgroundColor="false"或者框架未改变默认的背景颜色，则不做处理。
 * @param obj
 */
function clearAllValidationErrorHandle(obj) {
	// 取消错误提示信息小气泡Tip
	hideErrorMessageTips(obj);
	// 清除设置的输入域背景色
	clearValidationErrorSpecialBackgroundColor(obj);
	// 清除设置的输入域边框颜色
	clearValidationErrorSpecialBorderColor(obj);
}

/**
 * 显示错误提示信息小气泡Tip
 * @param obj 输入域Element
 * @param message 错误提示信息
 */
function showErrorMessageTip(obj, message) {
	hideErrorMessageTips(obj);
	var offsetXValue = 5;
	// 自定义水平位移处理
	if(obj.getAttribute("tipOffsetX")) {
		try {
			offsetXValue = parseInt(obj.getAttribute("tipOffsetX"));
		} catch(e) {
			// 不做任何处理
		}
	}
	
	if(typeof(errorTipClassName) != "undefined" && errorTipClassName) {
		$(obj).poshytip({
			className:errorTipClassName,
			content:message,
			showOn:"none",
			alignTo:"target",
			alignX:"right",
			alignY:"center",
			offsetX:offsetXValue,
			showTimeout:0
		}).poshytip("show");
	} else {
		$(obj).poshytip({
			content:message,
			showOn:"none",
			alignTo:"target",
			alignX:"right",
			alignY:"center",
			offsetX:offsetXValue,
			showTimeout:0
		}).poshytip("show");
	}
	
	obj.setAttribute("errortipDisplayed", "true");
}

/**
 * 取消错误提示信息小气泡Tip。如果小气泡已经不显示了，则不做处理。
 * @param obj 输入域Element，该参数为空时，会取消页面所有输入域的小气泡Tip
 */
function hideErrorMessageTips(obj) {
	if (!obj) {
		var inputs = document.getElementsByTagName("input");
		for (var i = 0; i < inputs.length; i++) {
			if(inputs[i] && inputs[i].getAttribute("errortipDisplayed") && "true" == inputs[i].getAttribute("errortipDisplayed")) {
				$(inputs[i]).poshytip("hide");
				inputs[i].removeAttribute("errortipDisplayed");
			}
		}
		var textareas = document.getElementsByTagName("textarea");
		for (var i = 0; i < textareas.length; i++) {
			if(textareas[i] && textareas[i].getAttribute("errortipDisplayed") && "true" == textareas[i].getAttribute("errortipDisplayed")) {
				$(textareas[i]).poshytip("hide");
				textareas[i].removeAttribute("errortipDisplayed");
			}
		}
	} else {
		if(obj.getAttribute("errortipDisplayed") && "true" == obj.getAttribute("errortipDisplayed")) {
			$(obj).poshytip("hide");
			obj.removeAttribute("errortipDisplayed");
		}
	}
}

/**
 * 校验失败设置输入框背景色。通过在输入域增加属性：needSpecialBackgroundColor="false"即可关闭该处理。
 * @param obj 输入域Element
 */
function setValidationErrorSpecialBackgroundColor(obj) {
	if(obj && (!obj.getAttribute("needSpecialBackgroundColor") || "false" != obj.getAttribute("needSpecialBackgroundColor"))) {
		$(obj).css("background-color","#FF6");
		obj.setAttribute("specialBackgroundColor", "true");
	}
}

/**
 * 清除设置的输入域背景色。如果输入域设置了needSpecialBackgroundColor="false"或者框架未改变默认的背景颜色，则不做处理。
 * @param obj 输入域Element
 */
function clearValidationErrorSpecialBackgroundColor(obj) {
	if(obj && (!obj.getAttribute("needSpecialBackgroundColor") || "false" != obj.getAttribute("needSpecialBackgroundColor"))
			&& obj.getAttribute("specialBackgroundColor")
			&& "true" == obj.getAttribute("specialBackgroundColor")) {
		$(obj).css("background-color","");
		obj.removeAttribute("specialBackgroundColor");
	}
}

/**
 * 校验失败设置输入框边框颜色（如果边框本身不显示不受影响）。通过在输入域增加属性：needSpecialBorderColor="false"即可关闭该处理。
 * @param obj 输入域Element
 */
function setValidationErrorSpecialBorderColor(obj) {
	if(obj && (!obj.getAttribute("needSpecialBorderColor") || "false" != obj.getAttribute("needSpecialBorderColor"))) {
		$(obj).css("border-color","red");
		obj.setAttribute("specialBorderColor", "true");
	}
}

/**
 * 清除设置的输入域边框颜色。如果输入域设置了needSpecialBorderColor="false"或者框架未改变默认的边框颜色，则不做处理。
 * @param obj 输入域Element
 */
function clearValidationErrorSpecialBorderColor(obj) {
	if(obj && (!obj.getAttribute("needSpecialBorderColor") || "false" != obj.getAttribute("needSpecialBorderColor"))
			&& obj.getAttribute("specialBorderColor")
			&& "true" == obj.getAttribute("specialBorderColor")) {
		$(obj).css("border-color","");
		obj.removeAttribute("specialBorderColor");
	}
}

/**
 * 热点离开输入域时，执行的方法。
 * @param obj
 */
function inputCheckAndHideErrorMessageTips(obj) {
	// 加载输入域校验方法
    inputCheck(obj);
    // 点击空白区域隐藏提示信息小气泡
    //document.body.setAttribute("onclick", "hideErrorMessageTips()");
}

function inputCheck(obj) {
	if (isIgnore(obj)) {
		clearAllValidationErrorHandle(obj);
		return true;
	}
	// 当input标签没有optional属性或optional=“false”时都校验是否为空
	if (!obj.getAttribute("optional") || obj.getAttribute("optional") == "false") {
		if (!emptyChecker(obj)) {
			return false;
		}
	}
	// 校验输入域长度
	if(obj.getAttribute("limitLength") && obj.value) {
		if(!checkLength(obj)) {
			return false;
		}
	}
	if (obj.value != "" && obj.getAttribute("checkRegExp")) {
		if (!formatChecker(obj)) {
			return false;
		}
	}
	// 添加自定义实时校验
	if (obj.getAttribute("extraFunction")) {
		if(!eval(obj.getAttribute("extraFunction"))){
			return false;
		}
	}
	clearAllValidationErrorHandle(obj);
	return true;
}

/**
 * 输入域内容长度校验器
 * @param obj 输入域Element
 * @returns {Boolean}
 */
function checkLength(obj) {
	if(obj.getAttribute("limitLength") && obj.value) {
		var currentValueLength = getStrLength(obj.value);
		var limitLength = obj.getAttribute("limitLength");
		var limitLengthArr = limitLength.split(",");
		if(limitLengthArr.length > 1) {
			if(currentValueLength >= parseInt(limitLengthArr[0]) && currentValueLength <= parseInt(limitLengthArr[1])) {
				return true;
			} else {
				validationErrorHandle(obj, getElementErrorMessage(obj, "length", "您只能输入长度为" + limitLengthArr[0] + "-" + limitLengthArr[1] + "位的内容。"));
				return false;
			}
		} else {
			if(currentValueLength != limitLength) {
				validationErrorHandle(obj, getElementErrorMessage(obj, "length", "该输入项固定内容长度为" + limitLengthArr[0] + "位。"));
				return false;
			} else {
				return true;
			}
		}
	}
}

/**
 * 检查字符串长度，一个中文字符长度为2，英文字符长度为1
 * @param checkStr 待检查的字符串
 * @returns {Number}
 */
function getStrLength(checkStr) {
	var regExp = "[^\x00-\xff]";
	var length = 0;
	
	for (var i = 0; i < checkStr.length; i ++) {
		if(new RegExp(regExp).test(checkStr[i])) {
			length = length + 2;
		} else {
			length = length + 1;
		}
	}
	
	return length;
}

/**
 * 判断元素是否忽略校验：当输入域包含元素ignore="true"或者本身输入域不显示在页面时不会加载校验方法
 * @param obj 输入域Element
 * @returns {Boolean}
 */
function isIgnore(obj) {
	if ((obj.getAttribute("ignore") && obj.getAttribute("ignore") == "true") || !isDisplay(obj)) {
		return true;
	} else {
		return false;
	}
}

/**
 * 判断元素父级元素是否为显示
 * true-显示，false-隐藏
 * @param obj 输入域Element
 * @returns
 */
function isDisplay(obj) {
	if ($(obj).parent().is("body")) return true;
	if ($(obj).is(":visible")) {
		return isDisplay(obj.parentNode);
	} else {
		return false;
	}
}

/**
 * 输入域非空校验器
 * @param obj 输入域Element
 * @returns {Boolean}
 */
function emptyChecker(obj) {
	if (obj.type == "radio") {
		
	} else {
		if (!obj.value || checkIsNullOrEmpty(trim(obj.value))) {
			var reg = "[^\s]$";
			if (obj.value.match(reg)) {
				validationErrorHandle(obj, getElementErrorMessage(obj, "empty"));
			} else {
				validationErrorHandle(obj, getElementErrorMessage(obj, "empty"));
			}
			
			return false;
		}
	}
	return true;
}

/**
 * 删除左右两端的空格
 * @param str 待处理的字符串
 * @returns 处理完成的字符串
 */
function trim(str) {
	if(!checkIsNullOrEmpty(str)) {
		return str.replace(/(^\s*)|(\s*$)/g, "");
	} else {
		return str;
	}
}

/**
 * 输入域格式校验器
 * @param obj 输入域Element
 * @returns {Boolean}
 */
function formatChecker(obj) {
	var checkRegExpValue = checkRegExp[obj.getAttribute("checkRegExp")];
	if(!checkRegExpValue) {
		checkRegExpValue = obj.getAttribute("checkRegExp");
	}
	var testReg = new RegExp(checkRegExpValue);
	var result = testReg.test(obj.value);
	if (!result) {
		validationErrorHandle(obj, getElementErrorMessage(obj, "regExp"));
		return false;
	}
	return true;
}

/**
 * 判断页面所有需要校验的输入域是否都校验成功。一般在提交的时候需要调用一下该方法。
 * @returns
 */
function pageFieldsChecker() {
	var inputs = document.getElementsByTagName("input");
	//document.body.setAttribute("onclick", "javascript:void(0)");
	var inputFileds = [];
	var radioAndCheckboxFileds = [];
	for (var i = 0; i < inputs.length; i++) {
		if(inputs[i]) {
			var currentType = inputs[i].type;
			if (currentType == "text" || currentType == "number" || currentType == "password" || currentType == "date" || currentType == "search") {
				inputFileds.push(inputs[i]);
			} else if (currentType == "radio" || currentType == "checkbox") {
				radioAndCheckboxFileds.push(inputs[i]);
			} else {}
		}
	}
	for (var i = 0; i < inputFileds.length; i++) {
		if (!inputCheck(inputFileds[i])) {
			return false;
		}
	}
	var textareas = document.getElementsByTagName("textarea");
	for (var i = 0; i < textareas.length; i++) {
		if (!inputCheck(textareas[i])) {
			return false;
		}
	}
	if(radioAndCheckboxFileds && radioAndCheckboxFileds.length > 0) {
		return radiosAndCheckboxsChecker(radioAndCheckboxFileds);
	}
	return true;
}

/**
 * 单选和多选校验器
 * @param elements 所有的单选和多选输入域Element集合
 * @returns {Boolean}
 */
function radiosAndCheckboxsChecker(elements) {
	var handledData = {};
	var needCheckEleNamesArray = [];
	var doNotNeedCheckEleNamesData = {};
	var emptyNameElementCount = 0;
	var checkResult = false;
	for(var i = 0; i < elements.length; i ++) {
		var elementName = elements[i].getAttribute("name");
		if(!elementName) {
			elementName = "emptyNameElement" + emptyNameElementCount;
			emptyNameElementCount ++;
		}
		if(doNotNeedCheckEleNamesData[elementName]) {
			continue;
		}
		if (elements[i].getAttribute("optional") && elements[i].getAttribute("optional") == "true") {
			doNotNeedCheckEleNamesData[elementName] = 1;
			if(handledData[elementName] && handledData[elementName].length > 0) {
				handledData[elementName] = [];
			}
			continue;
		}
		if(handledData[elementName]) {
			handledData[elementName].push(elements[i]);
		} else {
			var tempArray = [];
			tempArray.push(elements[i]);
			handledData[elementName] = tempArray;
		}
		needCheckEleNamesArray.push(elementName);
	}
	
	for(var i = 0; i < needCheckEleNamesArray.length; i ++) {
		var elementsList = handledData[needCheckEleNamesArray[i]];
		if(elementsList && elementsList.length > 0) {
			var currentListIsChecked = false;
			for(var j = 0; j < elementsList.length; j ++) {
				currentListIsChecked = elementsList[j].checked;
				if(currentListIsChecked) {
					break;
				} else {
					continue;
				}
			}
			if(!currentListIsChecked) {
				validationErrorHandle(elementsList[0], getElementErrorMessage(elementsList[0], "empty"));
				return false;
			}
		}
	}
	return true;
}

/**
 * 错误提示信息内容公共处理方法
 * @param element 输入域Element
 * @param errorType 错误类型
 * @param defaultExtraErrorMessage 默认错误提示信息之后需要增加额外的内容，会在默认的信息后面增加。
 * @returns
 */
function getElementErrorMessage(element, errorType, defaultExtraErrorMessage) {
	if(element) {
		if(errorType == "regExp") {
			var regExpErrorTip = element.getAttribute("regExpErrorTip");
			if(!regExpErrorTip && element.getAttribute("checkRegExp")) {
				regExpErrorTip = errorMessage[element.getAttribute("checkRegExp")]
			}
			if(!regExpErrorTip) {
				if(defaultExtraErrorMessage) {
					regExpErrorTip = ErrorMessageDefaults.regExp.inputText + defaultExtraErrorMessage;
				} else {
					regExpErrorTip = ErrorMessageDefaults.regExp.inputText;
				}
			}
			return regExpErrorTip;
		} else if(errorType == "empty") {
			var emptyErrorTip = element.getAttribute("emptyErrorTip");
			if(!emptyErrorTip) {
				var elementType = element.getAttribute("type");
				if(elementType && (elementType == "radio" || elementType == "checkbox")) {
					if(defaultExtraErrorMessage) {
						emptyErrorTip = ErrorMessageDefaults.empty.radioOrCheckbox + defaultExtraErrorMessage;
					} else {
						emptyErrorTip = ErrorMessageDefaults.empty.radioOrCheckbox;
					}
				} else {
					if(defaultExtraErrorMessage) {
						emptyErrorTip = ErrorMessageDefaults.empty.inputText + defaultExtraErrorMessage;
					} else {
						emptyErrorTip = ErrorMessageDefaults.empty.inputText;
					}
				}
			}
			return emptyErrorTip;
		} else if(errorType == "length") {
			var lengthErrorTip = element.getAttribute("lengthErrorTip");
			if(!lengthErrorTip) {
				if(defaultExtraErrorMessage) {
					lengthErrorTip = ErrorMessageDefaults.length.inputText + defaultExtraErrorMessage;
				} else {
					lengthErrorTip = ErrorMessageDefaults.length.inputText;
				}
			}
			return lengthErrorTip;
		} else {
			return ErrorMessageDefaults.defaultText;
		}
	} else {
		return ErrorMessageDefaults.defaultText;
	}
}

/**
 * 非空判断
 * @param obj 判断的对象
 */
function checkIsNullOrEmpty(obj) {
	if(typeof(obj) == "number" && 0 == obj) {
		return false;
	} else {
		if(obj) {
			return false;
		} else {
			return true;
		}
	}
}
