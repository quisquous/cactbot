import UserConfig from '../../resources/user_config';

UserConfig.registerOptions('eureka', {
  options: [
    {
      id: 'Debug',
      name: {
        en: 'Enable debug mode',
        de: 'Aktiviere Debugmodus',
        fr: 'Activer le mode debug',
        ja: 'デバッグモードを有効にする',
        cn: '启用调试模式',
        ko: '디버그 모드 활성화',
      },
      default: false,
      type: 'checkbox',
      debugOnly: true,
    },
    {
      id: 'FlagTimeoutSeconds',
      name: {
        en: 'Duration of flags on the map (seconds)',
        de: 'Zeit der Flaggen auf der Karte (in Sekunden)',
        fr: 'Durée des drapeaux sur la carte en (s)',
        ja: 'マップにマーカーの表示時間 (秒)',
        cn: '地图标志显示时间 (秒)',
        ko: '지도에 깃발이 표시될 시간 (초)',
      },
      type: 'float',
      default: 90,
      setterFunc: (options, value) => {
        if (typeof value !== 'number')
          return;
        options['FlagTimeoutMs'] = value * 1000;
      },
    },
    {
      id: 'PopNoiseForNM',
      name: {
        en: 'Play pop sound for NMs',
        de: 'Spiele Pop-Sound ab für NMs',
        fr: 'Jouer un son pour l\'apparition des NMs',
        ja: 'NM通知機能を有効にする',
        cn: 'NM出现时播放提示音',
        ko: '돌발임무 알림 소리 켜기',
      },
      type: 'checkbox',
      default: true,
    },
    {
      id: 'PopNoiseForBunny',
      name: {
        en: 'Play pop sound for bunny fates',
        de: 'Spiele Pop-Sound ab für Bunny-Fates',
        fr: 'Jouer un son pour l\'apparition de l\'aléa des lapins',
        ja: 'しあわせうさぎ通知機能を有効にする',
        cn: '幸福兔出现时播放提示音',
        ko: '토끼 돌발 알림 소리 켜기',
      },
      type: 'checkbox',
      default: true,
    },
    {
      id: 'PopNoiseForSkirmish',
      name: {
        en: 'Play pop sound for skirmishes',
        de: 'Spiele Pop-Sound ab für Scharmützel',
        fr: 'Jouer un son pour l\'apparition des escarmouches',
        ja: 'スカーミッシュ通知機能を有効にする',
        cn: '冲突战出现时播放提示音',
        ko: '돌발 교전 알림 소리 켜기',
      },
      type: 'checkbox',
      default: false,
    },
    {
      id: 'PopNoiseForCriticalEngagement',
      name: {
        en: 'Play pop sound for critical engagements',
        de: 'Spiele Pop-Sound ab für Kritische Gefechte',
        fr: 'Jouer un son pour l\'apparition des affrontement cruciaux',
        ja: 'CE通知機能を有効にする',
        cn: '紧急遭遇战(CE)出现时播放提示音',
        ko: '비상 교전(CE) 알림 소리 켜기',
      },
      type: 'checkbox',
      default: true,
    },
    {
      id: 'PopNoiseForDuel',
      name: {
        en: 'Play pop sound for duels',
        de: 'Spiele Pop-Sound ab für Duelle',
        fr: 'Jouer un son pour l\'apparition des duels',
        ja: '一騎打ち通知機能を有効にする',
        cn: '一对一决斗出现时播放提示音',
        ko: '결투 알림 소리 켜기',
      },
      type: 'checkbox',
      default: false,
    },
    {
      id: 'PopVolume',
      name: {
        en: 'Volume of the nm pop sound (0-1)',
        de: 'Lautstärke des Popsounds bei erscheinen eines NM (0-1)',
        fr: 'Volume du son d\'apparition d\'un NM (0-1)',
        ja: 'NM出現音量 (0-1)',
        cn: 'NM提示音量 (0-1)',
        ko: '돌발임무 등장 알림 소리 크기 (0-1)',
      },
      type: 'float',
      default: 1,
      setterFunc: (options, value) => {
        options['PopVolume'] = value;
      },
    },
    {
      id: 'BunnyPopVolume',
      name: {
        en: 'Volume of the bunny pop sound (0-1)',
        de: 'Lautstärke des Bunny Pop Sounds (0-1)',
        fr: 'Volume du son d\'apparition des lapins (0-1)',
        ja: 'しあわせうさぎ出現音量 (0-1)',
        cn: '幸福兔提示音量（0-1）',
        ko: '토끼 돌발 등장 알림 소리 크기 (0-1)',
      },
      type: 'float',
      default: 0.3,
      setterFunc: (options, value) => {
        options['BunnyPopVolume'] = value;
      },
    },
    {
      id: 'CriticalPopVolume',
      name: {
        en: 'Volume of the critical engagement pop sound (0-1)',
        de: 'Lautstärke des Kritischen Gefecht Sounds (0-1)',
        fr: 'Volume du son d\'apparition des affrontements cruciaux (0-1)',
        ja: 'CE通知音量 (0-1)',
        cn: 'critical engagement提示音量（0-1）',
        ko: '비상 교전(CE) 알림 소리 크기 (0-1)',
      },
      type: 'float',
      default: 0.3,
      setterFunc: (options, value) => {
        options['CriticalPopVolume'] = value;
      },
    },
    {
      id: 'RefreshRateSeconds',
      name: {
        en: 'Update rate of nm cooldowns (seconds)',
        de: 'Aktualisierung der NM cooldowns (in Sekunden)',
        fr: 'Rafraîchissement du temps de réapparition d\'un NM (s)',
        ja: 'NMの再沸き時間のリフレッシュ間隔 (秒)',
        cn: 'NM冷却时间刷新间隔 (秒)',
        ko: '돌발 소환가능시간 갱신 주기 (초)',
      },
      type: 'float',
      default: 1,
      setterFunc: (options, value) => {
        if (typeof value !== 'number')
          return;
        options['RefreshRateMs'] = value * 1000;
      },
    },
  ],
});
