'use strict';

UserConfig.registerOptions('eureka', {
  options: [
    {
      id: 'FlagTimeoutSeconds',
      name: {
        en: 'Duration of flags on the map (seconds)',
        fr: 'Durée des drapeaux sur la carte (s)',
        cn: '地图标志显示时间（秒）',
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
        fr: 'Volume des sons NM (0-1)',
        cn: 'NM提示音量（0-1）',
      },
      type: 'float',
      default: 1,
    },
    {
      id: 'RefreshRateSeconds',
      name: {
        en: 'Update rate of nm cooldowns (seconds)',
        fr: 'Vitesse de rafraîchissement des cooldowns NM (s)',
        cn: 'NM冷却刷新率（秒）',
      },
      type: 'float',
      default: 1,
      setterFunc: (options, value) => {
        options['RefreshRateMs'] = value * 1000;
      },
    },
  ],
});
