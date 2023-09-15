export default class AutoplayHelper {
  private static context?: AudioContext;
  private static isButtonCreated = false;

  private static getContext(): AudioContext {
    AutoplayHelper.context ??= new AudioContext();
    return AutoplayHelper.context;
  }

  static CheckIfAlreadyRunning(): boolean {
    // This check will only ever succeed on running Chromium passing
    //  --autoplay-policy=no-user-gesture-required
    // as command line argument or configuring CEF the correct way.
    // Once https://bugs.chromium.org/p/chromium/issues/detail?id=1106380
    // is fixed this function will return false on every (up-to-date) browser
    const context = AutoplayHelper.getContext();
    return context.state === 'running';
  }

  static Prompt(): void {
    if (AutoplayHelper.isButtonCreated) {
      return;
    }
    const context = AutoplayHelper.getContext();
    const button = document.createElement('button');
    button.innerText = 'Click to enable audio';
    button.classList.add('autoplay-helper-button');
    button.onclick = function() {
      void context.resume();
    };
    context.onstatechange = function() {
      button.remove();
    };
    document.body.appendChild(button);
    AutoplayHelper.isButtonCreated = true;
  }

  static CheckAndPrompt(): void {
    if (!AutoplayHelper.CheckIfAlreadyRunning())
      AutoplayHelper.Prompt();
  }
}
