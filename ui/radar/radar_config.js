'use strict';

UserConfig.registerOptions('radar', {
  options: [
    {
      id: 'DetectionRange',
      name: {
        en: 'Minimum distance to detect mobs (yalms)',
      },
      type: 'float',
      default: 0,
    },
    {
      id: 'TTS',
      name: {
        en: 'Announce new mobs with text to speech',
      },
      type: 'checkbox',
      default: false,
    },
    {
      id: 'PopSoundAlert',
      name: {
        en: 'Announce new mobs with a sound',
      },
      type: 'checkbox',
      default: true,
    },
    {
      id: 'PopVolume',
      name: {
        en: 'Volume to play pop sound (0-1)',
      },
      type: 'float',
      default: 0.5,
    },
    {
      id: 'Puller',
      name: {
        en: 'Show puller of mob',
      },
      type: 'checkbox',
      default: true,
    },
    {
      id: 'Position',
      name: {
        en: 'Show position of mob',
      },
      type: 'checkbox',
      default: true,
    },
  ],
});
