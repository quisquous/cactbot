'use strict';

// Suzaku Extreme
[{
  zoneId: ZoneId.HellsKierExtreme,
  timelineFile: 'suzaku-ex.txt',
  triggers: [
    {
      id: 'SuzEx Cremate',
      netRegex: NetRegexes.startsUsing({ id: '32D1', source: 'Suzaku' }),
      netRegexDe: NetRegexes.startsUsing({ id: '32D1', source: 'Suzaku' }),
      netRegexFr: NetRegexes.startsUsing({ id: '32D1', source: 'Suzaku' }),
      netRegexJa: NetRegexes.startsUsing({ id: '32D1', source: '朱雀' }),
      netRegexCn: NetRegexes.startsUsing({ id: '32D1', source: '朱雀' }),
      netRegexKo: NetRegexes.startsUsing({ id: '32D1', source: '주작' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'SuzEx Phantom Flurry',
      netRegex: NetRegexes.startsUsing({ id: '32DC', source: 'Suzaku', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '32DC', source: 'Suzaku', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '32DC', source: 'Suzaku', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '32DC', source: '朱雀', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '32DC', source: '朱雀', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '32DC', source: '주작', capture: false }),
      condition: function(data) {
        return data.role === 'tank' || data.role === 'healer';
      },
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Tank Buster',
          de: 'Tankbuster',
          fr: 'Tank buster',
          ja: 'タンクバスター',
          cn: '死刑',
          ko: '탱버',
        },
      },
    },
    {
      id: 'SuzEx Mesmerizing Melody',
      netRegex: NetRegexes.startsUsing({ id: '32DA', source: 'Suzaku', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '32DA', source: 'Suzaku', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '32DA', source: 'Suzaku', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '32DA', source: '朱雀', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '32DA', source: '朱雀', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '32DA', source: '주작', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Out',
          de: 'Raus da',
          fr: 'Allez au bord extérieur',
          ja: '誘引',
          cn: '远离',
          ko: '밖으로',
        },
      },
    },
    {
      id: 'SuzEx Ruthless Refrain',
      netRegex: NetRegexes.startsUsing({ id: '32DB', source: 'Suzaku', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '32DB', source: 'Suzaku', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '32DB', source: 'Suzaku', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '32DB', source: '朱雀', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '32DB', source: '朱雀', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '32DB', source: '주작', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get In',
          de: 'Rein da',
          fr: 'Allez au bord intérieur',
          ja: '拒絶',
          cn: '靠近',
          ko: '안으로',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Tenzen': 'Tenzen',
        'Scarlet Tail Feather': 'Schwanzfeder',
        'Suzaku': 'Suzaku',
      },
      'replaceText': {
        'Close-Quarter Crescendo': 'Puppencrescendo',
        'Cremate': 'Einäschern',
        'Eternal Flame': 'Ewige Flamme',
        'Fleeting Summer': 'Vergänglicher Sommer',
        'Hotspot': 'Hitzestau',
        'Incandescent Interlude': 'Glühendes Intermezzo',
        'Mesmerizing Melody': 'Bezaubernde Melodie',
        'Pay The Piper': 'Lied des Fängers',
        'Phantom Flurry': 'Phantomhast',
        'Phantom Half': 'Phantom Hälfte',
        'Phoenix Down': 'Phönixsturz',
        'Rekindle': 'Wiederaufleben',
        'Rout': 'Kolossgalopp',
        'Ruthless Refrain': 'Rabiater Refrain',
        'Ruthless/Mesmerizing': 'Refrain/Melodie',
        'Scarlet Fever': 'Feuertod',
        'Scarlet Hymn': 'Zinnoberhymne',
        'Scathing Net': 'Vernichtendes Netz',
        'Screams Of The Damned': 'Schreie der Verdammten',
        'Southron Star': 'Stern des Südens',
        'Well Of Flame': 'Flammenbrunnen',
        'Wing And A Prayer': 'Letztes Gebet',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Tenzen': 'Tenzen',
        'Scarlet Tail Feather': 'plume de queue de Suzaku',
        'Suzaku': 'Suzaku',
      },
      'replaceText': {
        'Close-Quarter Crescendo': 'Mélopée fantoche',
        'Cremate': 'Crématorium',
        'Eternal Flame': 'Flamme éternelle',
        'Fleeting Summer': 'Ailes vermillon',
        'Hotspot': 'Couleurs',
        'Incandescent Interlude': 'Mélopée incandescente',
        'Mesmerizing Melody': 'Mélodie hypnotique',
        'Pay The Piper': 'Poème fantoche',
        'Phantom Flurry': 'Frénésie spectrale',
        'Phantom Half': 'Frénésie - Moitié de plateau',
        'Phoenix Down': 'Queue de phénix',
        'Rekindle': 'Ravivement',
        'Rout': 'Irruption',
        'Ruthless/Mesmerizing': 'Refrain/Mélodie',
        'Ruthless Refrain': 'Refrain impitoyable',
        'Scarlet Fever': 'Fièvre écarlate',
        'Scarlet Hymn': 'Hymne vermillon',
        'Scathing Net': 'Étoiles des enfers',
        'Screams Of The Damned': 'Cris des damnés',
        'Southron Star': 'Étoile australe',
        'Well Of Flame': 'Puits ardent',
        'Wing And A Prayer': 'Prière de pennes',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Tenzen': 'テンゼン',
        'Scarlet Tail Feather': '朱雀の尾羽根',
        'Suzaku': '朱雀',
      },
      'replaceText': {
        'Close-Quarter Crescendo': '傀儡の調べ',
        'Cremate': '赤熱撃',
        'Eternal Flame': '再生の大火',
        'Fleeting Summer': '翼宿撃',
        'Hotspot': '紅蓮炎',
        'Incandescent Interlude': '灼熱の調べ',
        'Mesmerizing Melody': '誘引の旋律',
        'Pay The Piper': '傀儡詩',
        'Phantom Flurry': '鬼宿脚',
        'Phantom Half': '鬼宿脚 (フィールド半分)',
        'Phoenix Down': '再生の羽根',
        'Rekindle': '再生の炎',
        'Rout': '猛進',
        'Ruthless Refrain': '拒絶の旋律',
        'Ruthless/Mesmerizing': '拒絶/誘引',
        'Scarlet Fever': '焼滅天火',
        'Scarlet Hymn': '朱の旋律',
        'Scathing Net': '張宿業火',
        'Screams Of The Damned': '叫喚地獄',
        'Southron Star': '星宿波',
        'Well Of Flame': '井宿焔',
        'Wing And A Prayer': '再生の神通力',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Tenzen': '典膳',
        'Scarlet Tail Feather': '朱雀的尾羽',
        'Suzaku': '朱雀',
      },
      'replaceText': {
        'Close-Quarter Crescendo': '傀儡旋律',
        'Cremate': '赤热击',
        'Eternal Flame': '苏生大火',
        'Fleeting Summer': '翼宿击',
        'Hotspot': '红莲炎',
        'Incandescent Interlude': '灼热旋律',
        'Mesmerizing Melody': '引诱旋律',
        'Pay The Piper': '傀儡诗',
        'Phantom Flurry': '鬼宿脚',
        'Phantom Half': '半场AOE',
        'Phoenix Down': '苏生之羽',
        'Rekindle': '苏生之炎',
        'Rout': '猛进',
        'Ruthless Refrain': '拒绝旋律',
        'Ruthless/Mesmerizing': '拒绝/引诱',
        'Scarlet Fever': '灭尽天火',
        'Scarlet Hymn': '朱红旋律',
        'Scathing Net': '张宿业火',
        'Screams Of The Damned': '叫唤地狱',
        'Southron Star': '星宿波',
        'Well Of Flame': '井宿焰',
        'Wing And A Prayer': '苏生神通力',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Tenzen': '텐젠',
        'Scarlet Tail Feather': '주작의 꽁지깃',
        'Suzaku': '주작',
      },
      'replaceText': {
        'Close-Quarter Crescendo': '꼭두각시의 음률',
        'Cremate': '적열격',
        'Eternal Flame': '재생의 불길',
        'Fleeting Summer': '익수격',
        'Hotspot': '홍련염',
        'Incandescent Interlude': '작열의 음률',
        'Mesmerizing Melody': '유인의 선율',
        'Pay The Piper': '꼭두각시의 노래',
        'Phantom Flurry': '귀수각',
        'Phantom Half': '전방 피하기',
        'Phoenix Down': '재생의 깃털',
        'Rekindle': '재생의 불꽃',
        'Rout': '맹진',
        'Ruthless Refrain': '거절의 선율',
        'Ruthless/Mesmerizing': '거절/유인의 선율',
        'Scarlet Fever': '소멸천화',
        'Scarlet Hymn': '붉은 선율',
        'Scathing Net': '장수업화',
        'Screams Of The Damned': '규환지옥',
        'Southron Star': '성수파',
        'Well Of Flame': '정수염',
        'Wing And A Prayer': '재생의 신통력',
      },
    },
  ],
}];
