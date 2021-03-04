export default class AutoplayHelper {
  static Check(): boolean {
    const context = new AudioContext();
    return context.state === 'suspended';
  }

  static Prompt(): void {
    const button = document.createElement('button');
    button.innerText = 'Click to enable audio';
    button.classList.add('autoplay-helper-button');
    button.onclick = (): void => {
      button.remove();
    };
    document.body.appendChild(button);
  }

  static CheckAndPrompt(): void {
    if (AutoplayHelper.Check())
      AutoplayHelper.Prompt();
  }
}
