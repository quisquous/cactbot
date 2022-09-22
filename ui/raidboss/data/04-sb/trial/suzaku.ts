import { defineTriggerSet } from '../../../../../resources/api_define_trigger_set';
import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

// Suzaku Normal
export default defineTriggerSet({
  zoneId: ZoneId.HellsKier,
  timelineFile: 'suzaku.txt',
  triggers: [
    {
      id: 'Suzaku Cremate',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3220', source: 'Suzaku' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Suzaku Screams Of The Damned',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3221', source: 'Suzaku', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Suzaku Primary Target',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '699' }),
      condition: Conditions.targetIsYou(),
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Lady tether on YOU',
          de: 'Verbindung auf DIR',
          fr: 'Lien sur VOUS',
          ja: '線ついた',
          cn: '连线点名',
          ko: '화염조 대상자',
        },
      },
    },
    {
      id: 'Suzaku Southron Star',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3234', source: 'Suzaku', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Suzaku Phantom Flurry',
      netRegex: NetRegexes.startsUsing({ id: '3231', source: 'Suzaku' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Suzaku Rekindle',
      netRegex: NetRegexes.headMarker({ id: '3230' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Suzaku Ruthless Refrain',
      netRegex: NetRegexes.startsUsing({ id: '3230', source: 'Suzaku', capture: false }),
      response: Responses.knockback(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Rapturous Echo': 'Klang[p] der Liebe',
        'Scarlet Plume': 'Flügelfeder',
        'Scarlet Tail Feather': 'Schwanzfeder',
        'Suzaku': 'Suzaku',
        'Tenzen': 'Tenzen',
      },
      'replaceText': {
        'Ashes To Ashes': 'Asche zu Asche',
        'Burn': 'Verbrennung',
        'Cremate': 'Einäschern',
        'Eternal Flame': 'Ewige Flamme',
        'Fleeting Summer': 'Vergänglicher Sommer',
        'Hotspot': 'Hitzestau',
        'Immolate': 'Opferung',
        'Incandescent Interlude': 'Glühendes Intermezzo',
        'Phantom Flurry': 'Phantomhast',
        'Phantom Half': 'Phantom Hälfte',
        'Phoenix Down': 'Phönixsturz',
        'Rekindle': 'Wiederaufleben',
        'Ruthless Refrain': 'Rabiater Refrain',
        'Scarlet Fever': 'Feuertod',
        'Scarlet Hymn': 'Zinnoberhymne',
        'Screams Of The Damned': 'Schreie der Verdammten',
        'Southron Star': 'Stern des Südens',
        'Swoop': 'Sturzflug',
        'Well Of Flame': 'Flammenbrunnen',
        'Wing And A Prayer': 'Letztes Gebet',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Rapturous Echo': 'chant d\'amour',
        'Scarlet Plume': 'plume de Suzaku',
        'Scarlet Tail Feather': 'plume de queue de Suzaku',
        'Suzaku': 'Suzaku',
        'Tenzen': 'Tenzen',
      },
      'replaceText': {
        '\\?': ' ?',
        'Ashes To Ashes': 'Cendres du phénix',
        'Burn': 'Combustion',
        'Cremate': 'Crématorium',
        'Eternal Flame': 'Flamme éternelle',
        'Fleeting Summer': 'Ailes vermillon',
        'Hotspot': 'Couleurs',
        'Immolate': 'Immolation',
        'Incandescent Interlude': 'Mélopée incandescente',
        'Phantom Flurry': 'Frénésie spectrale',
        'Phantom Half': 'Frénésie - Moitié de plateau',
        'Phoenix Down': 'Queue de phénix',
        'Rekindle': 'Ravivement',
        'Ruthless Refrain': 'Refrain impitoyable',
        'Scarlet Fever': 'Fièvre écarlate',
        'Scarlet Hymn': 'Hymne vermillon',
        'Screams Of The Damned': 'Cris des damnés',
        'Southron Star': 'Étoile australe',
        'Swoop': 'Ruée embrasée',
        'Well Of Flame': 'Puits ardent',
        'Wing And A Prayer': 'Prière de pennes',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Rapturous Echo': '愛の音色',
        'Scarlet Plume': '朱雀の羽根',
        'Scarlet Tail Feather': '朱雀の尾羽根',
        'Suzaku': '朱雀',
        'Tenzen': 'テンゼン',
      },
      'replaceText': {
        'Ashes To Ashes': '昇天',
        'Burn': '燃焼',
        'Cremate': '赤熱撃',
        'Eternal Flame': '再生の大火',
        'Fleeting Summer': '翼宿撃',
        'Hotspot': '紅蓮炎',
        'Immolate': '大燃焼',
        'Incandescent Interlude': '灼熱の調べ',
        'Phantom Flurry': '鬼宿脚',
        'Phantom Half': '鬼宿脚 (フィールド半分)',
        'Phoenix Down': '再生の羽根',
        'Rekindle': '再生の炎',
        'Ruthless Refrain': '拒絶の旋律',
        'Scarlet Fever': '焼滅天火',
        'Scarlet Hymn': '朱の旋律',
        'Screams Of The Damned': '叫喚地獄',
        'Southron Star': '星宿波',
        'Swoop': '突撃',
        'Well Of Flame': '井宿焔',
        'Wing And A Prayer': '再生の神通力',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Rapturous Echo': '爱之音',
        'Scarlet Plume': '朱雀的羽毛',
        'Scarlet Tail Feather': '朱雀的尾羽',
        'Suzaku': '朱雀',
        'Tenzen': '典膳',
      },
      'replaceText': {
        'Ashes To Ashes': '升天',
        'Burn': '燃烧',
        'Cremate': '赤热击',
        'Eternal Flame': '苏生大火',
        'Fleeting Summer': '翼宿击',
        'Hotspot': '红莲炎',
        'Immolate': '大燃烧',
        'Incandescent Interlude': '灼热旋律',
        'Phantom Flurry': '鬼宿脚',
        'Phantom Half': '半场AOE',
        'Phoenix Down': '苏生之羽',
        'Rekindle': '苏生之炎',
        'Ruthless Refrain': '拒绝旋律',
        'Scarlet Fever': '灭尽天火',
        'Scarlet Hymn': '朱红旋律',
        'Screams Of The Damned': '叫唤地狱',
        'Southron Star': '星宿波',
        'Swoop': '突击',
        'Well Of Flame': '井宿焰',
        'Wing And A Prayer': '苏生神通力',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Rapturous Echo': '사랑의 음색',
        'Scarlet Plume': '주작의 깃털',
        'Scarlet Tail Feather': '주작의 꽁지깃',
        'Suzaku': '주작',
        'Tenzen': '텐젠',
      },
      'replaceText': {
        'Ashes To Ashes': '승천',
        'Burn': '연소',
        'Cremate': '적열격',
        'Eternal Flame': '재생의 불길',
        'Fleeting Summer': '익수격',
        'Hotspot': '홍련염',
        'Immolate': '대연소',
        'Incandescent Interlude': '작열의 음률',
        'Phantom Flurry': '귀수각',
        'Phantom Half': '전방 피하기',
        'Phoenix Down': '재생의 깃털',
        'Rekindle': '재생의 불꽃',
        'Ruthless Refrain': '거절의 선율',
        'Scarlet Fever': '소멸천화',
        'Scarlet Hymn': '붉은 선율',
        'Screams Of The Damned': '규환지옥',
        'Southron Star': '성수파',
        'Swoop': '돌격',
        'Well Of Flame': '정수염',
        'Wing And A Prayer': '재생의 신통력',
      },
    },
  ],
});
