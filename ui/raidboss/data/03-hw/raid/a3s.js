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
        fr: 'Déplacez les boss',
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
        fr: 'Eclusage sur Vous',
        cn: '蓝点名',
      },
    },
    {
      id: 'A3S Digititis Tank',
      regex: Regexes.headMarker({ id: '0025' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Tank Debuff',
        fr: 'Debuff vulnérabilité',
        cn: '坦克 Debuff',
      },
    },
    {
      id: 'A3S Digititis Healer',
      regex: Regexes.headMarker({ id: '0022' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Healer Debuff',
        fr: 'Debuff soins',
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
        fr: 'Debuff dégats',
        cn: 'DPS Debuff',
      },
    },
    {
      id: 'A3S Equal Concentration',
      regex: Regexes.ability({ source: ['Liquid Limb', 'Living Liquid'], id: 'F09', capture: false }),
      infoText: {
        en: 'Burn Higher HP Hand',
        fr: 'Burn sur la main au PV le plus élevée',
        cn: '转火血多手',
      },
    },
    {
      id: 'A3S Drainage You',
      regex: Regexes.tether({ id: '0005', target: 'Living Liquid' }),
      condition: function(data, matches) {
        return data.source == data.me;
      },
      alertText: {
        en: 'Drainage on YOU',
        fr: 'Drainage sur VOUS',
        cn: '连线点名',
      },
    },
    {
      id: 'A3S Drainage Tank',
      regex: Regexes.tether({ id: '0005', target: 'Living Liquid', capture: false }),
      condition: function(data) {
        return data.role == 'tank';
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Get drainage tether',
        fr: 'Prenez un lien drainage',
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
            fr: 'Répulsion : Rapprochez-vous de ' + data.ShortName(partner),
            cn: '同极：靠近' + data.ShortName(partner),
          };
        }

        return {
          en: 'Attract: away from ' + data.ShortName(partner),
          fr: 'Attraction : Eloignez-vous de ' + data.ShortName(partner),
          cn: '异极：远离' + data.ShortName(partner),
        };
      },
    },
    {
      id: 'A3S Cascade',
      regex: Regexes.startsUsing({ source: 'Living Liquid', id: 'EFE', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      // aka Liquid Gaol
      id: 'A3S Throttle',
      regex: Regexes.ability({ source: 'Liquid Rage', id: 'F1A' }),
      condition: function(data) {
        return data.CanCleanse();
      },
      alertText: function(data, matches) {
        return {
          en: 'Throttle on ' + data.ShortName(matches.target),
          fr: 'Geôle liquide sur ' + data.ShortName(matches.target),
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
            fr: 'Griffe sur VOUS',
            cn: '抓奶手点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Claw on ' + data.ShortName(matches.target),
            fr: 'Griffe sur ' + data.ShortName(matches.target),
            cn: '抓奶手点' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      // aka Pressurize
      id: 'A3S Embolus',
      regex: Regexes.ability({ source: 'Living Liquid', id: 'F1B', capture: false }),
      condition: function(data) {
        return data.role == 'tank' || data.job == 'blu';
      },
      infoText: {
        en: 'Embolus: Move Boss',
        fr: 'Caillot : Déplacez le boss',
        cn: '水球出现：拉走BOSS',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'fr',
      'replaceSync': {
        'Hydrate Core': 'Noyau d\'hydrate',
        'Liquid Limb': 'Membre Liquide',
        'Liquid Rage': 'Furie liquide',
        'Living Liquid': 'Liquide vivant',
      },
      'replaceText': {
        'Cascade': 'Cascade',
        'Digititis': 'Phalangette',
        'Drainage': 'Drainage',
        'Embolus': 'Caillot',
        'Equal Concentration': 'Nivellement aqueux',
        'Ferrofluid': 'Ferrofluide',
        'Fluid Claw': 'Griffe fluide',
        'Fluid Strike': 'Frappe fluide',
        'Fluid Swing': 'Coup fluide',
        'Gear Lubricant': 'Lubrifiant d\'engrenage',
        'Hand Of Pain': 'Main de douleur',
        'Hand Of Parting': 'Main de séparation',
        'Hand Of Prayer': 'Main de prière',
        'Hydromorph': 'Hydromorphe',
        'Magnetism': 'Magnétisme',
        'Piston Lubricant': 'Lubrifiant de piston',
        'Protean Wave': 'Vague inconstante',
        'Repel': 'Repoussement',
        'Sluice': 'Éclusage',
        'Splash': 'Éclaboussement',
        'Throttle': 'Geôle liquide',
        'Wash Away': 'Lessivage',
      },
    },
  ],
}];
