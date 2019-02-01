'use strict';

document.addEventListener('onOverlayStateUpdate', function(e) {
  if (!e.detail.isLocked)
    document.documentElement.classList.add('resizeHandle');
  else
    document.documentElement.classList.remove('resizeHandle');
});
