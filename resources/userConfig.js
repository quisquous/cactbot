var UserConfig = {
  getUserConfigLocation: function(_for, callback) {
    document.addEventListener("onSendUserConfigLocation", function(e) {
      if(e.detail.hasJS) {
        var jsLoc = e.detail.location;
        /*load JS*/
        var userJS = document.createElement('script');
        userJS.setAttribute('type', 'text/javascript');
        userJS.setAttribute('src', jsLoc);
        document.getElementsByTagName('head')[0].appendChild(userJS);
      } if(e.detail.hasCSS) {
        var cssLoc = e.detail.location.replace('.js', '.css');
        /*load CSS*/
        var userCSS = document.createElement('link');
        userCSS.setAttribute('rel', 'stylesheet');
        userCSS.setAttribute('type', 'text/css');
        userCSS.setAttribute('href', cssLoc);
        document.getElementsByTagName('head')[0].appendChild(userCSS);
      }
      if((e.detail.hasJS || e.detail.hasCSS) && callback) {
        callback(e);
      }
    });
    OverlayPluginApi.overlayMessage(OverlayPluginApi.overlayName, JSON.stringify({'getUserLocation': _for}));
  },
  sendJSReady: function(e, callback) {
    OverlayPluginApi.overlayMessage(OverlayPluginApi.overlayName, JSON.stringify({'javascriptReady': true}));
    if(callback) {
      document.addEventListener('onJavascriptReadyResponse', callback);
    }
  }
}

document.addEventListener('DOMContentLoaded', UserConfig.sendJSReady);