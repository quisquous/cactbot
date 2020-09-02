'use strict';

[{
  zoneId: ZoneId.TheHeroesGauntlet,
  timelineFile: 'heroes_gauntlet.txt',
  triggers: [
    {
      id: 'Heroes Gauntlet Spectral Dream',
      netRegex: NetRegexes.startsUsing({ id: '4FCB', source: 'Spectral Thief' }),
      netRegexDe: NetRegexes.startsUsing({ id: '4FCB', source: 'Phantom-Dieb' }),
      netRegexFr: NetRegexes.startsUsing({ id: '4FCB', source: 'Voleur Spectral' }),
      netRegexJa: NetRegexes.startsUsing({ id: '4FCB', source: '幻光のシーフ' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Heroes Gauntlet Spectral Gust',
      netRegex: NetRegexes.headMarker({ id: '00A9' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Heroes Gauntlet Spectral Whirlwind',
      netRegex: NetRegexes.startsUsing({ id: '4FCC', source: 'Spectral Thief', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4FCC', source: 'Phantom-Dieb', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4FCC', source: 'Voleur Spectral', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4FCC', source: '幻光のシーフ', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      // Spectral Thief tethers to the locations where it will attack.
      id: 'Heroes Gauntlet Spectral Tether',
      netRegex: NetRegexes.tether({ id: '000C', capture: false }),
      suppressSeconds: 5,
      infoText: {
        en: 'Away from tether marker',
        de: 'Weg von der Verbindung',
        fr: 'Éloignez-vous du marqueur de lien',
        ja: '線から離れ',
        ko: '이어진 표식으로부터 떨어지기',
      },
    },
    {
      id: 'Heroes Gauntlet Large Zombie Tether',
      netRegex: NetRegexes.tether({ id: '004F' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Heroes Gauntlet Twisted Touch',
      netRegex: NetRegexes.startsUsing({ id: '4F5E', source: 'Spectral Necromancer' }),
      netRegexDe: NetRegexes.startsUsing({ id: '4F5E', source: 'Phantom-Nekromantin' }),
      netRegexFr: NetRegexes.startsUsing({ id: '4F5E', source: 'Nécromancienne Spectrale' }),
      netRegexJa: NetRegexes.startsUsing({ id: '4F5E', source: '幻光のネクロマンサー' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Heroes Gauntlet Chaos Storm',
      netRegex: NetRegexes.startsUsing({ id: '4F60', source: 'Spectral Necromancer', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '4F60', source: 'Phantom-Nekromantin', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '4F60', source: 'Nécromancienne Spectrale', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '4F60', source: '幻光のネクロマンサー', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'Heroes Gauntlet Beastly Fury',
      netRegex: NetRegexes.startsUsing({ id: '520C', source: 'Spectral Berserker', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '520C', source: 'Phantom-Berserker', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '520C', source: 'Berserker Spectral', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '520C', source: '幻光のバーサーカー', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      // Both two and three uses of Slice can happen.
      id: 'Heroes Gauntlet Raging Slice',
      netRegex: NetRegexes.startsUsing({ id: ['520A', '520B'], source: 'Spectral Berserker', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['520A', '520B'], source: 'Phantom-Berserker', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['520A', '520B'], source: 'Berserker Spectral', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['520A', '520B'], source: '幻光のバーサーカー', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'Heroes Gauntlet Wild Rampage',
      netRegex: NetRegexes.startsUsing({ id: '5206', source: 'Spectral Berserker', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '5206', source: 'Phantom-Berserker', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '5206', source: 'Berserker Spectral', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '5206', source: '幻光のバーサーカー', capture: false }),
      alertText: {
        en: 'Get in a crater',
        de: 'In den Krater gehen',
        fr: 'Allez dans un cratère',
        ja: '穴に入る',
        ko: '구덩이에 들어가기',
      },
    },
    {
      id: 'Heroes Gauntlet Wild Rage',
      netRegex: NetRegexes.startsUsing({ id: ['5202', '5203', '5204'], source: 'Spectral Berserker', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['5202', '5203', '5204'], source: 'Phantom-Berserker', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['5202', '5203', '5204'], source: 'Berserker Spectral', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['5202', '5203', '5204'], source: '幻光のバーサーカー', capture: false }),
      suppressSeconds: 5,
      response: Responses.knockback(),
    },
    {
      // The same head marker is used for the initial player stack and the rock stacks.
      // If there's one stack marker, the players stack.
      // Otherwise they stack on the rock they drop.
      id: 'Heroes Gauntlet Wild Anguish Collect',
      netRegex: NetRegexes.headMarker({ id: '005D' }),
      run: function(data, matches) {
        data.anguish = data.anguish || [];
        data.anguish.push(matches.target);
      },
    },
    {
      id: 'Heroes Gauntlet Wild Anguish Resolve',
      netRegex: NetRegexes.headMarker({ id: '005D' }),
      delaySeconds: 1,
      suppressSeconds: 5,
      alertText: function(data, matches) {
        if (data.anguish.length > 1) {
          return {
            en: 'Stack on your rock',
            de: 'Auf deinem Stein sammeln',
            fr: 'Restez sur votre rocher',
            ja: '自分の隕石と貼りつく',
            ko: '돌과 같이 맞기',
          };
        }
        if (matches.target == data.me) {
          return {
            en: 'Stack on YOU',
            de: 'Auf DIR sammeln',
            fr: 'Package sur VOUS',
            ja: '自分にスタック',
            cn: '集合点名',
            ko: '쉐어징 대상자',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
          de: 'Auf ' + data.ShortName(matches.target) + ' sammeln',
          fr: 'Packez-vous sur ' + data.ShortName(matches.target),
          ja: data.ShortName(matches.target) + 'にスタック',
          cn: '靠近 ' + data.ShortName(matches.target) + '集合',
          ko: '쉐어징 → ' + data.ShortName(matches.target),
        };
      },
      run: function(data) {
        delete data.anguish;
      },
    },
    {
      id: 'Heroes Gauntlet Wild Anguish Spread',
      netRegex: NetRegexes.headMarker({ id: '005E' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Chicken Knife': 'Hühnermesserwurf',
        'Necrobomb': 'Nekrobomber',
        'Rubble': 'Trümmerhaufen',
        'Spectral Berserker': 'Phantom-Berserker',
        'Spectral Necromancer': 'Phantom-Nekromantin',
        'Spectral Thief': 'Phantom-Dieb',
        'The Illuminated Plaza': 'Platz der Erleuchteten',
        'The Mount Argai Mines': 'Minen des Argai',
        'The Summer Ballroom': 'Ballsaal der Grasgrummel',
      },
      'replaceText': {
        'Absolute Dark II': 'Absolutes Negra',
        'Beastly Fury': 'Animalischer Zorn',
        'Chaos Storm': 'Chaossturm',
        'Chicken Knife': 'Hühnermesserwurf',
        'Coward\'s Cunning': 'Feiger Angriff',
        'Dark Deluge': 'Finsterwelle',
        '(?<!Shadow)Dash': 'Sprint',
        'Death Throes': 'Agonales Klammern',
        'Falling Rock': 'Steinschlag',
        'Necroburst': 'Nekro-Explosion',
        'Necromancy': 'Nekromantie',
        'Pain Mire': 'Schmerzmoor',
        'Papercutter': 'Tanzakugiri',
        'Raging Slice': 'Tobsüchtiger Sichelschnitt',
        'Shadowdash': 'Schattenspaltungssprint',
        'Spectral Dream': 'Phantom-Tripple',
        'Spectral Gust': 'Phantom-Böe',
        'Spectral Whirlwind': 'Phantom-Windhose',
        'Twisted Touch': 'Verseuchte Finger',
        'Vacuum Blade': 'Vakuum-Klinge',
        'Wild Anguish': 'Bestialischer Schmerz',
        'Wild Rage': 'Bestialischer Zorn',
        'Wild Rampage': 'Bestialische Raserei',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Chicken Knife': 'Lancer de couteau de poltron',
        'Necrobomb': 'bombe nécrotique',
        'Rubble': 'tas de gravats',
        'Spectral Berserker': 'berserker spectral',
        'Spectral Necromancer': 'nécromancienne spectrale',
        'Spectral Thief': 'voleur spectral',
        'The Illuminated Plaza': 'Carré de l\'Aurore',
        'The Mount Argai Mines': 'Mines du mont Argai',
        'The Summer Ballroom': 'Bal des enfeuillés',
      },
      'replaceText': {
        'Absolute Dark II': 'Extra Ténèbres absolues',
        'Beastly Fury': 'Bête en furie',
        'Chaos Storm': 'Tempête de chaos',
        'Chicken Knife': 'Lancer de couteau de poltron',
        'Coward\'s Cunning': 'Frappe en traître',
        'Dark Deluge': 'Vague noire',
        '(?<!Shadow)Dash': 'Élan',
        'Death Throes': 'Affres de la mort',
        'Falling Rock': 'Chute de pierre',
        'Necroburst': 'Salve nécrotique',
        'Necromancy': 'Nécromancie',
        'Pain Mire': 'Marécage de souffrance',
        'Papercutter': 'Julienne de chair',
        'Raging Slice': 'Déchiquetage enragé',
        'Shadowdash': 'Élan d\'ombre',
        'Spectral Dream': 'Troïka spectrale',
        'Spectral Gust': 'Bourrasque spectrale',
        'Spectral Whirlwind': 'Grand tourbillon spectral',
        'Twisted Touch': 'Toucher purulent',
        'Vacuum Blade': 'Lame de vide',
        'Wild Anguish': 'Soubresaut bestiale',
        'Wild Rage': 'Colère bestiale',
        'Wild Rampage': 'Rage bestiale',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Chicken Knife': 'チキンナイフ投げ',
        'Necrobomb': 'ネクロボム',
        'Rubble': '瓦礫',
        'Spectral Berserker': '幻光のバーサーカー',
        'Spectral Necromancer': '幻光のネクロマンサー',
        'Spectral Thief': '幻光のシーフ',
        'The Illuminated Plaza': '大聖堂前広場',
        'The Mount Argai Mines': 'アルゲ鉱山',
        'The Summer Ballroom': '草人たちの踊り場',
      },
      'replaceText': {
        'Absolute Dark II': 'アブソリュートダーラ',
        'Beastly Fury': 'ビーストフューリー',
        'Chaos Storm': 'カオスストーム',
        'Chicken Knife': 'チキンナイフ投げ',
        'Coward\'s Cunning': '臆病者の一撃',
        'Dark Deluge': '黒い波',
        '(?<!Shadow)Dash': 'ダッシュ',
        'Death Throes': '道連れ',
        'Falling Rock': '落石',
        'Necroburst': 'ネクロバースト',
        'Necromancy': 'ネクロマンシー',
        'Pain Mire': 'ペインボグ',
        'Papercutter': '短冊斬り',
        'Raging Slice': 'レイジングスライス',
        'Shadowdash': '分身ダッシュ',
        'Spectral Dream': '幻光三段',
        'Spectral Gust': '幻光旋風',
        'Spectral Whirlwind': '幻光大旋風',
        'Twisted Touch': '穢れた指先',
        'Vacuum Blade': '真空刃',
        'Wild Anguish': '獣魂の痛み',
        'Wild Rage': '獣魂の怒り',
        'Wild Rampage': '獣魂の猛り',
      },
    },
  ],
}];
