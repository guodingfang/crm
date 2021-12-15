layui.define('jquery',function(exports){
  "use strict";
  var $ = layui.$;

  $.ajaxSetup({
    headers:{
      Authorization:"Bearer "+ window.user.Authorization
    }
  });

  exports("configs",{});
});
