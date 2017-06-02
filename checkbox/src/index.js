/**
 * 针对普通列表类的选择。
 * 一次性可生成多个多选框。
 * @author xylin
 */

var index = 1;
/**
 * 一个生成cboxHTML字符串的方法。
 * 
 * @param {any} options 
 * @param {string} uniquecClass 标志class
 * @returns {string} 内容的html字符串
 */
function formatStr(options, uniquecClass) {
  var str = '<div class="gcb-wrap ' + uniquecClass + ' ' + (options.disabled ? 'disabled' : '') + '" >'
    + '<ul>';
  
  options.data.forEach(function(item) {
    str += '<li data-val="' + item[options.valKey] + '" class="' + (item.checked ? 'checked' : '') + '"><i></i>' + item[options.textKey] + '</li>';
  }, this);

  str += '</ul></div>';

  return str;
}

/**
 * 
 * @param {*} options 包含初始化的配置。
 */
var CheckBox = function(options) {

  this.uniquecClass = 'gcb-group-' + (index++) + '-' + new Date().getTime();
  this.selector = '.' + this.uniquecClass;

  if (!options.data || !(options.data instanceof Array)) {
    throw new Error('CheckBox中options的data必须存在且必须是个数组。');
  }
  this.options = {
    data: options.data,
    container: options.container || $('body'),
    disabled: options.disabled || false,
    textKey: options.textKey || 'text',
    valKey: options.valKey || 'val',
    clickCallback: options.clickCallback || $.noop
  };

  var that = this;
  this.click = function(e){

    if (that.options.disabled) {
      return false;
    }

    var $li = $(e.target).closest('li');
    
    if (!$li.length) {
      return false;
    }
    var index = $li.index();
    
    var checked = !that.options.data[index].checked;

    that.checkByIndex(index, checked);

    that.options.clickCallback && that.options.clickCallback(that.options.data[index], that.selector);

    return false;
  }

}

CheckBox.prototype = {
  constructor: CheckBox,
  /**
   * 创建cbox
   */
  create: function() {

    var that = this,
      options = that.options,
      data = options.data,
      container = options.container,
      htmlStr = formatStr(options, that.uniquecClass);

      container.html(htmlStr);

    if (!options.disabled) {
      $(that.selector).on('click', that.click);
    }  

    return this;

  },
  /**
   * 以index选中
   * 
   * @param {number | number[]} index 被选中的item的下标或者下标数组
   * @param {boolean} checked 是否被选中
   */
  checkByIndex: function(index, checked) {

    var that = this;

    if (typeof index !== 'number' && !(index instanceof Array)) {
      throw new Error('index必须为数字或者为数组');
    }

    if (typeof checked !== 'boolean') {
      throw new Error('checked必须为布尔值 ');
    }

    var $lis = $(that.selector).find('li'),
      liArr = [];

    if (typeof index === 'number') {
      if (index > ($lis.length - 1)) {
        throw new Error('输入下标大于实际最大下标');
      }
      liArr.push($lis.eq(index));
      that.options.data[index].checked = checked;
    } else {
      index.forEach(function(v){
        if (typeof v !== 'number') {
          throw new Error('数组内容必须为number类型');
        }
        if (v > ($lis.length - 1)) {
          throw new Error('数组内容大小大于实际最大下标');
        }
        liArr.push($lis.eq(v));
        that.options.data[v].checked = checked;
      });
    }

    if (checked) {
      liArr.forEach(function(item){
        $(item).addClass('checked');
      });
    } else {
      liArr.forEach(function(item){
        $(item).removeClass('checked');
      });
    }

    return this;
  },
  /**
   * @return {boolean} 是否失效
   */
  isDisabled: function() {
    return !!this.options.disabled;
  },
  /**
   * 让cbox点击失效
   */
  disabled: function() {

    this.options.disabled = true;

    $(this.selector).addClass('disabled');

    return this;
  },
  /**
   * 让cbox点击生效
   */
  enabled: function() {
    
    this.options.disabled = false;

    $(this.selector).removeClass('disabled');

    return this;
  },
  /**
   * 以val选中
   * 
   * @param {any | any[]} val 被选中的item的val或者val数组
   * @param {boolean} checked 是否被选中
   */
  checkByVal: function(val, checked) {

    var that = this;

    if (typeof checked !== 'boolean') {
      throw new Error('checked必须为布尔值 ');
    }

    var indexArr = [];

    if (val instanceof Array) {
      val.forEach(function(v1) {
        that.options.data.forEach(function(v2, i){
          if (v2[that.valKey] === v1) {
            indexArr.push(i);
          }
        });
      });
    } else {
      that.options.data.forEach(function(v, i){
        if (v[that.options.valKey] === val) {
          indexArr.push(i);
        }
      });
    }

    that.checkByIndex(indexArr, checked);

    return this;
  },
  /**
   * 获得被选中的数据的val
   * 
   * @returns 选中的valkey的值数组
   */
  getCheckedItemsVal: function(){
    
    var that = this, 
      rs = [];
    
    that.options.data.forEach(function(item) {
      if (item.checked) {
        rs.push(item[that.options.valKey]);
      }
    });

    return rs;
  },
  /**
   * 获得被选中的数据
   * 
   * @returns 选中的值数组
   */
  getCheckedItems: function() {

    var that = this, 
      rs = [];
    
    that.options.data.forEach(function(item) {
      if (item.checked) {
        rs.push(item);
      }
    });

    return rs;

  }

}