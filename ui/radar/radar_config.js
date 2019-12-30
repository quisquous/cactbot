'use strict';

UserConfig.registerOptions('radar', {
  options: [
    {
      id: 'DetectionRange',
      name: {
        en: 'Minimum distance to detect mobs (yalms)',
        de: 'Minimum Entfernung um Mobs zu erkennen (in Yalms)',
        fr: 'Distance minimale pour détection des mobs (yalms)',
        cn: '探测目标最小距离（米）',
      },
      type: 'float',
      default: 0,
    },
    {
      id: 'TTS',
      name: {
        en: 'Announce new mobs with text to speech',
        de: 'Kündige neue Mobs mit TTS an',
        fr: 'Annoncer les nouveaux mobs via TTS',
        cn: '使用TTS提醒新发现目标',
      },
      type: 'checkbox',
      default: false,
    },
    {
      id: 'PopSoundAlert',
      name: {
        en: 'Announce new mobs with a sound',
        de: 'Kündige neue Mobs mit einem Sound an',
        fr: 'Annoncer les nouveaux mobs avec un son',
        cn: '使用声音提醒新发现目标',
      },
      type: 'checkbox',
      default: true,
    },
    {
      id: 'PopVolume',
      name: {
        en: 'Volume to play pop sound (0-1)',
        de: 'Lautstärke für den Popsound (0-1)',
        fr: 'Volume du son (0-1)',
        cn: '播放声音音量（0-1）',
      },
      type: 'float',
      default: 0.5,
    },
    {
      id: 'Puller',
      name: {
        en: 'Show puller of mob',
        de: 'Zeige den ersten Angreifer eines Mobs an',
        fr: 'Afficher le puller du mob',
        cn: '显示目标开怪者',
      },
      type: 'checkbox',
      default: true,
    },
    {
      id: 'Position',
      name: {
        en: 'Show position of mob',
        de: 'Zeige die Position eines Mobs',
        fr: 'Afficher la position du mob',
        cn: '显示目标位置',
      },
      type: 'checkbox',
      default: true,
    },
  ],
});
