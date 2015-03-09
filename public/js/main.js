(function($, CONST, undefined){

  var $window = $(window),
    $loginSubmitButton = $('#login-submit'),
    $navActions = $(CONST.NAV_ACTIONS),
    $loginForm = $(CONST.LOGIN_FORM_ID),
    $taskInput = $(CONST.MAIN_TASK_INPUT_ID),
    $itemTemplate = $('#task-item-template'),
    $todayList = $('#today-list'),
    $emailInput = $('#inputEmail');

  function loginAction(serialized){
    var dfd = $.Deferred();

    dfd.done(function(){
      $window.trigger(CONST.EVENTS.LOGIN);
    });

    setTimeout(function(){
      dfd.resolve();
    }, 250);


    return dfd.promise();
  }

  function getViews(){
    return $('body > .container');
  }

  function onInputViewShow(e){
    var $startingInputView = $(CONST.STARTING_INPUT_VIEW_ID),
      $label = $startingInputView.find('label:first'),
      timeout = setInterval(function(){
      $label.addClass('animated bounce').one('webkitAnimationEnd', function(){
        $label.removeClass('bounce');
      });
    }, 8000);

    //Dont annoy me if I start typing.
    $taskInput.one('keyup', function(){
      clearInterval(timeout);
    });
  }

  $taskInput.on('keyup', function(e){
    if(e.which === 13){
      var $newItem = $($itemTemplate.html()),
          $input = $(e.target);
      $newItem.find('.list-item-content').text($input.val());
      $todayList.append($newItem);
      $newItem.addClass('animated fadeInDownBig');
      $todayList.classShow().addClass('animated fadeIn');
      $input.val('');
    }
  });


  $emailInput.on('keyup', function(e){
    $loginSubmitButton.prop('disabled',$.trim($(e.target).val()) === '');
  });

  $window.on(CONST.EVENTS.LOGIN, function(){

    $loginForm.removeClass('zoomIn').addClass('animated zoomOut')
      .one('webkitAnimationEnd', function() {
        $(CONST.LOGIN_VIEW_ID).classHide();
        $(CONST.INPUT_VIEW_ID).classShow().addClass('animated fadeIn').one('webkitAnimationEnd', onInputViewShow);
      });
    $navActions.classShow().removeClass('fadeOutRight fadeOut').addClass('animated fadeInRight');
  });

  $window.on(CONST.EVENTS.LOGOUT, function(){
    $loginSubmitButton.button('reset');
    $loginForm.find('input').each(function(){ $(this).val(''); });

    getViews().classHide();

    $navActions.removeClass('fadeInRight').addClass('animated fadeOutRight').one('webkitAnimationEnd', function() { $navActions.classHide(); });

    $(CONST.LOGIN_VIEW_ID).classShow();
    $loginForm.removeClass('zoomOut').addClass('animated zoomIn');
  });

  $loginForm.on('submit',function(e){
    e.preventDefault();
    $loginSubmitButton.button('loading');
    loginAction($(e.target).serialize());
  });

  $(CONST.NAV_LOGOUT_LINK_ID).on('click', function(e){
    e.preventDefault();
    $window.trigger(CONST.EVENTS.LOGOUT);
  });

}(jQuery, window.CONSTANTS));