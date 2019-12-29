'use strict';

UserConfig.registerOptions('jobs', {
  options: [
    {
      id: 'JustBuffTracker',
      name: {
        en: 'Only show the party buff tracker',
      },
      type: 'checkbox',
      default: false,
    },
    {
      id: 'LowerOpacityOutOfCombat',
      name: {
        en: 'Lower ui opacity when out of combat',
      },
      type: 'checkbox',
      default: true,
    },
    {
      id: 'OpacityOutOfCombat',
      name: {
        en: 'Opacity of ui when out of combat',
      },
      type: 'float',
      default: 0.5,
    },
    {
      id: 'HideWellFedAboveSeconds',
      name: {
        en: 'Hide cheese icon when food > time (in seconds)',
      },
      type: 'integer',
      default: 15 * 60,
    },
    {
      id: 'ShowMPTickerOutOfCombat',
      name: {
        en: 'Show MP ticker out of combat',
      },
      type: 'checkbox',
      default: false,
    },
    {
      id: 'MidHealthThresholdPercent',
      name: {
        en: 'Percent of health considered middling',
      },
      type: 'float',
      default: 0.8,
    },
    {
      id: 'LowHealthThresholdPercent',
      name: {
        en: 'Percent of health considered low',
      },
      type: 'float',
      default: 0.2,
    },
    {
      id: 'BigBuffShowCooldownSeconds',
      name: {
        en: 'Minimum seconds on a cooldown before shown',
      },
      type: 'float',
      default: 20,
    },
    {
      id: 'BigBuffIconWidth',
      name: {
        en: 'Width of buff icons (px)',
      },
      type: 'integer',
      default: 44,
    },
    {
      id: 'BigBuffIconHeight',
      name: {
        en: 'Height of buff icons (px)',
      },
      type: 'integer',
      default: 32,
    },
    {
      id: 'BigBuffBarHeight',
      name: {
        en: 'Height of buff timer bars (px)',
      },
      type: 'integer',
      default: 5,
    },
    {
      id: 'BigBuffTextHeight',
      name: {
        en: 'Height of buff text (px)',
      },
      type: 'integer',
      default: 0,
    },
    {
      id: 'BigBuffBorderSize',
      name: {
        en: 'Size of buff borders (px)',
      },
      type: 'integer',
      default: 1,
    },
  ],
});
