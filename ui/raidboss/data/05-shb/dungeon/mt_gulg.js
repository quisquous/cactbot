'use strict';

[{
  zoneRegex: /^Mt\. Gulg$/,
  timelineFile: 'mt_gulg.txt',
  triggers: [
    {
      id: 'Gulg Punitive Light',
      regex: Regexes.startsUsing({ id: '41AF', source: 'Forgiven Prejudice', capture: false }),
      regexDe: Regexes.startsUsing({ id: '41AF', source: 'Geläutert(?:e|er|es|en) Voreingenommenheit', capture: false }),
      regexFr: Regexes.startsUsing({ id: '41AF', source: 'Préjugé Pardonné', capture: false }),
      regexJa: Regexes.startsUsing({ id: '41AF', source: 'フォーギヴン・プレジュディス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '41AF', source: '得到宽恕的偏见', capture: false }),
      regexKo: Regexes.startsUsing({ id: '41AF', source: '면죄된 편견', capture: false }),
      condition: function(data) {
        return data.CanStun() || data.CanSilence();
      },
      infoText: {
        en: 'Interrupt Prejudice',
        de: 'Unterbreche Voreingenommenheit',
        fr: 'Interrompez Préjugé Pardonnée',
      },
    },
    {
      id: 'Gulg Tail Smash',
      regex: Regexes.startsUsing({ id: '41AB', source: 'Forgiven Ambition', capture: false }),
      regexDe: Regexes.startsUsing({ id: '41AB', source: 'Geläutert(?:e|er|es|en) Begierde', capture: false }),
      regexFr: Regexes.startsUsing({ id: '41AB', source: 'Ambition Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '41AB', source: 'フォーギヴン・アンビション', capture: false }),
      regexCn: Regexes.startsUsing({ id: '41AB', source: '得到宽恕的奢望', capture: false }),
      regexKo: Regexes.startsUsing({ id: '41AB', source: '면죄된 야망', capture: false }),
      infoText: {
        en: 'Ambition Tail Smash',
        de: 'Begierde Schweifschlag',
        fr: 'Evitez la queue',
      },
    },
    {
      id: 'Gulg Rake',
      regex: Regexes.startsUsing({ id: '3CFB', source: 'Forgiven Cruelty' }),
      regexDe: Regexes.startsUsing({ id: '3CFB', source: 'Geläutert(?:e|er|es|en) Grausamkeit' }),
      regexFr: Regexes.startsUsing({ id: '3CFB', source: 'Cruauté Pardonnée' }),
      regexJa: Regexes.startsUsing({ id: '3CFB', source: 'フォーギヴン・クルエルティー' }),
      regexCn: Regexes.startsUsing({ id: '3CFB', source: '得到宽恕的残忍' }),
      regexKo: Regexes.startsUsing({ id: '3CFB', source: '면죄된 잔혹' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'Gulg Lumen Infinitum',
      regex: Regexes.startsUsing({ id: '41B2', source: 'Forgiven Cruelty', capture: false }),
      regexDe: Regexes.startsUsing({ id: '41B2', source: 'Geläutert(?:e|er|es|en) Grausamkeit', capture: false }),
      regexFr: Regexes.startsUsing({ id: '41B2', source: 'Cruauté Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '41B2', source: 'フォーギヴン・クルエルティー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '41B2', source: '得到宽恕的残忍', capture: false }),
      regexKo: Regexes.startsUsing({ id: '41B2', source: '면죄된 잔혹', capture: false }),
      alertText: {
        en: 'Frontal Laser',
        de: 'Frontaler Laser',
        fr: 'Laser frontal',
      },
    },
    {
      id: 'Gulg Cyclone Wing',
      regex: Regexes.startsUsing({ id: '3CFC', source: 'Forgiven Cruelty', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3CFC', source: 'Geläutert(?:e|er|es|en) Grausamkeit', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3CFC', source: 'Cruauté Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3CFC', source: 'フォーギヴン・クルエルティー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3CFC', source: '得到宽恕的残忍', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3CFC', source: '면죄된 잔혹', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Gulg Typhoon Wing 1',
      regex: Regexes.startsUsing({ id: '3D00', source: 'Forgiven Cruelty', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D00', source: 'Geläutert(?:e|er|es|en) Grausamkeit', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D00', source: 'Cruauté Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D00', source: 'フォーギヴン・クルエルティー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D00', source: '得到宽恕的残忍', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D00', source: '면죄된 잔혹', capture: false }),
      suppressSeconds: 5,
      infoText: {
        en: 'dodge wind cones',
        de: 'Wind-Fächerflächen ausweichen',
        fr: 'Evitez les cônes de vent',
      },
    },
    {
      id: 'Gulg Typhoon Wing 2',
      regex: Regexes.startsUsing({ id: '3D0[12]', source: 'Forgiven Cruelty', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D0[12]', source: 'Geläutert(?:e|er|es|en) Grausamkeit', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D0[12]', source: 'Cruauté Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D0[12]', source: 'フォーギヴン・クルエルティー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D0[12]', source: '得到宽恕的残忍', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D0[12]', source: '면죄된 잔혹', capture: false }),
      suppressSeconds: 5,
      infoText: {
        en: 'out of melee, dodge cones',
        de: 'Nahkämpfer raus, Wind-Fächerflächen ausweichen',
        fr: 'Distants, évitez les cônes',
      },
    },
    {
      id: 'Gulg Sacrament of Penance',
      regex: Regexes.startsUsing({ id: '3D0B', source: 'Forgiven Whimsy', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D0B', source: 'Geläutert(?:e|er|es|en) Gereiztheit', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D0B', source: 'Caprice Pardonné', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D0B', source: 'フォーギヴン・ウィムズィー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D0B', source: '得到宽恕的无常', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D0B', source: '면죄된 변덕', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Gulg Catechism',
      // no target name
      regex: Regexes.startsUsing({ id: '3D09', source: 'Forgiven Whimsy', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D09', source: 'Geläutert(?:e|er|es|en) Gereiztheit', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D09', source: 'Caprice Pardonné', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D09', source: 'フォーギヴン・ウィムズィー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D09', source: '得到宽恕的无常', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D09', source: '면죄된 변덕', capture: false }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      alertText: {
        en: 'tank buster',
        de: 'Tankbuster',
        fr: 'Tankbuster',
      },
    },
    {
      id: 'Gulg Judgment Day',
      regex: Regexes.startsUsing({ id: '3D0F', source: 'Forgiven Whimsy', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D0F', source: 'Geläutert(?:e|er|es|en) Gereiztheit', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D0F', source: 'Caprice Pardonné', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D0F', source: 'フォーギヴン・ウィムズィー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D0F', source: '得到宽恕的无常', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D0F', source: '면죄된 변덕', capture: false }),
      infoText: {
        en: 'Get Towers',
        de: 'Türme nehmen',
        fr: 'Dans les tours',
      },
    },
    {
      id: 'Gulg Left Palm',
      regex: Regexes.startsUsing({ id: '3F7A', source: 'Forgiven Revelry', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3F7A', source: 'Geläutert(?:e|er|es|en) Prasserei', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3F7A', source: 'Orgie Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3F7A', source: 'フォーギヴン・レヴェルリー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3F7A', source: '得到宽恕的放纵', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3F7A', source: '면죄된 환락', capture: false }),
      infoText: {
        en: 'Left',
        de: 'Links',
        fr: 'Gauche',
      },
    },
    {
      id: 'Gulg Right Palm',
      regex: Regexes.startsUsing({ id: '3F78', source: 'Forgiven Revelry', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3F78', source: 'Geläutert(?:e|er|es|en) Prasserei', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3F78', source: 'Orgie Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3F78', source: 'フォーギヴン・レヴェルリー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3F78', source: '得到宽恕的放纵', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3F78', source: '면죄된 환락', capture: false }),
      infoText: {
        en: 'Right',
        de: 'Rechts',
        fr: 'Droite',
      },
    },
    {
      id: 'Gulg Orison Fortissimo',
      regex: Regexes.startsUsing({ id: '3D14', source: 'Forgiven Obscenity', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D14', source: 'Geläutert(?:e|er|es|en) Unzucht', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D14', source: 'Obscénité Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D14', source: 'フォーギヴン・オブセニティー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D14', source: '得到宽恕的猥亵', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D14', source: '면죄된 외설', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Gulg Sforzando',
      // no target name
      regex: Regexes.startsUsing({ id: '3D12', source: 'Forgiven Obscenity', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D12', source: 'Geläutert(?:e|er|es|en) Unzucht', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D12', source: 'Obscénité Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D12', source: 'フォーギヴン・オブセニティー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D12', source: '得到宽恕的猥亵', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D12', source: '면죄된 외설', capture: false }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      alertText: {
        en: 'tank buster',
        de: 'Tankbuster',
        fr: 'Tankbuster',
      },
    },
    {
      id: 'Gulg Divine Diminuendo',
      regex: Regexes.startsUsing({ id: '3D18', source: 'Forgiven Obscenity', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D18', source: 'Geläutert(?:e|er|es|en) Unzucht', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D18', source: 'Obscénité Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D18', source: 'フォーギヴン・オブセニティー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D18', source: '得到宽恕的猥亵', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D18', source: '면죄된 외설', capture: false }),
      infoText: {
        en: 'max melee range',
        de: 'Maximale Nahkämpfer Entfernung',
        fr: 'Limite de zone CaC',
      },
    },
    {
      id: 'Gulg Conviction Marcato',
      regex: Regexes.startsUsing({ id: '3D1A', source: 'Forgiven Obscenity', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3D1A', source: 'Geläutert(?:e|er|es|en) Unzucht', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3D1A', source: 'Obscénité Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3D1A', source: 'フォーギヴン・オブセニティー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3D1A', source: '得到宽恕的猥亵', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3D1A', source: '면죄된 외설', capture: false }),
      infoText: {
        en: 'Behind Boss',
        de: 'Hinter den Boss',
        fr: 'Derrière le boss',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Forgiven Obscenity': 'geläuterte Unzucht',
        'Forgiven Cruelty': 'geläuterte Grausamkeit',
        'Forgiven Whimsy': 'geläuterte Gereiztheit',
        'Brightsphere': 'Lichtsphäre',
        'The Winding Flare': 'Die Strahlenden Stufen',
        'The White Gate': 'Die Weiße Pforte',
        'The Perished Path': 'Pfad ohne Halt',
      },
      'replaceText': {
        'Lumen Infinitum': 'Lumen Infinitem',
        'Typhoon Wing': 'Taifunschwinge',
        'Cyclone Wing': 'Zyklonschwinge',
        'Perfect Contrition': 'Buße',
        'Divine Diminuendo': 'Dogma diminuendo',
        'Exegesis': 'Strafpredigt',
        'Orison Fortissimo': 'Fürbitte fortissimo',
        'Ringsmith': 'Ring der Beständigkeit',
        'Judged': 'Verurteilung',
        'Sacrament Of Penance': 'Sakrament der Vergebung',
        'Reformation': 'Gegenreformation',
        'Catechism': 'Heiliger Vers',
        'Rite Of The Sacrament': 'Beichte',
        'Judgment Day': 'Gnädiges Urteil',
        'Conviction Marcato': 'Mette marcato',
        'Penance Pianissimo': 'Predigt pianissimo',
        'Feather Marionette': 'Lebendige Feder',
        'Solitaire Ring': 'Solitärring',
        'Gold Chaser': 'Goldene Feder ',
        'Sacrament Sforzando': 'Sakrament sforzato',
        'Hurricane Wing': 'Hurrikanschwinge',
        'Rake': 'Prankenhieb',
      },
    },
  ],
}];
