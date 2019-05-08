
/**
 * 输入登录信息后，按Enter（回车）键执行登录
 */
function keyLogin() {
	var e = window.event || arguments.callee.caller.arguments[0];
	if(e.keyCode == 13){
		login();
	}
}

/**
 * 用户登录方法
 */
function login() {
	// 核对页面输入域数据校验是否通过
	if(!pageFieldsChecker()){
		return;
	}
	
	var userNameInput = document.getElementById("userName");
	var passwordInput = document.getElementById("password");
	//var validationImageCodeInput = document.getElementById("validationImageCodeInput");
	//if (userNameInput && passwordInput && validationImageCodeInput && userNameInput.value && passwordInput.value && validationImageCodeInput.value) {
		if (userNameInput && passwordInput && userNameInput.value && passwordInput.value) {
		var requestObj = {};
		requestObj = {
			user_name:userNameInput.value,
			password:hex_md5(passwordInput.value)
			//password:hex_md5(passwordInput.value),
			//validationImageCode:validationImageCodeInput.value
		};
            // AjaxPost("/api/piosp/user/login", function(data) {
		AjaxPost("/api/toms/operator/login", function(data) {
			if(!isNullOrEmpty(data) && data.ret_code === "00000000") {
				window.top.location.href = "main.html";
                window.localStorage.setItem('userInfo', JSON.stringify(data.result));
			} else {
//				document.getElementById("showErrorMsg").innerHTML = "系统出现异常！";
				if(typeof(data) === "object" && !isNullOrEmpty(data) && !isNullOrEmpty(data.ret_msg)) {
					document.getElementById("showErrorMsg").innerHTML = data.ret_msg;
				} else {
					document.getElementById("showErrorMsg").innerHTML = "系统出现异常！";
				}
			}
		}, requestObj, function(data) {
			if(typeof(data) === "object" && !isNullOrEmpty(data) && !isNullOrEmpty(data.ret_msg)) {
				document.getElementById("showErrorMsg").innerHTML = data.ret_msg;
			} else {
				document.getElementById("showErrorMsg").innerHTML = "系统出现异常！";
			}
			//showValidationImageCode();
		}, true, true);
	}else{
		//document.getElementById("showErrorMsg").innerHTML = "用户名、密码、图形验证码都不能为空！";
		document.getElementById("showErrorMsg").innerHTML = "用户名、密码都不能为空！";
	}
}

/**
 * 图形验证码，刷新图形验证码时会清空图形验证码输入框
 */
function showValidationImageCode() {
	var validationImageCodeEle = document.getElementById("validationImageCode");
	if(validationImageCodeEle) {
		validationImageCodeEle.src = "ValidationImageCode.do?random=" + Math.floor(Math.random() * 100000000);
	}
	var validationImageCodeInputEle = document.getElementById("validationImageCodeInput");
	// 隐藏错误提示信息小气泡
	hideTips(validationImageCodeInputEle);
	if(validationImageCodeInputEle && validationImageCodeInputEle.value) {
		validationImageCodeInputEle.value = "";
	}
}
