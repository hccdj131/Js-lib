// 获取url后面的参数并变为对象

(function() {

	var urlToObject = function(url) {
		var urlObject = {};
		if (/\?/.test(url)) {
			var urlString = url.substring(url.indexOf("?")+1);
			var urlArray = urlString.split("&");
			for (var i=0, len=urlArray.length; i<len; i++) {
				var urlItem = urlArray[i];
				var item = urlItem.split("=");
				urlObject[item[0]] = item[1];
			}
		return urlObject;
		}
	};

	var testUrl = "http://tools.jb51.net/index.php?key0=0&key1=1&key2=2";
	var result = urlToObject(testUrl);
	for (var key in result) {
		alert(key + "=" + result[key]);
	}
})();

// 如何获取UA?
function whatBrowser() {
	document.Browser.Name.value=navigator.appName;
	document.Browser.Version.value=navigator.appVersion;
	document.Browser.Code.value=navigator.appCodeName;
	document.Browser.Agent.value=navigator.userAgent;
}

//水平竖直居中
//1.使用flex
.parent {
	display: flex;
	justify-content: center;
	align-items: center;
}
//2.使用transform
.parent {
	position: relative;
}

.child {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

//链式调用
_$.prototype = {
	each:function(fn){
		for(var i=0,len=this.elements.length;i<len;i++){
			fn.call(this,this.elements[i]);
		}
		return this;
	},

	show:function(prop,val){
		var that = this;
		this.each(function(el){
			that.setStyle("display","block");
		});
		return this;
	},
}

//localStorage
//判断浏览器是否支持
if(window.localStorage){
	alert("浏览器支持localStorage")
}
else{
	alert("浏览器不支持localStorage")
}

//setItem存储value
sessionStorage.setItem("key", "value");
localStorage.setItem("site", "js8.in");

//getItem获取value
var value = sessionStorage.getItem("key");
var site = localStorage.getItem("site");

//remove删除Key
sessionStorage.removeItem("key");
localStorage.removeItem("site");

//clear清楚所有的Key/value
sessionStorage.clear();
localStorage.clear();

//localStorage和sessionStorage的key和length属性实现遍历
var storage = window.localStorage;
for (var i=0, len = storage.length; i < len; i++){
	var key = storage.key(i);
	var value = storage.getItem(key);
	console.log(key + "=" + value);
}

//form 表单
/*
<form action="" method='post'>
<label for="username">Create a username</label>
<input type="text" name="username" id="username" placeholder="..." pattern="[A-Za-z]{4,10}" autofocus required>
<button type="submit">Go</button>
</form>
*/

//Cookie的读取，set和删除
var CookieUtil = {
	get:function(name){
		var cookieName = encodeURIComponent(name) + "=",
		cookieStart = document.cookie.indexOf(cookieName),
		cookieValue = null;

		if(cookieStart>-1){
			var cookieEnd = document.cookie.indexOf(";",cookieStart);
			if(cookieEnd == -1){
				cookieEnd = document.cookie.length;
			}

			cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length,cookieEnd));
		}
		return cookieValue;
	},
	set:function(name,value,expires,path,domain,secure){
		var cookieText = encodeURIComponent(name) + "="+encodeURIComponent(value);
		if(expires instanceof Date){
			cookieText += "; expires" + expires.toGMTString();
		}
		if(path){
			cookieText += "; path=" + path;
		}
		if(domain){
			cookieText += "; domain" + domain;
		}
		if(secure){
			cookieText += "; secure";
		}
		document.cookie = cookieText;
	},

	unset:function(name,path,domain,secure){
		this.set(name,"",new Date(0),path,domain,secure);
	}
};

//HTML5 window.postMessage方法来跨域传送数据
// 这是页面http://test.com/a.html的代码
<script>
function onLoad() {
	var iframe = document.getElementById('iframe');
	var win = iframe.contentWindow; //获取window对象
	win.postMessage('我是来自页面a的消息','*'); //向不同域的http://www.test.com/b.html页面发送消息
}
</script>
<iframe id="iframe" src="http://www.test.com/b.html" onload="onLoad()"></iframe>

// 这是页面http://www.test.com/b.html的代码

window.onmessage = function(e) { //注册message事件用来接收消息
	e = e || event; //获取事件对象
	alert(e.data); //通过data属性得到传送的消息
}

JS继续
//原型链模式
//父类
function person(){
	this.hair = 'black';
	this.eye = 'black';
	this.skin = 'yellow';
	this.view = function(){
		return this.hair + ',' + this.eye + ',' + this.skin;
	}
}

//子类
function man(){
	this.feature = ['beard','strong'];
}

//继承父类
man.prototype = new person();

//新的实例
var one = new man();