'use strict';

[{
  zoneRegex: /^Mt\. Gulg$/,
  timelineFile: 'mt_gulg.txt',
  triggers: [
    {
      id: 'Gulg Punitive Light',
      regex: / 14:41AF:Forgiven Prejudice starts using Punitive Light/,
      regexDe: / 14:41AF:Geläuterte Voreingenommenheit starts using Strafendes Licht/,
      regexFr: / 14:41AF:Préjugé Pardonné starts using Lumière [pP]unitive/,
      regexJa: / 14:41AF:フォーギヴン・プレジュディス starts using ピューニティブライト/,
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
      regex: / 14:41AB:Forgiven Ambition starts using Tail Smash/,
      regexDe: / 14:41AB:Geläuterte Begierde starts using Schweifschlag/,
      regexFr: / 14:41AB:Ambition Pardonnée starts using Queue [fF]racassante/,
      regexJa: / 14:41AB:フォーギヴン・アンビション starts using テールスマッシュ/,
      infoText: {
        en: 'Ambition Tail Smash',
        de: 'Begierde Schweifschlag',
        fr: 'Evitez la queue',
      },
    },
    {
      id: 'Gulg Rake',
      regex: / 14:3CFB:Forgiven Cruelty starts using Rake on (\y{Name})/,
      regexDe: / 14:3CFB:Geläutert Grausamkeit starts using Prankenhieb on (\y{Name})/,
      regexFr: / 14:3CFB:Cruauté Pardonnée starts using Griffes on (\y{Name})/,
      regexJa: / 14:3CFB:フォーギヴン・クルエルティー starts using ひっかき on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Gulg Lumen Infinitum',
      regex: / 14:41B2:Forgiven Cruelty starts using Lumen Infinitum/,
      regexDe: / 14:41B2:Geläuterte Grausamkeit starts using Lumen Infinitem/,
      regexFr: / 14:41B2:Cruauté Pardonnée starts using Lumen [iI]nfinitum/,
      regexJa: / 14:41B2:フォーギヴン・クルエルティー starts using ルーメンインフィニーテム/,
      alertText: {
        en: 'Frontal Laser',
        de: 'Frontaler Laser',
        fr: 'Laser frontal',
      },
    },
    {
      id: 'Gulg Cyclone Wing',
      regex: / 14:3CFC:Forgiven Cruelty starts using Cyclone Wing/,
      regexDe: / 14:3CFC:Geläuterte Grausamkeit starts using Zyklonschwinge/,
      regexFr: / 14:3CFC:Cruauté Pardonnée starts using Aile [dD]e [cC]yclone/,
      regexJa: / 14:3CFC:フォーギヴン・クルエルティー starts using サイクロンウィング/,
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
      regex: / 14:3D00:Forgiven Cruelty starts using Typhoon Wing/,
      regexDe: / 14:3D00:Geläuterte Grausamkeit starts using Taifunschwinge/,
      regexFr: / 14:3D00:Cruauté Pardonnée starts using Aile [dD]e [tT]yphon/,
      regexJa: / 14:3D00:フォーギヴン・クルエルティー starts using タイフーンウィング/,
      supressSeconds: 5,
      infoText: {
        en: 'dodge wind cones',
        de: 'Wind-Fächerflächen ausweichen',
        fr: 'Evitez les cônes de vent',
      },
    },
    {
      id: 'Gulg Typhoon Wing 2',
      regex: / 14:3D0[12]:Forgiven Cruelty starts using Typhoon Wing/,
      regexDe: / 14:3D0[12]:Geläuterte Grausamkeit starts using Taifunschwinge/,
      regexFr: / 14:3D0[12]:Cruauté Pardonnée starts using Aile [dD]e [tT]yphon/,
      regexJa: / 14:3D0[12]:フォーギヴン・クルエルティー starts using タイフーンウィング/,
      supressSeconds: 5,
      infoText: {
        en: 'out of melee, dodge cones',
        de: 'Nahkämpfer raus, Wind-Fächerflächen ausweichen',
        fr: 'Distants, évitez les cônes',
      },
    },
    {
      id: 'Gulg Sacrament of Penance',
      regex: / 14:3D0B:Forgiven Whimsy starts using Sacrament of Penance/,
      regexDe: / 14:3D0B:Geläuterte Gereiztheit starts using Sakrament der Vergebung/,
      regexFr: / 14:3D0B:Caprice Pardonné starts using Sacrement [dD]e [pP]énitence/,
      regexJa: / 14:3D0B:フォーギヴン・ウィムズィー starts using 恩赦の秘跡/,
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
      regex: / 14:3D09:Forgiven Whimsy starts using Catechism/,
      regexDe: / 14:3D09:Geläuterte Gereiztheit starts using Heiliger Vers/,
      regexFr: / 14:3D09:Caprice Pardonné starts using Texte [sS]acré/,
      regexJa: / 14:3D09:フォーギヴン・ウィムズィー starts using 聖句/,
      alertText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Gulg Judgment Day',
      regex: / 14:3D0F:Forgiven Whimsy starts using Judgment Day/,
      regexDe: / 14:3D0F:Geläuterte Gereiztheit starts using Gnädiges Urteil/,
      regexFr: / 14:3D0F:Caprice Pardonné starts using Condamnation [sS]acramentelle/,
      regexJa: / 14:3D0F:フォーギヴン・ウィムズィー starts using 断罪礼儀/,

      infoText: {
        en: 'Get Towers',
        de: 'Türme nehmen',
        fr: 'Dans les tours',
      },
    },
    {
      id: 'Gulg Left Palm',
      regex: / 14:3F7A:Forgiven Revelry starts using Left Palm/,
      regexDe: / 14:3F7A:Geläuterte Prasserei starts using Linke Handfläche/,
      regexFr: / 14:3F7A:Orgie Pardonnée starts using Main [gG]auche [éÉ]tincelante/,
      regexJa: / 14:3F7A:フォーギヴン・レヴェルリー starts using 輝く左手/,
      infoText: {
        en: 'Left',
        de: 'Links',
        fr: 'Gauche',
      },
    },
    {
      id: 'Gulg Right Palm',
      regex: / 14:3F78:Forgiven Revelry starts using Right Palm/,
      regexDe: / 14:3F78:Geläuterte Prasserei starts using Rechte Handfläche/,
      regexFr: / 14:3F78:Orgie Pardonnée starts using Main [dD]roite [éÉ]tincelante/,
      regexJa: / 14:3F78:フォーギヴン・レヴェルリー starts using 輝く右手/,
      infoText: {
        en: 'Right',
        de: 'Rechts',
        fr: 'Droite',
      },
    },
    {
      id: 'Gulg Orison Fortissimo',
      regex: / 14:3D14:Forgiven Obscenity starts using Orison Fortissimo/,
      regexDe: / 14:3D14:Geläuterte Unzucht starts using Fürbitte fortissimo/,
      regexFr: / 14:3D14:Obscénité Pardonnée starts using Horizon - [fF]ortissimo/,
      regexJa: / 14:3D14:フォーギヴン・オブセニティー starts using オリゾン・フォルティッシモ/,
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
      regex: / 14:3D12:Forgiven Obscenity starts using Sacrament Sforzando/,
      regexDe: / 14:3D12:Geläuterte Unzucht starts using Sakrament sforzato/,
      regexFr: / 14:3D12:Obscénité Pardonnée  starts using Sacrement - [sS]forzando/,
      regexJa: / 14:3D12:フォーギヴン・オブセニティー starts using サクラメント・スフォルツァンド/,
      alertText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Gulg Divine Diminuendo',
      regex: / 14:3D18:Forgiven Obscenity starts using Divine Diminuendo/,
      regexDe: / 14:3D18:Geläuterte Unzucht starts using Dogma diminuendo/,
      regexFr: / 14:3D18:Obscénité Pardonnée starts using Divin - [dD]iminuendo/,
      regexJa: / 14:3D18:フォーギヴン・オブセニティー starts using ディヴァイン・ディミヌエンド/,
      infoText: {
        en: 'max melee range',
        de: 'Maximale Nahkämpfer Entfernung',
        fr: 'Limite de zone CaC',
      },
    },
    {
      id: 'Gulg Conviction Marcato',
      regex: / 14:3D1A:Forgiven Obscenity starts using Conviction Marcato/,
      regexDe: / 14:3D1A:Geläuterte Unzucht starts using Mette marcato/,
      regexFr: / 14:3D1A:Obscénité Pardonnée starts using Conviction - [mM]arcato/,
      regexJa: / 14:3D1A:フォーギヴン・オブセニティー starts using コンヴィクション・マルカート/,
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
