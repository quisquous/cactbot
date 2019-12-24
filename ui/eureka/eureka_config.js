'use strict';

UserConfig.registerOptions('eureka', {
  options: [
    {
      id: 'FlagTimeoutSeconds',
      name: {
        en: 'Duration of flags on the map (seconds)',
      },
      type: 'float',
      default: 90,
      setterFunc: (options, value) => {
        options['FlagTimeoutMs'] = value * 1000;
      },
    },
    {
      id: 'PopVolume',
      name: {
        en: 'Volume of the nm pop sound (0-1)',
      },
      type: 'float',
      default: 1,
    },
    {
      id: 'RefreshRateSeconds',
      name: {
        en: 'Update rate of nm cooldowns (seconds)',
      },
      type: 'float',
      default: 1,
      setterFunc: (options, value) => {
        options['RefreshRateMs'] = value * 1000;
      },
    },
  ],
});
