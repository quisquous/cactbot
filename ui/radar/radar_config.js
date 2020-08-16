'use strict';

UserConfig.registerOptions('radar', {
  options: [
    {
      id: 'BRankEnabled',
      name: {
        en: 'B-Rank enabled',
      },
      type: 'checkbox',
      default: true,
    },
    {
      id: 'DetectionRange',
      name: {
        en: 'Minimum distance to detect mobs (yalms)',
        de: 'Minimum Entfernung um Mobs zu erkennen (in Yalms)',
        fr: 'Distance minimale de détection des mobs (yalms)',
        ja: '最短探測距離 (ヤルム)',
        cn: '最短探测距离 (米)',
        ko: '몬스터를 탐지할 최소 거리 (미터)',
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
        ja: '沸きモブを探知したらTTSで知らせる',
        cn: '使用TTS提醒新发现目标',
        ko: '새 몬스터를 TTS로 알림',
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
        ja: '沸きモブを探知したら音声で知らせる',
        cn: '使用预设提示音提醒新发现目标',
        ko: '새 몬스터를 소리로 알림',
      },
      type: 'checkbox',
      default: true,
    },
    {
      id: 'PopVolume',
      name: {
        en: 'Volume to play pop sound (0-1)',
        de: 'Lautstärke für den Popsound (0-1)',
        fr: 'Volume du son lors d\'une apparition (0-1)',
        ja: 'お知らせ音声の音量 (0-1)',
        cn: '提示音的音量 (0-1)',
        ko: '소리 크기 (0-1)',
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
        ja: '最初にタゲ取った人の名前を表示',
        cn: '显示目标开怪者的名称',
        ko: '몬스터를 풀링한 사람 표시',
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
        ja: '沸きモブの位置を表示',
        cn: '显示目标位置',
        ko: '몬스터의 위치 표시',
      },
      type: 'checkbox',
      default: true,
    },
  ],
});
