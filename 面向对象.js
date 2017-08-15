//简单的面向对象
var obj=new Object();

obj.name='blue';
obj.qq='258248832';

obj.showName=function () {
	alert('我的名字叫： '+this.name);
};

obj.showQQ=function () {
	alert('我的QQ号：'+this.qq);
};

obj.showName();
obj.showQQ();

//构造函数
function createPerson(name, qq){     //传进参数

	//原料
	var obj=new Object();

	//加工
	obj.name=name;
	obj.qq='qq';

	obj.showName=function () {
		alert('我的名字叫： '+this.name);
	};

	obj.showQQ=function () {
		alert('我的QQ号：'+this.qq);
	};

	//出厂
	return obj;
}

var obj=createPerson('blue', '2423423423');

obj.showName();
obj.showQQ();

var obj2=createPerson('张三', '2343424234');

obj2.showName();
obj2.showQQ();

//工厂方式问题
//没有new
//函数重复定义

//new 的函数
//偷偷做了两件事
//替你创建了一个空白对象
//替你返回了这个对象

function createPerson(name, qq){

	//加工
	this.name=name;
	this.qq=qq;

	this.showName=function (){
		alert('我的名字叫：'+this.name);
	};
	this.showQQ=function (){
		alert('我的QQ号：'+this.qq);
	};

	//也会偷偷做一些：
	//return this;
}

var obj=new createPerson('blue', '4545466');
var obj2=new createPerson('张三', '487843136');

obj.showName();

//原型 prototype

var arr1=new Array(12,55,343,343,343);
var arr2=new Array(12,33,1);

Array.prototype.sum=function ()   //类似class
// arr1.sum=function ()           //类似行间样式
{    
	var result=0;

	for(var i=0;i<this.length;i++){
		result+=this[i];
	}	

	return result;
};

alert(arr1.sum());
alert(arr2.sum());

类、对象
类：      模子            不具备实际功能
对象：    产品（成品）    有实际功能

模子
蛋糕

Array   类
arr     对象

用构造函数加属性
用原型加方法

function CreatePerson(name, qq){
	this.name=name;
	this.qq=qq;
}

CreatePerson.prototype.showName=function (){
	alert('我的名字叫：'+this.name);
};

CreatePerson.prototype.showQQ=function (){
	alert('我的名字叫：'+this.name);
}



//改写面向对象程序
window.onload     变成构造函数  //作用：初始化整个程序
全局变量              变成属性
函数              变成方法

函数没有嵌套

改错
this, 事件， 闭包，传参

function TabSwitch()