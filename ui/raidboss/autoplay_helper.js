export default class AutoplayHelper {
  static Check() {
    const context = new AudioContext();
    return context.state === 'suspended';
  }

  static Prompt() {
    const button = document.createElement('button');
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
