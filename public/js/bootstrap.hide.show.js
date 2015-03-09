(function ($, CONST) {

  $.fn.classHide = function() {
    this.addClass(CONST.HIDDEN)
    return this;
  };

  $.fn.classShow = function() {
    this.removeClass(CONST.HIDDEN)
    return this;
  };

}(jQuery, window.CONSTANTS));