import { LocaleText } from '../../types/trigger';

import { EurekaTimeStrings } from './eureka';

export const bunnyLabel: LocaleText = {
  en: 'Bunny',
  de: 'Hase',
  fr: 'Lapin',
  ja: 'うさぎ',
  cn: '兔子',
  ko: '토끼',
};

const sec2time = (timeInMs: number) => {
  const pad = function(num: number, size: number) {
    return ('000' + num.toString()).slice(size * -1);
  };

  const time: Date = new Date(timeInMs);
  const minutes: number = time.getMinutes();
  const seconds: number = time.getSeconds();

  return minutes.toString() + ':' + pad(seconds, 2);
};

export const timeStrings: EurekaTimeStrings = {
  weatherFor: {
    en: (nowMs, stopTime) => {
      if (stopTime) {
        const min = (stopTime - nowMs) / 1000 / 60;
        return ` for ${Math.ceil(min)}m`;
      }
      return ' for ???';
    },
    de: (nowMs, stopTime) => {
      if (stopTime) {
        const min = (stopTime - nowMs) / 1000 / 60;
        return ` für ${Math.ceil(min)}min`;
      }
      return ' für ???';
    },
    fr: (nowMs, stopTime) => {
      if (stopTime) {
        const min = (stopTime - nowMs) / 1000 / 60;
        return ` pour ${Math.ceil(min)} min `;
      }
      return ' pour ???';
    },
    ja: (nowMs, stopTime) => {
      if (stopTime) {
        const min = (stopTime - nowMs) / 1000 / 60;
        return ` 終わるまであと${Math.ceil(min)}分 `;
      }
      return ' 終わるまであと ???';
    },
    cn: (nowMs, stopTime) => {
      if (stopTime) {
        const min = (stopTime - nowMs) / 1000 / 60;
        return ` ${Math.ceil(min)}分钟后结束`;
      }
      return ' ??? 分钟';
    },
    ko: (nowMs, stopTime) => {
      if (stopTime) {
        const min = (stopTime - nowMs) / 1000 / 60;
        return ` ${Math.ceil(min)}분 동안`;
      }
      return ' ??? 동안';
    },
  },
  weatherIn: {
    en: (nowMs, startTime) => {
      if (startTime) {
        const min = (startTime - nowMs) / 1000 / 60;
        return ` in ${Math.ceil(min)}m`;
      }
      return ' in ???';
    },
    de: (nowMs, startTime) => {
      if (startTime) {
        const min = (startTime - nowMs) / 1000 / 60;
        return ` in ${Math.ceil(min)}min`;
      }
      return ' in ???';
    },
    fr: (nowMs, startTime) => {
      if (startTime) {
        const min = (startTime - nowMs) / 1000 / 60;
        return ` dans ${Math.ceil(min)} min `;
      }
      return ' dans ???';
    },
    ja: (nowMs, startTime) => {
      if (startTime) {
        const min = (startTime - nowMs) / 1000 / 60;
        return ` あと ${Math.ceil(min)} 分 `;
      }
      return ' あと ???';
    },
    cn: (nowMs, startTime) => {
      if (startTime) {
        const min = (startTime - nowMs) / 1000 / 60;
        return ` ${Math.ceil(min)}分钟后`;
      }
      return ' ??? 后';
    },
    ko: (nowMs, startTime) => {
      if (startTime) {
        const min = (startTime - nowMs) / 1000 / 60;
        return ` ${Math.ceil(min)}분 후`;
      }
      return ' ??? 후';
    },
  },
  portalFor: {
    en: (nowMs, stopTime) => {
      if (stopTime)
        return ` for ${sec2time(stopTime - nowMs)}`;
      return ' for ???';
    },
    de: (nowMs, stopTime) => {
      if (stopTime)
        return ` für ${sec2time(stopTime - nowMs)}`;
      return ' für ???';
    },
    fr: (nowMs, stopTime) => {
      if (stopTime)
        return ` pour ${sec2time(stopTime - nowMs)}`;
      return ' pour ???';
    },
    ja: (nowMs, stopTime) => {
      if (stopTime)
        return ` 終わるまであと${sec2time(stopTime - nowMs)}`;
      return ' 終わるまであと ???';
    },
    cn: (nowMs, stopTime) => {
      if (stopTime)
        return ` ${sec2time(stopTime - nowMs)}后结束`;
      return ' ???';
    },
    ko: (nowMs, stopTime) => {
      if (stopTime)
        return ` ${sec2time(stopTime - nowMs)}동안`;
      return ' ??? 동안';
    },
  },
  portalIn: {
    en: (nowMs, startTime) => {
      if (startTime)
        return ` in ${sec2time(startTime - nowMs)}`;

      return ' in ???';
    },
    de: (nowMs, startTime) => {
      if (startTime)
        return ` in ${sec2time(startTime - nowMs)}`;
      return ' in ???';
    },
    fr: (nowMs, startTime) => {
      if (startTime)
        return ` dans ${sec2time(startTime - nowMs)}`;
      return ' dans ???';
    },
    ja: (nowMs, startTime) => {
      if (startTime)
        return ` あと ${sec2time(startTime - nowMs)}`;
      return ' あと ???';
    },
    cn: (nowMs, startTime) => {
      if (startTime)
        return ` ${sec2time(startTime - nowMs)}后`;
      return ' ??? 后';
    },
    ko: (nowMs, startTime) => {
      if (startTime)
        return ` ${sec2time(startTime - nowMs)} 후`;
      return ' ??? 후';
    },
  },
  timeFor: {
    en: (dayNightMin) => ` for ${dayNightMin}m`,
    de: (dayNightMin) => ` für ${dayNightMin}min`,
    fr: (dayNightMin) => ` pour ${dayNightMin} min `,
    ja: (dayNightMin) => ` ${dayNightMin}分`,
    cn: (dayNightMin) => ` ${dayNightMin}分钟`,
    ko: (dayNightMin) => ` ${dayNightMin}분 동안`,
  },
  minute: {
    en: 'm',
    de: 'min',
    fr: ' min ',
    ja: '分',
    cn: '分',
    ko: '분',
  },
};
