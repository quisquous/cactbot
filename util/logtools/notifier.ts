export interface Notifier {
  warn: (reason: string, splitLine?: string[]) => void;
  error: (reason: string, splitLine?: string[]) => void;
}

export class ConsoleNotifier implements Notifier {
  constructor(private fileName: string, private errorFunc: (str: string) => void) {}

  public warn(reason: string, splitLine?: string[]): void {
    if (splitLine === undefined)
      this.errorFunc(this.fileName + ': ' + reason);
    else
      this.errorFunc(this.fileName + ': ' + reason + ': ' + splitLine.join('|'));
  }

  public error(reason: string, splitLine?: string[]): void {
    if (splitLine === undefined)
      this.errorFunc(this.fileName + ': ' + reason);
    else
      this.errorFunc(this.fileName + ': ' + reason + ': ' + splitLine.join('|'));
  }
}
