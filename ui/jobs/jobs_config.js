'use strict';

UserConfig.registerOptions('jobs', {
  options: [
    {
      id: 'JustBuffTracker',
      name: {
        en: 'Only show the party buff tracker',
        de: 'Zeige nur den Gruppen Buff-Tracker',
        fr: 'Afficher seulement le tracker de buff de l\'équipe',
        cn: '仅显示团辅监控',
        ko: '파티 버프만 표시',
      },
      type: 'checkbox',
      default: false,
    },
    {
      id: 'LowerOpacityOutOfCombat',
      name: {
        en: 'Lower ui opacity when out of combat',
        de: 'Veringere die Deckkraft auserhalb des Kampfes',
        fr: 'Diminiuer l\'opacité de l\'UI si hors combat',
        cn: '非战斗状态时使UI透明化',
        ko: '전투 중이 아닐 때, UI 투명도 높이기',
      },
      type: 'checkbox',
      default: true,
    },
    {
      id: 'OpacityOutOfCombat',
      name: {
        en: 'Opacity of ui when out of combat',
        de: 'Deckkraft der UI auserhalb des Kampfes',
        fr: 'Opacité de l\'UI si hors combat',
        cn: '非战斗状态时UI透明度',
        ko: '전투 중이 아닐 때, UI 투명도',
      },
      type: 'float',
      default: 0.5,
    },
    {
      id: 'HideWellFedAboveSeconds',
      name: {
        en: 'Hide cheese icon when food > time (in seconds)',
        de: 'Verstecke das Käse Icon wenn Bufffood > Zeit (in Sekunden)',
        fr: 'Masquer l\'icône quand Repu > durée (en secondes)',
        cn: '食物提醒图标隐藏时间（秒）',
        ko: '남은 식사 효과 시간이 이 시간보다 길면, 치즈 아이콘 숨김 (단위: 초)',
      },
      type: 'integer',
      default: 15 * 60,
    },
    {
      id: 'ShowMPTickerOutOfCombat',
      name: {
        en: 'Show MP ticker out of combat',
        de: 'Zeige MP-Ticker auserhalb des Kampfes',
        fr: 'Afficher symbole MP si hors combat',
        cn: '非战斗状态时显示MP监控',
        ko: '전투 중이 아닐 때, MP 티커 표시',
      },
      type: 'checkbox',
      default: false,
    },
    {
      id: 'MidHealthThresholdPercent',
      name: {
        en: 'Percent of health considered middling',
        de: 'Prozent der Lebenspunkte (mittelmaß)',
        fr: 'Pourcentage de vie considéré comme moyenne',
        cn: '定义中等血量百分比',
        ko: '보통 HP로 취급될 HP비율 (1 = 100%)',
      },
      type: 'float',
      default: 0.8,
    },
    {
      id: 'LowHealthThresholdPercent',
      name: {
        en: 'Percent of health considered low',
        de: 'Prozent der Lebenspunkte (gering)',
        fr: 'Pourcentage de vie considéré comme bas',
        cn: '定义低血量百分比',
        ko: '낮은 HP로 취급될 HP비율 (1 = 100%)',
      },
      type: 'float',
      default: 0.2,
    },
    {
      id: 'BigBuffShowCooldownSeconds',
      name: {
        en: 'Minimum seconds on a cooldown before shown',
        de: 'Minimum an Sekunden für einen Cooldown vor der Anzeige',
        fr: 'Nombre minimal de secondes avant affichage du cooldown',
        cn: '显示团辅冷却倒计时最小时间',
        ko: '재사용 대기시간을 표시할 기준 시간(초 이하)',
      },
      type: 'float',
      default: 20,
    },
    {
      id: 'BigBuffIconWidth',
      name: {
        en: 'Width of buff icons (px)',
        de: 'Weite des Buff Icons (px)',
        fr: 'Largeur des icônes de buff (pixel)',
        cn: '团辅监控图标宽度（像素）',
        ko: '버프 아이콘 너비 (pixel)',
      },
      type: 'integer',
      default: 44,
    },
    {
      id: 'BigBuffIconHeight',
      name: {
        en: 'Height of buff icons (px)',
        de: 'Höhe des Buff Icons (px)',
        fr: 'Hauteur des icônes de buff (pixel)',
        cn: '团副监控图标高度（像素）',
        ko: '버프 아이콘 높이 (pixel)',
      },
      type: 'integer',
      default: 32,
    },
    {
      id: 'BigBuffBarHeight',
      name: {
        en: 'Height of buff timer bars (px)',
        de: 'Höhe der Buff-Timer Leisten (px)',
        fr: 'Hauteur des barres de temps des buffs (pixel)',
        cn: '团副监控计时条高度（像素）',
        ko: '버프 타이머 바 높이 (pixel)',
      },
      type: 'integer',
      default: 5,
    },
    {
      id: 'BigBuffTextHeight',
      name: {
        en: 'Height of buff text (px)',
        de: 'Höhe des Buff-Text (px)',
        fr: 'Hauteur des textes de buffs (pixel)',
        cn: '团副监控文字高度（像素）',
        ko: '버프 텍스트 높이 (pixel)',
      },
      type: 'integer',
      default: 0,
    },
    {
      id: 'BigBuffBorderSize',
      name: {
        en: 'Size of buff borders (px)',
        de: 'Größe der Buff-Ränder (px)',
        fr: 'Taille des bordures de buffs (pixel)',
        cn: '团副监控边框尺寸（像素）',
        ko: '버프 아이콘 테두리 크기 (pixel)',
      },
      type: 'integer',
      default: 1,
    },
    {
      id: 'GpAlarmPoint',
      name: {
        en: 'GP alarm (if 0, no alarm)',
        de: 'GP alarm (if 0, no alarm)', // FIXME
        fr: 'GP alarm (if 0, no alarm)', // FIXME
        cn: 'GP alarm (if 0, no alarm)', // FIXME
        ko: 'GP 알람 (0이면 알리지 않음)',
      },
      type: 'integer',
      default: 0,
    },
  ],
});
