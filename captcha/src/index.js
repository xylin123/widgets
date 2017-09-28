var captcha = function(){

  // 验证码编号
  var ID_CODE_NO = "";

  // code DOM
  var codeDOMs = [];

  // line DOM
  var lineDOMs = [];

  var DOM ;

  // 定义使用的验证码字符串 length: 36.
  var VALUE = [
    'a','b','c','d','e','f','g','h','i','j',
    'k','l','m','n','o','p','q','r','s','t',
    'u','v','w','x','y','z','0','1','2','3',
    '4','5','6','7','8','9'
  ];

  // 默认的配置信息
  var DEFAULT_OPTION = {
    len: 4,
    fontSizeMin: 20,
    fontSizeMax: 30,
    fontColors: [
      "green",
      "red",
      "blue",
      "#53da33",
      "#AA0000",
      "#FFBB00"
    ],
    bgColor: "#fff",
    fonts: [
      "Times New Roman",
      "Georgia",
      "Serif",
      "sans-serif",
      "arial",
      "tahoma",
      "Hiragino Sans GB"
    ],
    needLine: true,
    lines: 6,
    lineColors: [
      "#888888",
      "#FF7744",
      "#888800",
      "#008888"
    ],
    lineHeightMin: 1,
    lineHeightMax: 3,
    lineWidthMin: 1,
    lineWidthMax: 60,
  }

  // 获得随机数
  var randInt = function(min,max){
    var differ = max - min +1;
    var num = Math.random() * differ + min;
    return  Math.floor(num);
  }

  // 生成code
  var createCode = function(dom){
    ID_CODE_NO = "";
    codeDOMs = [];
    var codeDOM;

    for(var i = 0; i < DEFAULT_OPTION.len ; i ++){
      var key = randInt(0,35);
      ID_CODE_NO = ID_CODE_NO + VALUE[key];
      var isUppercase = randInt(0,9) < 5;

      if( isUppercase && key < 26){
        codeDOM = creatCodeDOM(VALUE[key].toUpperCase(),i);
        codeDOMs.push(codeDOM);
        dom.appendChild(codeDOM);
      }else{
        codeDOM = creatCodeDOM(VALUE[key],i);
        codeDOMs.push(codeDOM);
        dom.appendChild(codeDOM);
      }
      
    }

  }

  // 创建单个验证码的dom
  var creatCodeDOM = function(code, index){
    var thisCodeDOM = document.createElement('span');

    thisCodeDOM.style.cssText = [
      "font-size:" + randInt(DEFAULT_OPTION.fontSizeMin, DEFAULT_OPTION.fontSizeMax) + "px",
      "color:" + DEFAULT_OPTION.fontColors[randInt(0, DEFAULT_OPTION.fontColors.length - 1)],
      "position: absolute",
      "left:" + randInt(DEFAULT_OPTION.unitW * index, DEFAULT_OPTION.unitW *  index + DEFAULT_OPTION.unitW - 10) + "px",
      "top:" + randInt(0, DEFAULT_OPTION.domHeight - 30) + "px",
      "transform:rotate(" + randInt(-30, 30) + "deg)",
      "-ms-transform:rotate(" + randInt(-30, 30) + "deg)",
      "-moz-transform:rotate(" + randInt(-30, 30) + "deg)",
      "-webkit-transform:rotate(" + randInt(-30, 30) + "deg)",
      "-o-transform:rotate(" + randInt(-30, 30) + "deg)",
      "font-family:" + DEFAULT_OPTION.fonts[randInt(0, DEFAULT_OPTION.fonts.length - 1)],
      "font-weight:" + randInt(400, 900)
    ].join(";");

    thisCodeDOM.innerHTML = code;

    return thisCodeDOM;
  }

  // 画线
  var createLines = function(dom){
    lineDOMs = [];
    for(var i=0; i<DEFAULT_OPTION.lines; i++){
      var thisLineDOM = document.createElement("div");

      thisLineDOM.style.cssText = [
          "position: absolute",
          "opacity: " + randInt(3, 8) / 10,
          "width:" + randInt(DEFAULT_OPTION.lineWidthMin, DEFAULT_OPTION.lineWidthMax) + "px",
          "height:" + randInt(DEFAULT_OPTION.lineHeightMin, DEFAULT_OPTION.lineHeightMax) + "px",
          "background: " + DEFAULT_OPTION.lineColors[randInt(0, DEFAULT_OPTION.lineColors.length - 1)],
          "left:" + randInt(0, DEFAULT_OPTION.domWidth - 20) + "px",
          "top:" + randInt(0, DEFAULT_OPTION.domHeight) + "px",
          "transform:rotate(" + randInt(-30, 30) + "deg)",
          "-ms-transform:rotate(" + randInt(-30, 30) + "deg)",
          "-moz-transform:rotate(" + randInt(-30, 30) + "deg)",
          "-webkit-transform:rotate(" + randInt(-30, 30) + "deg)",
          "-o-transform:rotate(" + randInt(-30, 30) + "deg)",
          "font-family:" + DEFAULT_OPTION.fonts[randInt(0, DEFAULT_OPTION.fonts.length - 1)],
          "font-weight:" + randInt(400, 900)
      ].join(";");
      dom.appendChild(thisLineDOM);
      lineDOMs.push(thisLineDOM);
    }
  }

  //  初始化配置信息
  var initOption = function(options){
    if(typeof options === "object"){
      for(i in options){
        DEFAULT_OPTION[i] = options[i];
      }
    }
  }

  // 点击刷新事件
  var addClickEvent = function(dom){
    dom.addEventListener('click',function(){
      for(var i = 0; i < codeDOMs.length; i++){
        dom.removeChild(codeDOMs[i]);
      }
      createCode(dom);
      if(DEFAULT_OPTION.needLine){
        for(var j =0; j < lineDOMs.length; j++){
          dom.removeChild(lineDOMs[j]);
        }
        createLines(dom);
      }

      
    },false)
  }

  // 掩盖函数
  var mask = function(dom){
    var maskDOM = document.createElement('div');
    maskDOM.style.cssText = [
      "width: 100%",
      "height: 100%",
      "left: 0",
      "top: 0",
      "position: absolute",
      "cursor: pointer",
      "z-index: 9999"
    ].join(";");

    maskDOM.title = "点击更换验证码";
    dom.appendChild(maskDOM);
  }

  // 初始化dom框
  var initDom = function(dom){
    dom.style.border = "1px solid gray";
    dom.style.position = "relative";
    dom.style.overflow = "hidden";
    dom.style.cursor = "pointer";
    dom.title = "点击更换验证码";
    dom.style.background = DEFAULT_OPTION.bgColor;


    DEFAULT_OPTION.domHeight = dom.clientHeight;
    DEFAULT_OPTION.domWidth = dom.clientWidth;
    DEFAULT_OPTION.unitW = DEFAULT_OPTION.domWidth / DEFAULT_OPTION.len;
  }
  
  return {
    init: function(eleId,option){
      initOption(option);
      var dom = document.getElementById(eleId);
      DOM = dom;
      initDom(dom);
      createCode(dom);
      if(DEFAULT_OPTION.needLine){
        createLines(dom);
      }
      mask(dom);
      addClickEvent(dom);
    },
    update: function(){
      for(var i = 0; i < codeDOMs.length; i++){
        DOM.removeChild(codeDOMs[i]);
      }
      createCode(DOM);
      if(DEFAULT_OPTION.needLine){
        for(var j =0; j < lineDOMs.length; j++){
          DOM.removeChild(lineDOMs[j]);
        }
        createLines(DOM);
      }
    },
    validate: function(val){
      var flag = (ID_CODE_NO == val);
      return flag;
    }
  }
}
