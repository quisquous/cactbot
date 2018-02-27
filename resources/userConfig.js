var UserConfig = {
  getUserConfigLocation: function(overlayName, callback) {
    document.addEventListener("onSendUserConfigLocation", function(e) {
      var basePath = e.detail.location;
      if (basePath.slice(-1) != '/')
        basePath += '/';
      var userJS = document.createElement('script');
      userJS.setAttribute('type', 'text/javascript');
      userJS.setAttribute('src', basePath + overlayName + '.js');
      document.getElementsByTagName('head')[0].appendChild(userJS);

      var userCSS = document.createElement('link');
      userCSS.setAttribute('rel', 'stylesheet');
      userCSS.setAttribute('type', 'text/css');
      userCSS.setAttribute('href', basePath + overlayName + '.css');
      document.getElementsByTagName('head')[0].appendChild(userCSS);

      if(callback) {
        callback(e);
      }
    });
    OverlayPluginApi.overlayMessage(OverlayPluginApi.overlayName, JSON.stringify({'getUserLocation': true}));
  },
  sendJSReady: function(e, callback) {
    OverlayPluginApi.overlayMessage(OverlayPluginApi.overlayName, JSON.stringify({'javascriptReady': true}));
    if(callback) {
      document.addEventListener('onJavascriptReadyResponse', callback);
    }
  }
}

document.addEventListener('DOMContentLoaded', UserConfig.sendJSReady);
