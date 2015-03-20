(function($, CONST, Parse, undefined){

  var $window = $(window),
    $loginSubmitButton = $('#login-submit'),
    $navActions = $(CONST.NAV_ACTIONS),
    $loginForm = $(CONST.LOGIN_FORM_ID),
    $loginView = $(CONST.LOGIN_VIEW_ID),
    $taskInput = $(CONST.MAIN_TASK_INPUT_ID),
    $rollupView = $(CONST.ROLLUP_VIEW),
    $inputView = $(CONST.INPUT_VIEW_ID),
    $homeLink = $(CONST.HOME_LINK),
    $rollupLink = $(CONST.SHOW_ROLLUP_LINK),
    $itemTemplate = $('#task-item-template'),
    $todayList = $('#today-list'),
    $emailInput = $('#inputEmail'),
    data = [];

  function loginAction(serializedArray){
    var username, password,
    dfd = $.Deferred();

    for (var i=0, len=serializedArray.length; i< len; i++){
      var key = serializedArray[i].name,
        value = serializedArray[i].value;

      if(key === 'username'){
        username = value;
      }else if(key === 'password'){
        password = value;
      }
    }

    Parse.User.logIn(username, password, {
      success: function(user) {
        dfd.resolve(user);
      },
      error: function(user, error) {
        if (error.code === Parse.Error.EMAIL_NOT_FOUND || error.code === Parse.Error.OBJECT_NOT_FOUND){
          createUser(username, password)
          .done(function(user){
            dfd.resolve(user);
          })
          .fail(function(){
            dfd.reject();
          });
        }else{
          dfd.reject();
        }
      }
    });

    dfd.done(function(){
      $window.trigger(CONST.EVENTS.LOGIN);
    });

    /*
    setTimeout(function(){
      dfd.resolve();
    }, 250);
    */


    return dfd.promise();
  }

  function createUser(username, password){
    var user = new Parse.User(),
    dfd = new $.Deferred();
    user.set('username', username);
    user.set('password', password);
    user.set('email', username);

    user.signUp(null, {
      success: function(user) {
        dfd.resolve(user);
      },
      error: function(user, error) {
        dfd.reject(user, error);
        console.log('Error: ' + error.code + ' ' + error.message);
      }
    });
    return dfd.promise();
  }

  function getViews(){
    return $('body > .container');
  }

  function onInputViewShow(callback, e){
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

    if(callback){
      callback();
    }
  }

  function showInputView(callback){
    $inputView.classShow().addClass('animated fadeIn').one('webkitAnimationEnd', onInputViewShow.bind(null, callback));
  }

  $taskInput.on('keyup', function(e){
    if(e.which === 13){
      var $newItem = $($itemTemplate.html()),
          $input = $(e.target),
          content = $input.val();
      $newItem.find('.list-item-content').text(content);
      data.push(content);
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

    $loginView.removeClass('zoomIn').addClass('animated zoomOut')
      .one('webkitAnimationEnd', function() {
        getViews().classHide().removeClass('zoomOut');
        showInputView();
      });
    $navActions.classShow().removeClass('fadeOutRight fadeOut').addClass('animated fadeInRight');
  });

  $window.on(CONST.EVENTS.LOGOUT, function(){
    $loginSubmitButton.button('reset');
    $loginForm.find('input').each(function(){ $(this).val(''); });

    getViews().addClass('animated fadeOut').one('webkitAnimationEnd', function() {
      getViews().removeClass('fadeOut').classHide();
      $loginView.classShow().removeClass('zoomOut').addClass('animated zoomIn');
    });

    $navActions.removeClass('fadeInRight').addClass('animated fadeOutRight').one('webkitAnimationEnd', function() { $navActions.classHide(); });
  });

  //Clicking on the "logo"
  $homeLink.on('click', function(){
    getViews().addClass('animated fadeOutLeft').one('webkitAnimationEnd', function() {
      $inputView.removeClass('fadeOutLeft'); getViews().classHide().removeClass('fadeOutLeft');
      showInputView(function(){});
    });
  });


  $rollupLink.on('click', function(){
    getViews().addClass('animated fadeOutLeft').one('webkitAnimationEnd', function() {
      getViews().removeClass('fadeOutLeft'); getViews().classHide();
      $rollupView.classShow().addClass('animated fadeInLeft').one('webkitAnimationEnd', function() { $rollupView.removeClass('fadeInLeft'); });
    });
  });

  $loginForm.on('submit',function(e){
    e.preventDefault();
    $loginSubmitButton.button('loading');
    loginAction($(e.target).serializeArray()).fail(function(){
      $loginSubmitButton.button('reset');
    });
  });

  $('body').on('click','.btn',function(e){
    var $button = $(e.currentTarget),
      $icon = $button.find('.glyphicon');
      console.log($button.find('.glyphicon'));
    if($icon.hasClass('glyphicon-star-empty')){
      $icon.toggleClass('glyphicon-star-empty glyphicon-star');
    }else if($icon.hasClass('glyphicon-star')){
      $icon.toggleClass('glyphicon-star glyphicon-star-empty');
    }
  });

  $(CONST.NAV_LOGOUT_LINK_ID).on('click', function(e){
    e.preventDefault();
    $window.trigger(CONST.EVENTS.LOGOUT);
  });

}(jQuery, window.CONSTANTS, window.Parse));