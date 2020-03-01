'use strict';

class AutoplayHelper {
  static Check() {
    let context = new AudioContext();
    return context.state === 'suspended';
  }

  static Prompt() {
    let button = document.createElement('button');
    button.innerText = 'Click to enable audio';
    button.classList.add('autoplay-helper-button');
    button.onclick = function() {
      button.remove();
    };
    document.body.appendChild(button);
  }

  static CheckAndPrompt() {
    if (AutoplayHelper.Check())
      AutoplayHelper.Prompt();
  }
}
