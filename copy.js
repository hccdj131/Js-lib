//浅拷贝
var father1 = {name:'shangdi',age:1000,job:['teacher','cook']};
//浅拷贝函数
function copy(obj){
	var childs = {};
	for(var key in obj){
		childs[key] = obj[key];
	}
	return childs;
}
var child1 = copy(father1);
console.log(child1);  //{name:'shangdi',age:1000}
console.log(typeof child1); //object

//改变子对象的name属性，发现对父对象的name没有影响
child1.name = 'bangbang';
console.log(father1);  //{ name:'shangdi', age: 1000}
console.log(child1); //{ name:'bangbang', age: 1000}

child1.job.push('programer');
console.log(father1); // { name: 'shangdi, age: 1000,job:['teacher,'cook','programer']}
console.log(child1); // { name: 'shangdi, age: 1000,job:['teacher,'cook','programer']}

//浅拷贝的时候，当我们改变子对象的数组的时候，父对象竟然也跟着改变，也就是说：子对象和父对象在浅拷贝的
//时候他们指向同一个内存

// 想让子对象和父对象没有一点关联，用深拷贝

function deepCopy(obj) {
	var o;
	switch(typeof obj){
		case 'undefined': break;
		case 'string'	  : o = obj + '';break;
		case 'number'   : o = obj - 0; break;
		case 'boolean'  :o = obj;break;
		case 'object'   :
			if(obj === null) {
				o = null;
			}else{
				if(obj instanceof Array){
					o = [];
				}else{
					if(obj instanceof Array){
						o = [];
						for(var i = 0, len = obj.length; i < len; i++){
							o.push(deepCopy(obj[i]));
						}
					}else{
						o = {};
						for(var k in obj){
							o[k] = deepCopy[k];
						}
					}
				}
				break;
			default:
				o = obj;break;
			}
			return o;
	}
}

//最简单的
function deepCopy(obj){
	return JSON.parse(JSON.stringify(obj));
}