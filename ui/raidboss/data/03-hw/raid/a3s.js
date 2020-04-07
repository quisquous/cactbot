'use strict';

// TODO: need headmarker for damage down digititis

[{
  zoneRegex: {
    en: /^Alexander - The Arm Of The Father \(Savage\)$/,
    cn: /^亚历山大零式机神城 \(启动之章3\)$/,
  },
  timelineFile: 'a3s.txt',
  timelineTriggers: [
    {
      id: 'A3S Wash Away',
      regex: /Wash Away/,
      beforeSeconds: 5,
      response: Responses.knockback(),
    },
    {
      id: 'A3S Splash',
      regex: /Splash/,
      beforeSeconds: 5,
      response: Responses.aoe(),
    },
    {
      // Note: there's nothing in the log for when the hand turns into an
      // open palm or a fist, so this just warns when to move and not
      // where to go based on time.
      id: 'A3S Hand of Stuff',
      regex: /Hand of Prayer\/Parting/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role == 'tank' || data.job == 'blu';
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Move Bosses',
        de: 'Bosse bewegen',
        ja: 'ボス動かして',
        ko: '보스 이동 주차',
        cn: '移动Boss',
      },
    },
  ],
  triggers: [
    {
      id: 'A3S Sluice',
      regex: Regexes.headMarker({ id: '001A' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Sluice on YOU',
        de: 'Schleusenöffnung auf DIR',
        cn: '蓝点名',
      },
    },
    {
      id: 'A3S Digititis Tank',
      regex: Regexes.headMarker({ id: '0025' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Tank Debuff',
        de: 'Tank Debuff',
        cn: '坦克 Debuff',
      },
    },
    {
      id: 'A3S Digititis Healer',
      regex: Regexes.headMarker({ id: '0022' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Healer Debuff',
        de: 'Heiler Debuff',
        cn: '奶妈 Debuff',
      },
    },
    {
      // TODO: fill this id in
      id: 'A3S Digititis Damage',
      regex: Regexes.headMarker({ id: '00XX' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Damage Debuff',
        de: 'DD Debuff',
        cn: 'DPS Debuff',
      },
    },
    {
      id: 'A3S Equal Concentration',
      regex: Regexes.ability({ source: ['Liquid Limb', 'Living Liquid'], id: 'F09', capture: false }),
      regexDe: Regexes.ability({ source: ['Belebt(?:e|er|es|en) Hand', 'Belebt(?:e|er|es|en) Wasser'], id: 'F09', capture: false }),
      regexFr: Regexes.ability({ source: ['Membre Liquide', 'Liquide Vivant'], id: 'F09', capture: false }),
      regexJa: Regexes.ability({ source: ['リキッドハンド', 'リビングリキッド'], id: 'F09', capture: false }),
      regexCn: Regexes.ability({ source: ['活水之手', '有生命活水'], id: 'F09', capture: false }),
      regexKo: Regexes.ability({ source: ['액체 손', ''], id: 'F09', capture: false }),
      infoText: {
        en: 'Burn Higher HP Hand',
        de: 'Fokusiere Hand mit mehr HP',
        cn: '转火血多手',
      },
    },
    {
      id: 'A3S Drainage You',
      regex: Regexes.tether({ id: '0005', target: 'Living Liquid' }),
      regexDe: Regexes.tether({ id: '0005', target: 'Belebt(?:e|er|es|en) Wasser' }),
      regexFr: Regexes.tether({ id: '0005', target: 'Liquide Vivant' }),
      regexJa: Regexes.tether({ id: '0005', target: 'リビングリキッド' }),
      regexCn: Regexes.tether({ id: '0005', target: '有生命活水' }),
      regexKo: Regexes.tether({ id: '0005', target: '살아있는 액체' }),
      condition: function(data, matches) {
        return data.source == data.me;
      },
      alertText: {
        en: 'Drainage on YOU',
        de: 'Entwässerung auf DIR',
        cn: '连线点名',
      },
    },
    {
      id: 'A3S Drainage Tank',
      regex: Regexes.tether({ id: '0005', target: 'Living Liquid', capture: false }),
      regexDe: Regexes.tether({ id: '0005', target: 'Belebt(?:e|er|es|en) Wasser', capture: false }),
      regexFr: Regexes.tether({ id: '0005', target: 'Liquide Vivant', capture: false }),
      regexJa: Regexes.tether({ id: '0005', target: 'リビングリキッド', capture: false }),
      regexCn: Regexes.tether({ id: '0005', target: '有生命活水', capture: false }),
      regexKo: Regexes.tether({ id: '0005', target: '살아있는 액체', capture: false }),
      condition: function(data) {
        return data.role == 'tank';
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Get drainage tether',
        de: 'Hole die Entwässerungs-Verbindung',
        cn: '接线',
      },
    },
    {
      id: 'A3S Ferrofluid Tether',
      regex: Regexes.tether({ id: '0026' }),
      run: function(data, matches) {
        data.ferroTether = data.ferroTether || {};
        data.ferroTether[matches.source] = matches.target;
        data.ferroTether[matches.target] = matches.source;
      },
    },
    {
      id: 'A3S Ferrofluid Signs',
      regex: Regexes.headMarker({ id: ['0030', '0031'] }),
      run: function(data, matches) {
        data.ferroMarker = data.ferroMarker || [];
        data.ferroMarker[matches.target] = matches.id;
      },
    },
    {
      // From logs, it appears that tethers, then headmarkers, then starts casting occurs.
      id: 'A3S Ferrofluid',
      regex: Regexes.startsUsing({ source: 'Living Liquid', id: 'F01' }),
      regexDe: Regexes.startsUsing({ source: 'Belebt(?:e|er|es|en) Wasser', id: 'F01' }),
      regexFr: Regexes.startsUsing({ source: 'Liquide Vivant', id: 'F01' }),
      regexJa: Regexes.startsUsing({ source: 'リビングリキッド', id: 'F01' }),
      regexCn: Regexes.startsUsing({ source: '有生命活水', id: 'F01' }),
      regexKo: Regexes.startsUsing({ source: '살아있는 액체', id: 'F01' }),
      alertText: function(data, matches) {
        data.ferroTether = data.ferroTether || {};
        data.ferroMarker = data.ferroMarker || [];
        let partner = data.ferroTether[data.me];
        let marker1 = data.ferroMarker[data.me];
        let marker2 = data.ferroMarker[partner];

        if (!partner || !marker1 || !marker2)
          return matches.ability + ' (???)';

        if (marker1 == marker2) {
          return {
            en: 'Repel: close to ' + data.ShortName(partner),
            de: 'Abstoß: nahe bei ' + data.ShortName(partner),
            cn: '同极：靠近' + data.ShortName(partner),
          };
        }

        return {
          en: 'Attract: away from ' + data.ShortName(partner),
          de: 'Anziehung: weg von ' + data.ShortName(partner),
          cn: '异极：远离' + data.ShortName(partner),
        };
      },
    },
    {
      id: 'A3S Cascade',
      regex: Regexes.startsUsing({ source: 'Living Liquid', id: 'EFE', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Belebt(?:e|er|es|en) Wasser', id: 'EFE', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Liquide Vivant', id: 'EFE', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'リビングリキッド', id: 'EFE', capture: false }),
      regexCn: Regexes.startsUsing({ source: '有生命活水', id: 'EFE', capture: false }),
      regexKo: Regexes.startsUsing({ source: '살아있는 액체', id: 'EFE', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      // aka Liquid Gaol
      id: 'A3S Throttle',
      regex: Regexes.ability({ source: 'Liquid Rage', id: 'F1A' }),
      regexDe: Regexes.ability({ source: 'Levitiert(?:e|er|es|en) Rage', id: 'F1A' }),
      regexFr: Regexes.ability({ source: 'Furie Liquide', id: 'F1A' }),
      regexJa: Regexes.ability({ source: 'リキッドレイジ', id: 'F1A' }),
      regexCn: Regexes.ability({ source: '活水之怒', id: 'F1A' }),
      regexKo: Regexes.ability({ source: '분노한 액체', id: 'F1A' }),
      condition: function(data) {
        return data.CanCleanse();
      },
      alertText: function(data, matches) {
        return {
          en: 'Throttle on ' + data.ShortName(matches.target),
          de: 'Vollgas auf ' + data.ShortName(matches.target),
          cn: '窒息点' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'A3S Fluid Claw',
      regex: Regexes.headMarker({ id: '0010' }),
      alarmText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Claw on YOU',
            de: 'Klaue auf DIR',
            cn: '抓奶手点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Claw on ' + data.ShortName(matches.target),
            de: 'Klaue auf ' + data.ShortName(matches.target),
            cn: '抓奶手点' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      // aka Pressurize
      id: 'A3S Embolus',
      regex: Regexes.ability({ source: 'Living Liquid', id: 'F1B', capture: false }),
      regexDe: Regexes.ability({ source: 'Belebt(?:e|er|es|en) Wasser', id: 'F1B', capture: false }),
      regexFr: Regexes.ability({ source: 'Liquide Vivant', id: 'F1B', capture: false }),
      regexJa: Regexes.ability({ source: 'リビングリキッド', id: 'F1B', capture: false }),
      regexCn: Regexes.ability({ source: '有生命活水', id: 'F1B', capture: false }),
      regexKo: Regexes.ability({ source: '살아있는 액체', id: 'F1B', capture: false }),
      condition: function(data) {
        return data.role == 'tank' || data.job == 'blu';
      },
      infoText: {
        en: 'Embolus: Move Boss',
        de: 'Pfropfen: Boss bewegen',
        cn: '水球出现：拉走BOSS',
      },
    },
  ],
}];
