import { Lang, langToLocale } from '../../resources/languages';
import { UnreachableCode } from '../../resources/not_reached';
import TimerBar from '../../resources/timerbar';
import { LooseTimelineTrigger } from '../../types/trigger';

import { PopupTextGenerator } from './popup-text';
import { RaidbossOptions } from './raidboss_options';
import { TimelineUI } from './timeline';
import { Event } from './timeline_parser';

const kBig = 1000000000; // Something bigger than any fight length in seconds.

const timelineInstructions = {
  en: [
    'These lines are',
    'debug timeline entries.',
    'If you lock the overlay,',
    'they will disappear!',
    'Real timelines automatically',
    'appear when supported.',
  ],
  de: [
    'Diese Zeilen sind',
    'Timeline Debug-Einträge.',
    'Wenn du das Overlay sperrst,',
    'werden sie verschwinden!',
    'Echte Timelines erscheinen automatisch,',
    'wenn sie unterstützt werden.',
  ],
  fr: [
    'Ces lignes sont',
    'des timelines de test.',
    'Si vous bloquez l\'overlay,',
    'elles disparaîtront !',
    'Les vraies Timelines',
    'apparaîtront automatiquement.',
  ],
  ja: [
    'こちらはデバッグ用の',
    'タイムラインです。',
    'オーバーレイをロックすれば、',
    'デバッグ用テキストも消える',
    'サポートするゾーンにはタイム',
    'ラインを動的にロードする。',
  ],
  cn: [
    '显示在此处的是',
    '调试用时间轴。',
    '将此悬浮窗锁定',
    '则会立刻消失',
    '真实的时间轴会根据',
    '当前区域动态加载并显示',
  ],
  ko: [
    '이 막대바는 디버그용',
    '타임라인 입니다.',
    '오버레이를 위치잠금하면,',
    '이 막대바도 사라집니다.',
    '지원되는 구역에서 타임라인이',
    '자동으로 표시됩니다.',
  ],
};

// TODO: Duplicated in 'jobs'
const computeBackgroundFrom = (element: HTMLElement, classList: string): string => {
  const div = document.createElement('div');
  const classes = classList.split('.');
  for (const cls of classes)
    div.classList.add(cls);
  element.appendChild(div);
  const color = window.getComputedStyle(div).background;
  element.removeChild(div);
  return color;
};

export type ActiveBar = {
  bar: TimerBar;
  soonTimeout?: number;
};

export class HTMLTimelineUI extends TimelineUI {
  private init = false;
  private lang: Lang;

  private root: HTMLElement | null = null;
  private barColor: string | null = null;
  private barExpiresSoonColor: string | null = null;
  private timerlist: HTMLElement | null = null;

  private activeBars: { [activebar: string]: ActiveBar } = {};

  private debugElement: HTMLElement | null = null;
  private debugFightTimer: TimerBar | null = null;

  private popupText?: PopupTextGenerator;

  constructor(protected options: RaidbossOptions) {
    super();
    this.lang = this.options.TimelineLanguage || this.options.ParserLanguage || 'en';
    this.AddDebugInstructions();
  }

  protected override Init(): void {
    if (this.init)
      return;
    this.init = true;

    this.root = document.getElementById('timeline-container');
    if (!this.root)
      throw new Error('can\'t find timeline-container');

    // TODO: left for now as backwards compatibility with user css.  Remove this later??
    this.root.classList.add(`lang-${this.lang}`);
    this.root.lang = langToLocale(this.lang);
    if (this.options.Skin !== undefined)
      this.root.classList.add(`skin-${this.options.Skin}`);

    this.barColor = computeBackgroundFrom(this.root, 'timeline-bar-color');
    this.barExpiresSoonColor = computeBackgroundFrom(this.root, 'timeline-bar-color.soon');

    this.timerlist = document.getElementById('timeline');
    if (this.timerlist) {
      this.timerlist.style.gridTemplateRows =
        `repeat(${this.options.MaxNumberOfTimerBars}, min-content)`;
      if (this.options.ReverseTimeline)
        this.timerlist.classList.add('reversed');
    }

    this.activeBars = {};
  }

  protected override AddDebugInstructions(): void {
    const lang = this.lang in timelineInstructions ? this.lang : 'en';
    const instructions = timelineInstructions[lang];

    // Helper for positioning/resizing when locked.
    const helper = document.getElementById('timeline-resize-helper');
    if (!helper)
      return;
    const rows = Math.max(6, this.options.MaxNumberOfTimerBars);
    helper.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    for (let i = 0; i < this.options.MaxNumberOfTimerBars; ++i) {
      const helperBar = document.createElement('div');
      helperBar.classList.add('text');
      helperBar.classList.add('resize-helper-bar');
      helperBar.classList.add('timeline-bar-color');
      if (i < 1)
        helperBar.classList.add('soon');
      if (i < instructions.length)
        helperBar.innerText = instructions[i] ?? '';
      else
        helperBar.innerText = `${i + 1}`;
      helper.appendChild(helperBar);
    }

    // For simplicity in code, always make debugElement valid,
    // however it does not exist in the raid emulator.
    this.debugElement = document.getElementById('timeline-debug');
    if (!this.debugElement)
      this.debugElement = document.createElement('div');
  }

