标签    CSS
元素    JS
节点	DOM

DOM节点

文本节点  
元素节点

获取子节点
childNodes（空点文本节点也算）  数组   
children 也可以，但少用


nodeType	节点类型
nodeType==3   ->文本节点
nodeType==1   ->元素节点

for (var i=0;i<oUL.childNodes.length;i++){
	if(oUL.childNodes[i].nodeType==1){
		oUl.childNodes[i].style.background='red';
	}
}

parentNode	父节点
点击链接，隐藏整个li

offsetParent	
获取元素在页面上的实际位置

function getByClass(oParent, sClass){

	var aResult=[];
	var aEle=oParent.getElementsByTagName('*');

	for(var i=0;i<aEle.length;i++){
		if(aEle[i].className==sClass){
			aResult.push(aEle[i]);
		}
	}

	return aResult;
}

window.onload=function (){
	var oUl=document.getElementById('null');
	var aBox=getByClass(oUl, 'box');

	for(var i=0;i<aBox.length;i++){
		aBox[i].style.background='red';
	}
}
