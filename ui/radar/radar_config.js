'use strict';

UserConfig.registerOptions('radar', {
  options: [
    {
      id: 'DetectionRange',
      name: {
        en: 'Minimum distance to detect mobs (yalms)',
        fr: 'Distance minimale pour détection des mobs (yalms)',
      },
      type: 'float',
      default: 0,
    },
    {
      id: 'TTS',
      name: {
        en: 'Announce new mobs with text to speech',
        fr: 'Annoncer les nouveaux mobs via TTS',
      },
      type: 'checkbox',
      default: false,
    },
    {
      id: 'PopSoundAlert',
      name: {
        en: 'Announce new mobs with a sound',
        fr: 'Annoncer les nouveaux mobs avec un son',
      },
      type: 'checkbox',
      default: true,
    },
    {
      id: 'PopVolume',
      name: {
        en: 'Volume to play pop sound (0-1)',
        fr: 'Volume du son (0-1)',
      },
      type: 'float',
      default: 0.5,
    },
    {
      id: 'Puller',
      name: {
        en: 'Show puller of mob',
        fr: 'Afficher le puller du mob',
      },
      type: 'checkbox',
      default: true,
    },
    {
      id: 'Position',
      name: {
        en: 'Show position of mob',
        fr: 'Afficher la position du mob',
      },
      type: 'checkbox',
      default: true,
    },
  ],
});
