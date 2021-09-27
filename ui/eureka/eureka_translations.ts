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