  public override SetPopupTextInterface(popupText: PopupTextGenerator): void {
    this.popupText = popupText;
  }

  protected override Reset(): void {
    if (this.timeline) {
      delete this.timeline.ui;
      while (this.timerlist && this.timerlist.lastChild)
        this.timerlist.removeChild(this.timerlist.lastChild);
      if (this.debugElement)
        this.debugElement.innerHTML = '';
      this.debugFightTimer = null;
      // TODO: clear all timeouts?
      this.activeBars = {};
    }
  }

  public override OnAddTimer(fightNow: number, e: Event, channeling: boolean): void {
    const div = document.createElement('div');
    const bar = TimerBar.create();
    div.classList.add('timer-bar');
    div.appendChild(bar);
    bar.duration = channeling ? e.time - fightNow : this.options.ShowTimerBarsAtSeconds;
    bar.value = e.time - fightNow;
    bar.righttext = 'remain';
    bar.lefttext = e.text;
    bar.toward = 'right';
    bar.stylefill = !channeling ? 'fill' : 'empty';

    if (e.style)
      bar.applyStyles(e.style);

    // Adding a timer with the same id immediately removes the previous.
    const activeBar = this.activeBars[e.id];
    if (activeBar) {
      const parentDiv = activeBar.bar.parentNode;
      parentDiv?.parentNode?.removeChild(parentDiv);
      // Soon timeout is just an optimization to remove, as it's unnecessary.
      if (activeBar.soonTimeout !== undefined) {
        window.clearTimeout(activeBar.soonTimeout);
        activeBar.soonTimeout = undefined;
      }
    }

    let soonTimeout: number | undefined = undefined;
    if (!channeling && e.time - fightNow > this.options.BarExpiresSoonSeconds) {
      bar.fg = this.barColor;
      soonTimeout = window.setTimeout(
        () => bar.fg = this.barExpiresSoonColor,
        (e.time - fightNow - this.options.BarExpiresSoonSeconds) * 1000,
      );
    } else {
      bar.fg = this.barExpiresSoonColor;
    }

    if (e.sortKey) {
      // Invert the order if the timer bars should "grow" in the reverse direction
      div.style.order = ((this.options.ReverseTimeline ? -1 : 1) * e.sortKey).toString();
    }
    this.timerlist?.appendChild(div);
    this.activeBars[e.id] = {
      bar: bar,
      soonTimeout: soonTimeout,
    };
  }

  public override OnRemoveTimer(e: Event, force: boolean): void {
    const activeBar = this.activeBars[e.id];
    if (!activeBar)
      return;

    const div = activeBar.bar.parentNode;
    if (!(div instanceof HTMLElement))
      throw new UnreachableCode();

    const removeBar = () => {
      div?.parentNode?.removeChild(div);
      delete this.activeBars[e.id];
    };

    if (!force)
      div.classList.add('animate-timer-bar-removed');
    if (window.getComputedStyle(div).animationName !== 'none') {
      // Wait for animation to finish
      div.addEventListener('animationend', removeBar);
    } else {
      removeBar();
    }
  }

  public override OnShowInfoText(text: string, currentTime: number): void {
    if (this.popupText)
      this.popupText.Info(text, currentTime);
  }

  public override OnShowAlertText(text: string, currentTime: number): void {
    if (this.popupText)
      this.popupText.Alert(text, currentTime);
  }

  public override OnShowAlarmText(text: string, currentTime: number): void {
    if (this.popupText)
      this.popupText.Alarm(text, currentTime);
  }

  public override OnSpeakTTS(text: string, currentTime: number): void {
    if (this.popupText)
      this.popupText.TTS(text, currentTime);
  }

  public override OnTrigger(
    trigger: LooseTimelineTrigger,
    matches: RegExpExecArray | null,
    currentTime: number,
  ): void {
    if (this.popupText)
      this.popupText.Trigger(trigger, matches, currentTime);
  }

  public override OnSyncTime(fightNow: number, running: boolean): void {
    if (!this.options.Debug || !this.debugElement)
      return;

    if (!running) {
      if (this.debugFightTimer)
        this.debugElement.removeChild(this.debugFightTimer);
      this.debugFightTimer = null;
      return;
    }

    if (!this.debugFightTimer) {
      this.debugFightTimer = TimerBar.create();
      this.debugFightTimer.width = '100px';
      this.debugFightTimer.height = '17px';
      this.debugFightTimer.duration = kBig;
      this.debugFightTimer.lefttext = 'elapsed';
      this.debugFightTimer.toward = 'right';
      this.debugFightTimer.stylefill = 'fill';
      this.debugFightTimer.bg = 'transparent';
      this.debugFightTimer.fg = 'transparent';
      // Align it to the 'first' item in the timeline container
      if (this.options.ReverseTimeline)
        this.debugElement.classList.add('reversed');
      this.debugElement.appendChild(this.debugFightTimer);
    }

    // Force this to be reset.
    this.debugFightTimer.elapsed = 0;
    this.debugFightTimer.elapsed = fightNow;
  }
}
