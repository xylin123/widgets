
/**
 * 使用方法
 * var cd = new CD();
 * var opt = {
 * 		totalTime: 30,		: 总时间,s为单位.
 *		rate: 1000, 渲染时间间隔 ms为单位
 *		renderFunc: function(){...}, 	: 渲染方法 fn( H, m, s)
 *		callback: function(){...}		: 倒计时 到点回调
 * }
 * cd.init(opt, cd.CW);   cd.CW 计时器／ cd.CCW 倒计时
 * cd.run(); 运行
 * cd.parse(); 暂停
 * cd.addTime(30); 增加时间
 * 
 */
function CD(){

  //	顺时针 : 计时器
  this.CW = "CLOCKWISE";

  //	逆时针 : 倒计时器
  this.CCW = "COUNTERCLOCKWISE";

  var 

    //	渲染方法定时器ID
    RENDER_ID,

    //	渲染间隔  单位:ms 默认为1000ms
    RATE = 1000,

    //	已过时间  单位:ms
    ELAPSED_TIME,

    //	总时间  单位:s
    TOTAL_TIME,

    //	当前时间	单位:ms
    CURRENT_TIME,

    //	目标时间  单位:ms
    TARGET_TIME,

    //	渲染方法
    RENDER_FUNC,

    //	是否第一次运行
    isFirstRun = true,

    //	成功回调函数
    CALLBACK_FUNC = function(){
      console.log("TIME OUT");
    },

    //	时钟类型
    TYPE;

  /**
   * 	opt : {
   *		totalTime,		: 总时间,s为单位.
   *		rate,			: 渲染时间间隔 ms为单位
   *		renderFunc, 	: 渲染方法 fn( H, m, s)
   *		callback,		: 倒计时 到点回调
   *	}
   *	type : 规定初始化为 计时器 : "CLOCKWISE" / 倒计时 : "COUNTERCLOCKWISE"
  */
  this.init = function(opt, type) { 
    if (type == this.CCW) {
      if (!opt) {
        console.log("OPTIONS IS UNDEFINED");
        return;
      } else if (!opt.totalTime) {
        console.log("DON'T HAVE TOTAL TIME");
        return;
      } else if (!opt.renderFunc || (typeof opt.renderFunc) != "function") {
        console.log("DON'T HAVE RENDER FUNCTION");
        return;
      }

      RENDER_FUNC = opt.renderFunc;
      CALLBACK_FUNC = (!opt.callback || (typeof opt.callback) != "function") ? CALLBACK_FUNC : opt.callback;
      RATE = opt.rate ? opt.rate : RATE ;
      TOTAL_TIME = opt.totalTime;

      isFirstRun = true;

      clearInterval(RENDER_ID);

      TYPE = type;

    }else if (type == this.CW) {
      if (!opt) {
        console.log("OPTIONS IS UNDEFINED");
        return;
      } else if (!opt.renderFunc || (typeof opt.renderFunc) != "function") {
        console.log("DON'T HAVE RENDER FUNCTION");
        return;
      }

      RENDER_FUNC = opt.renderFunc;
      RATE = opt.rate ? opt.rate : RATE;
      ELAPSED_TIME = 0;

      clearInterval(RENDER_ID);

      TYPE = type;

    } else {
      console.log("DON'T HAVE TYPE");
      return;
    }


  };

  /**
   * 
   */
  this.pause = function() {
    
    if (TYPE === this.CCW) {
      isFirstRun = true;
      TOTAL_TIME = (TARGET_TIME - (new Date()).getTime()) / 1000;
    } else {
      isFirstRun = true;
      ELAPSED_TIME = (new Date().getTime()) - CURRENT_TIME;
    }

    clearInterval(RENDER_ID);

  };

  /**
   * 
   */
  this.run = function() {

    if (isFirstRun && TYPE === this.CCW) {
      TARGET_TIME = (new Date()).getTime() + TOTAL_TIME * 1000;
    } else if (isFirstRun && TYPE === this.CW) {
      CURRENT_TIME = (new Date()).getTime() - ELAPSED_TIME;
    }

    isFirstRun = false;
    this.render();

  };

  /**
   * 
   */
  this.addTime = function(t) {//这里只对 秒钟 的计时器做加减		
    TARGET_TIME = TARGET_TIME + t * 1000;
  };

  /**
   * 
   */
  this.render = function() {
    var obj = {};
    var T;
    if (TYPE === this.CCW) {
      T = Math.round((TARGET_TIME - (new Date()).getTime()) / 1000);
      obj.H = Math.floor( T / 3600 );
      obj.m = Math.floor( T % 3600 / 60 );
      obj.s = Math.floor( T % 3600 % 60 );
      RENDER_FUNC( obj.H, obj.m, obj.s);
      RENDER_ID = setInterval(function() {
        T = Math.round((TARGET_TIME - (new Date()).getTime()) / 1000);
        obj.H = Math.floor( T / 3600 );
        obj.m = Math.floor( T % 3600 / 60 );
        obj.s = Math.floor( T % 3600 % 60 );
        RENDER_FUNC( obj.H, obj.m, obj.s);
        if( T  === 0 ){
          clearInterval(RENDER_ID);
          CALLBACK_FUNC();
        }
      },RATE);
    }else if(TYPE === this.CW) {
      T = Math.round(((new Date()).getTime() - CURRENT_TIME) / 1000);
      obj.H = Math.floor( T / 3600 );
      obj.m = Math.floor( T % 3600 / 60 );
      obj.s = Math.floor( T % 3600 % 60 );
      RENDER_FUNC( obj.H, obj.m, obj.s );
      RENDER_ID = setInterval(function() {
        T = Math.round(((new Date()).getTime() - CURRENT_TIME) / 1000);
        obj.H = Math.floor( T / 3600 );
        obj.m = Math.floor( T % 3600 / 60 );
        obj.s = Math.floor( T % 3600 % 60 );
        RENDER_FUNC( obj.H, obj.m, obj.s);
      }, RATE);
    }
  };
}
