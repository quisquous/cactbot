'use strict';

UserConfig.registerOptions('jobs', {
  options: [
    {
      id: 'JustBuffTracker',
      name: {
        en: 'Only show the party buff tracker',
        fr: 'Afficher seulement le tracker de buff de l\'équipe',
        cn: '仅显示团辅监控',
      },
      type: 'checkbox',
      default: false,
    },
    {
      id: 'LowerOpacityOutOfCombat',
      name: {
        en: 'Lower ui opacity when out of combat',
        fr: 'Diminiuer l\'opacité de l\'UI si hors combat',
        cn: '仅显示团辅监控',
      },
      type: 'checkbox',
      default: true,
    },
    {
      id: 'OpacityOutOfCombat',
      name: {
        en: 'Opacity of ui when out of combat',
        fr: 'Opacité de l\'UI si hors combat',
        cn: '非战斗状态时UI透明度',
      },
      type: 'float',
      default: 0.5,
    },
    {
      id: 'HideWellFedAboveSeconds',
      name: {
        en: 'Hide cheese icon when food > time (in seconds)',
        fr: 'Masquer l\'icône quand Repu > durée (en secondes)',
        cn: '当食物时间大于多少时隐藏奶酪图标（以秒为单位）',
      },
      type: 'integer',
      default: 15 * 60,
    },
    {
      id: 'ShowMPTickerOutOfCombat',
      name: {
        en: 'Show MP ticker out of combat',
        fr: 'Afficher symbole MP si hors combat',
        cn: '在非战斗状态时显示MP监控',
      },
      type: 'checkbox',
      default: false,
    },
    {
      id: 'MidHealthThresholdPercent',
      name: {
        en: 'Percent of health considered middling',
        fr: 'Pourcentage de vie considéré comme moyenne',
        cn: '定义中等血量百分比',
      },
      type: 'float',
      default: 0.8,
    },
    {
      id: 'LowHealthThresholdPercent',
      name: {
        en: 'Percent of health considered low',
        fr: 'Pourcentage de vie considéré comme bas',
        cn: '定义低血量百分比',
      },
      type: 'float',
      default: 0.2,
    },
    {
      id: 'BigBuffShowCooldownSeconds',
      name: {
        en: 'Minimum seconds on a cooldown before shown',
        fr: 'Nombre minimal de secondes avant affichage du cooldown',
        cn: '显示团辅冷却倒计时最小时间',
      },
      type: 'float',
      default: 20,
    },
    {
      id: 'BigBuffIconWidth',
      name: {
        en: 'Width of buff icons (px)',
        fr: 'Largeur des icônes de buff (pixel)',
        cn: '团辅监控图标宽度（像素）',
      },
      type: 'integer',
      default: 44,
    },
    {
      id: 'BigBuffIconHeight',
      name: {
        en: 'Height of buff icons (px)',
        fr: 'Hauteur des icônes de buff (pixel)',
        cn: '团副监控图标高度（像素）',
      },
      type: 'integer',
      default: 32,
    },
    {
      id: 'BigBuffBarHeight',
      name: {
        en: 'Height of buff timer bars (px)',
        fr: 'Hauteur des barres de temps des buffs (pixel)',
        cn: '团副监控计时条高度（像素）',
      },
      type: 'integer',
      default: 5,
    },
    {
      id: 'BigBuffTextHeight',
      name: {
        en: 'Height of buff text (px)',
        fr: 'Hauteur des textes de buffs (pixel)',
        cn: '团副监控文字高度（像素）',
      },
      type: 'integer',
      default: 0,
    },
    {
      id: 'BigBuffBorderSize',
      name: {
        en: 'Size of buff borders (px)',
        fr: 'Taille des bordures de buffs (pixel)',
        cn: '团副监控边框尺寸（像素）',
      },
      type: 'integer',
      default: 1,
    },
  ],
});
