常用的几种对象创建模式
使用new关键字创建
最基础的对象创建方式，无非就是和其他多数语言一样说的一样：没对象，你new一个呀！

var gf = new Object();
gf.name = "tangwei";
gf.bar = "c++";
gf.sayWhat = function() {
    console.log(this.name + "said:love u");
}

使用字面量创建
这样似乎妥妥的了，但是宅寂的geek们岂能喜欢如此复杂和low土的定义变量的方式，作为一门脚本语言那应该有和其他兄弟们一样的范儿，于是出现了对象字面量的定义方式：

var gf = {
    name: "tangwei",
    bar: "c++",
    sayWhat: function() {
        console.log(this.name + "said: love you");
    }
}

工厂模式
实际上这是我们在实际中最常用的对象定义方式，但是我要有好多拥有相似属性的对象（想想都让人激动。。。）怎么办呢？那要是一个个的定义，就会产生大量的代码，何不建个工厂，批量的生产出我们的对象呢，于是，javascript“工厂模式”诞生了！

function createGf(name, bar) {
    var o = new Object();
    o.name = name;
    o.bar = bar;
    o.sayWhat = function () {
        alert(this.name + "said: love you");
    }
    return o;
}
var gf1 = createGf("bingbing", "d");
var gf2 = createGf("mimi", "a");

构造函数
工厂模式解决了多个相似对象的创建问题，但是问题又来了，这些对象都是Object整出来的，怎么区分它们的对象具体类型呢？这时候我们就需要切换到另一种模式了，构造函数模式：

function Gf(name,bar) {
    this.name = name;
    this.bar = bar;
    this.sayWhat = function () {
        alert(this.name + "said: love you");
    }
}
var gf1 = new Gf("vivian", "f");
var gf1 = new Gf("vivian2", "f");

这里我们使用一个大写字母开头的构造函数替代了上例中的createGf，注意按照约定构造函数的首字母要大写。在这里我们创建一个新对象，然后将构造函数的作用域赋给新对象，调用构造函数中的方法。
上面的方式似乎没什么不妥，但是我们可以发现，两个实例中调用的构造函数中的sayWhat方法不是同一个Function实例：
console.log(gf1.sayWhat == gf2.sayWhat); //false

调用同一个方法，却声明了不同的实例，实在浪费资源。我们可以优化一下将sayWhat函数放到构造函数外面声明：
function Gf(name,bar){
  this.name = name;
  this.bar = bar;
  this.sayWhat = sayWhat
}
function sayWhat(){
  alert(this.name + "said:love you forever");
}

这样解决了，多个实例多次定义同一个方法实例的问题，但是新问题又来了，我们定义的sayWhat是一个全局作用域的方法，但这个方法其实是没法直接调用的，这就有点矛盾了。如何更优雅的定义一个具备一定封装性的对象呢？我们来看一下javascript原型对象模式。
原型对象模式
理解原型对象
当我们创建一个函数时，该函数就会具备一个prototype属性，这个属性指向通过构造函数创建的那个函数的原型对象。通俗点讲原型对象就是内存中为其他对象提供共享属性和方法的对象。

在原型模式中，不必再构造函数中定义实例属性，可以将属性信息直接赋予原型对象：

function Gf() {
    Gf.prototype.name = "vivian";
    Gf.prototype.bar = "c++";
    Gf.prototype.sayWhat = function () {
        alert(this.name + "said: love you");
    }
}
var gf1 = new Gf();
gf1.sayWhat();
var gf2 = new Gf();

和构造函数不同的是这里新对象的属性和方法是所有实例都可以共享的，换句话说gf1和gf2访问的是同一份属性和方法。原型对象中除了我们赋予的属性外，还有一些内置的属性，所有原型对象都具备一个constructor属性，这个属性是一个指向包含prototype属性函数的一个指针（敢不敢再绕点！）。通过一幅图我们来清楚的理一下这个绕口的流程：

所有的对象都有一个原型对象（prototype），原型对象中有一个constructor属性指向包含prototype属性的函数，Gf的实例gf1和gf2都包含一个内部属性指向原型对象（在firefox浏览器中表现为私有属性proto），当我们访问一个对象中的属性时，首先会询问实例对象中有没有该属性，如果没有则继续查找原型对象。
使用原型对象
在前面的示例中，我们注意到在为原型对象添加属性时，需要每个都增加Gf.prototype，这个工作很重复，在上面对象的创建模式中，我们知道可以通过字面量的形式创建一个对象，这里我们也可以改进一下：

function Gf() {}
Gf.prototype = {
    name: "vivian",
    bar: "c++",
    sayWhat: function () {
        alert(this.name + "said: love you");
    }
}

这里有一个地方需要特别注意下，constructor属性不再指向对象Gf，因为每定义一个函数，就会同时为其创建一个prototype对象，这个对象也会自动获取一个新的constructor属性，这个地方我们使用Gf.prototype本质上覆写了原有的prototype对象，因此constructor也变成了新对象的constructor属性，不再指向Gf，而是Object:
var gf1 = new Gf();
console.log(gf1.constructor == Gf);//false
console.log(gf1.constructor == Object)//true
一般情况下，这个微妙的改变是不会对我们造成影响的，但如果你对constructor有特殊的需求，我们也可以显式的指定下Gf.prototype的constructor属性：

Gf.prototype = {
    constructor: Gf,
    name: "vivian",
    bar: "c++",
    sayWhat: function () {
        alert(this.name + "said: love you");
    }
}
var gf1 = new Gf();
console.log(gf1.constructor == Gf);//true

通过对原型对象模式的初步了解，我们发现所有的实例对象都共享相同的属性，这是原型模式的基本特点，但往往对于开发者来说这是把“双刃剑”，在实际开发中，我们希望的实例应该是具备自己的属性，这也是在实际开发中很少有人单独使用原型模式的主要原因。
构造函数和原型组合模式
在实际开发中，我们可以使用构造函数来定义对象的属性，使用原型来定义共享的属性和方法，这样我们就可以传递不同的参数来创建出不同的对象，同时又拥有了共享的方法和属性。

function Gf(name,bar) {
    this.name = name;
    this.bar = bar;
}
Gf.prototype = {
    constructor: Gf,
    sayWhat: function () {
        alert(this.name + "said: love you");
    }
}
var gf1 = new Gf("vivian", "f");
var gf2 = new Gf("cici", "c");