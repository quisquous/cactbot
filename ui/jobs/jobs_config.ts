import UserConfig from '../../resources/user_config';

UserConfig.registerOptions('jobs', {
  options: [
    {
      id: 'JustBuffTracker',
      name: {
        en: 'Only show the party buff tracker',
        de: 'Zeige nur den Gruppen Buff-Tracker',
        fr: 'Afficher seulement le tracker de buff de l\'équipe',
        ja: 'シナジー効果のみを表示する',
        cn: '仅监控团辅技能',
        ko: '파티 버프만 표시',
      },
      type: 'checkbox',
      default: false,
    },
    {
      id: 'CompactView',
      name: {
        en: 'Enable compact view',
        de: 'Kompaktansicht aktivieren',
        fr: 'Activer la vue compacte',
        ja: 'コンパクトUIを有効にする',
        cn: '启用紧凑视图',
        ko: '간략한 UI 사용',
      },
      type: 'checkbox',
      default: false,
    },
    {
      id: 'LowerOpacityOutOfCombat',
      name: {
        en: 'Lower ui opacity when out of combat',
        de: 'Veringere die Deckkraft auserhalb des Kampfes',
        fr: 'Diminiuer l\'opacité de l\'UI hors combat',
        ja: '非戦闘時にUIを透過する',
        cn: '非战斗状态时使UI半透明',
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
        fr: 'Opacité de l\'UI hors combat',
        ja: '非戦闘時のUI透過度',
        cn: '非战斗状态时的UI透明度',
        ko: '전투 중이 아닐 때, UI 투명도',
      },
      type: 'float',
      default: 0.5,
    },
    {
      id: 'PlayCountdownSound',
      name: {
        en: 'Enable countdown notification sound',
        de: 'Aktiviere Countdown Hinweis-Ton',
        fr: 'Activer la notification sonore du compte à rebours',
        ja: 'カウントダウンを音声で知らせる',
        cn: '启用倒计时提示音',
        ko: '초읽기 알림 소리 켜기',
      },
      type: 'checkbox',
      default: true,
    },
    {
      id: 'CountdownSoundVolume',
      name: {
        en: 'Countdown sound volume',
        de: 'Countdown Lautstärke',
        fr: 'Volume du compte à rebours',
        cn: '倒计时提示音量',
        ko: '초읽기 소리 크기',
      },
      type: 'float',
      default: 0.3,
    },
    {
      id: 'HideWellFedAboveSeconds',
      name: {
        en: 'Hide cheese icon when food > time (in seconds)',
        de: 'Verstecke das Käse Icon wenn Bufffood > Zeit (in Sekunden)',
        fr: 'Masquer l\'icône du fromage lorsque vous êtes repu > durée (en secondes)',
        ja: '飯効果の時間が不足したらチーズアイコンを表示する (秒)',
        cn: '食物 Buff 剩余时间不足警报 (秒)',
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
        fr: 'Afficher le symbole PM hors combat',
        ja: '非戦闘時にもMPを表示する',
        cn: '一直显示MP监控',
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
        ja: '健康なHPとして扱うHP量 (1 = 100%)',
        cn: '中等血量阈值 (1 = 100%)',
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
        ja: '危険なHPとして扱うHP量 (1 = 100%)',
        cn: '危险血量阈值 (1 = 100%)',
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
        fr: 'Nombre minimal de secondes avant l\'affichage du temps de recharge',
        ja: 'シナジースキルが使用可能前にアイコンを表示する (秒)',
        cn: '团辅冷却完成预告 (秒)',
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
        ja: 'シナジースキルのアイコンの広さ (pixel)',
        cn: '团辅监控图标宽度 (像素)',
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
        ja: 'シナジースキルのアイコンの高さ (pixel)',
        cn: '团辅监控图标高度 (像素)',
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
        fr: 'Hauteur des barres de temps de buff (pixel)',
        ja: 'シナジースキルのタイムバーの高さ (pixel)',
        cn: '团辅监控计时条高度 (像素)',
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
        fr: 'Hauteur du texte de buff (pixel)',
        ja: 'シナジースキルのテキストの高さ (pixel)',
        cn: '团辅监控文字高度 (像素)',
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
        fr: 'Taille des bordures de buff (pixel)',
        ja: 'シナジースキルのボーダーの広さ (pixel)',
        cn: '团辅监控边框尺寸 (像素)',
        ko: '버프 아이콘 테두리 크기 (pixel)',
      },
      type: 'integer',
      default: 1,
    },
    {
      id: 'GpAlarmPoint',
      name: {
        en: 'GP alarm threshold (0 to disable)',
        de: 'SP Alarm Grenze (0 to disable)',
        fr: 'Seuil d\'alarme PR (0 pour désactiver)',
        ja: 'GPが低い時に警告する (０＝無効)',
        cn: '低采集力提示阈值 (0为禁用)',
        ko: 'GP 알람 설정값 (0 = 기능 정지)',
      },
      type: 'integer',
      default: 0,
    },
    {
      id: 'GpAlarmSoundVolume',
      name: {
        en: 'GP alarm sound (0-1)',
        de: 'SP Alarm Sound (0-1)',
        fr: 'Son d\'alarme PR (0-1)',
        ja: '低いGPの警告音量 (0-1)',
        cn: '低采集力提示音量 (0-1)',
        ko: 'GP 알람 소리 크기 (0-1)',
      },
      type: 'float',
      default: 0.8,
    },
    {
      id: 'NotifyExpiredProcsInCombat',
      name: {
        en:
          'Flash procs boxes of inactive dots/etc. up to n times while in combat. (-1: disabled, 0: infinite)',
        de:
          'Dot/etc. boxen blinken bis zu n mal wenn im Kampf und dot ist nicht aktiv. (-1: deaktiviert, 0: ohne Limit)',
        fr: 'Faire clignoter n fois les DoT/Buffs inactifs en combat (-1 : désactivé, 0 : infini)',
        ja: '戦闘中でDoT/バフが切ったらprocボックスをｎ回点滅させる(-1：無効、0：無限回数)',
        cn: '战斗中模块监控的重要DoT/Buff中断时令对应计时器闪烁N次（-1：禁用，0：无限闪烁）',
        ko: '도트나 버프가 꺼지면 프록 박스를 n번 깜빡하게 합니다. (-1: 비활성화, 0: 무한)',
      },
      type: 'integer',
      default: 5,
    },
    {
      id: 'NotifyExpiredProcsInCombatSound',
      name: {
        en: 'Play a sound notification if a proc box for dots/etc. expires while in combat.',
        de: 'Spiele einen Alarm Sound wenn eine dot/etc. box im Kampf inaktiv wird.',
        fr: 'Jouer un son si un Dot/Buff expire en combat.',
        ja: '戦闘中でDoT/バフが切ったら音を鳴らす',
        cn: '战斗中模块监控的重要DoT/Buff中断时播放提示音',
        ko: '도트나 버프가 꺼지면 소리로 알림을 줍니다.',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'When counter reaches 0.': 'expired',
          'When counter is close to 0.': 'threshold',
        },
        de: {
          'Deaktiviert': 'disabled',
          'Wenn der Countdown 0 erreicht.': 'expired',
          'Wenn der Countdown nahe 0 ist.': 'threshold',
        },
        fr: {
          'Désactivé': 'disabled',
          'Quand le compteur arrive à 0.': 'expired',
          'Quand le compteur est proche de 0.': 'threshold',
        },
        ja: {
          '無効': 'disabled',
          '残り時間 → 0': 'expired',
          '残り時間 → しきい値': 'threshold',
        },
        cn: {
          '禁用': 'disabled',
          '计时器归零时': 'expired',
          '计时器到达提示阈值时': 'threshold',
        },
        ko: {
          '비활성화': 'disabled',
          '카운트 다운이 0초일 때': 'expired',
          '리필하기 적절한 때에 알려주기': 'threshold',
        },
      },
      default: 'threshold',
    },
    {
      id: 'OptionGLA',
      name: {
        en: 'Option GLA',
        cn: '模块：剑术师',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionPLD',
      name: {
        en: 'Option PLD',
        cn: '模块：骑士',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionMRD',
      name: {
        en: 'Option MRD',
        cn: '模块：斧术师',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionWAR',
      name: {
        en: 'Option WAR',
        cn: '模块：战士',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionDRK',
      name: {
        en: 'Option DRK',
        cn: '模块：暗黑骑士',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionGNB',
      name: {
        en: 'Option GNB',
        cn: '模块：绝枪战士',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionCNJ',
      name: {
        en: 'Option CNJ',
        cn: '模块：幻术师',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionWHM',
      name: {
        en: 'Option WHM',
        cn: '模块：白魔法师',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionSCH',
      name: {
        en: 'Option SCH',
        cn: '模块：学者',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionAST',
      name: {
        en: 'Option AST',
        cn: '模块：占星术士',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionSGE',
      name: {
        en: 'Option SGE',
        cn: '模块：贤者',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionPGL',
      name: {
        en: 'Option PGL',
        cn: '模块：格斗家',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionMNK',
      name: {
        en: 'Option MNK',
        cn: '模块：武僧',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionLNC',
      name: {
        en: 'Option LNC',
        cn: '模块：枪术师',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionDRG',
      name: {
        en: 'Option DRG',
        cn: '模块：龙骑士',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionROG',
      name: {
        en: 'Option ROG',
        cn: '模块：双剑师',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionNIN',
      name: {
        en: 'Option NIN',
        cn: '模块：忍者',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionSAM',
      name: {
        en: 'Option SAM',
        cn: '模块：武士',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionRPR',
      name: {
        en: 'Option RPR',
        cn: '模块：钐镰客',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionARC',
      name: {
        en: 'Option ARC',
        cn: '模块：弓箭手',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionBRD',
      name: {
        en: 'Option BRD',
        cn: '模块：吟游诗人',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionMCH',
      name: {
        en: 'Option MCH',
        cn: '模块：机工士',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionDNC',
      name: {
        en: 'Option DNC',
        cn: '模块：舞者',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionACN',
      name: {
        en: 'Option ACN',
        cn: '模块：秘术师',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionSMN',
      name: {
        en: 'Option SMN',
        cn: '模块：召唤师',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionTHM',
      name: {
        en: 'Option THM',
        cn: '模块：咒术师',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionBLM',
      name: {
        en: 'Option BLM',
        cn: '模块：黑魔法师',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionRDM',
      name: {
        en: 'Option RDM',
        cn: '模块：赤魔法师',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionBLU',
      name: {
        en: 'Option BLU',
        cn: '模块：青魔法师',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionCRP',
      name: {
        en: 'Option CRP',
        cn: '模块：刻木匠',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionBSM',
      name: {
        en: 'Option BSM',
        cn: '模块：锻铁匠',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionARM',
      name: {
        en: 'Option ARM',
        cn: '模块：铸甲匠',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionGSM',
      name: {
        en: 'Option GSM',
        cn: '模块：雕金匠',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionLTW',
      name: {
        en: 'Option LTW',
        cn: '模块：制革匠',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionWVR',
      name: {
        en: 'Option WVR',
        cn: '模块：裁衣匠',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionALC',
      name: {
        en: 'Option ALC',
        cn: '模块：炼金术士',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionCUL',
      name: {
        en: 'Option CUL',
        cn: '模块：烹调师',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionMIN',
      name: {
        en: 'Option MIN',
        cn: '模块：采矿工',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionBTN',
      name: {
        en: 'Option BTN',
        cn: '模块：园艺工',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
    {
      id: 'OptionFSH',
      name: {
        en: 'Option FSH',
        cn: '模块：捕鱼人',
      },
      type: 'select',
      options: {
        en: {
          'Disabled': 'disabled',
          'Only Bar': 'onlyBar',
          'Enabled': 'enabled',
        },
        cn: {
          '禁用': 'disabled',
          '仅基础': 'onlyBar',
          '完整显示': 'enabled',
        },
      },
      default: 'enabled',
    },
  ],
});
