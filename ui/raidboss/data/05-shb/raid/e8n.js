'use strict';

[{
  zoneRegex: {
    en: /^Eden's Verse: Refulgence$/,
    ko: /^희망의 낙원 에덴: 공명편 \(4\)$/,
  },
  timelineFile: 'e8n.txt',
  timelineTriggers: [
    {
      id: 'E8N Shining Armor',
      regex: /Shining Armor/,
      beforeSeconds: 2,
      response: Responses.lookAway('alert'),
    },
  ],
  triggers: [
    {
      id: 'E8N Mirrors Active',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4DD4', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4DD4', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4DD4', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4DD4', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4DD4', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4DD4', capture: false }),
      run: function(data) {
        data.mirrorsActive = true;
      },
    },
    {
      id: 'E8N Biting Frost',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4DDB', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4DDB', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4DDB', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4DDB', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4DDB', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4DDB', capture: false }),
      condition: function(data) {
        return !data.mirrorsActive;
      },
      response: Responses.getBehind(),
    },
    {
      id: 'E8N Driving Frost',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4DDC', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4DDC', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4DDC', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4DDC', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4DDC', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4DDC', capture: false }),
      condition: function(data) {
        return !data.mirrorsActive;
      },
      alertText: {
        en: 'Go Front / Sides',
        de: 'Gehe nach Vorne/ zu den Seiten',
        fr: 'Allez devant / sur les côtés',
        ko: '앞 / 양옆으로',
      },
    },
    {
      id: 'E8N Axe Kick',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4DE2', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4DE2', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4DE2', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4DE2', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4DE2', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4DE2', capture: false }),
      condition: function(data) {
        return !data.mirrorsActive;
      },
      response: Responses.getOut(),
    },
    {
      id: 'E8N Scythe Kick',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4DE3', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4DE3', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4DE3', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4DE3', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4DE3', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4DE3', capture: false }),
      response: Responses.getUnder(),
    },
    {
      id: 'E8N Biting Frost With Mirror',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4DDB', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4DDB', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4DDB', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4DDB', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4DDB', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4DDB', capture: false }),
      condition: function(data) {
        return data.mirrorsActive;
      },
      alertText: {
        en: 'Get behind, then South',
        de: 'Gehe nach Hinten, danach in den Süden',
        fr: 'Passez derrière, puis au Sud',
        ko: '보스 뒤로 => 남쪽으로',
      },
    },
    {
      id: 'E8N Driving Frost With Mirror',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4DDC', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4DDC', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4DDC', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4DDC', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4DDC', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4DDC', capture: false }),
      condition: function(data) {
        return data.mirrorsActive;
      },
      alertText: {
        en: 'Go Front / Sides, then North',
        de: 'Gehe nach Vorne, danach in den Norden',
        fr: 'Allez devant / sur les côtés, puis au Nord',
        ko: '앞/양옆으로 => 북쪽으로',
      },
    },
    {
      id: 'E8N Axe Kick With Mirror',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4DE2', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4DE2', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4DE2', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4DE2', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4DE2', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4DE2', capture: false }),
      condition: function(data) {
        return data.mirrorsActive;
      },
      response: Responses.getOutThenIn(),
    },
    {
      id: 'E8N Reflected Scythe Kick',
      regex: Regexes.startsUsing({ source: 'Frozen Mirror', id: '4E01', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Eisspiegel', id: '4E01', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Miroir De Glace', id: '4E01', capture: false }),
      regexJa: Regexes.startsUsing({ source: '氷面鏡', id: '4E01', capture: false }),
      suppressSeconds: 3,
      infoText: {
        en: 'Close to mirrors',
        de: 'Nahe zu den Spiegeln',
        fr: 'Près des mirroirs',
        ko: '거울 밑으로',
      },
    },
    {
      id: 'E8N Mirror Cleanup',
      regex: Regexes.startsUsing({ source: 'Frozen Mirror', id: ['4DFE', '4DFF', '4E00', '4E01'], capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Eisspiegel', id: ['4DFE', '4DFF', '4E00', '4E01'], capture: false }),
      regexFr: Regexes.startsUsing({ source: 'miroir de glace', id: ['4DFE', '4DFF', '4E00', '4E01'], capture: false }),
      regexJa: Regexes.startsUsing({ source: '氷面鏡', id: ['4DFE', '4DFF', '4E00', '4E01'], capture: false }),
      // Maybe not necessary to delay here, but just to be safe.
      delaySeconds: 5,
      run: function(data) {
        data.mirrorsActive = false;
      },
    },
    {
      id: 'E8N Absolute Zero',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4DD7', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4DD7', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4DD7', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4DD7', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4DD7', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4DD7', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E8N Double Slap',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4DDA' }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4DDA' }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4DDA' }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4DDA' }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4DDA' }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4DDA' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'E8N Frigid Water',
      regex: Regexes.headMarker({ id: '0057' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Flare on YOU',
        de: 'Flare auf DIR',
        fr: 'Brasier sur VOUS',
        ko: '플레어 대상자',
      },
    },
    {
      id: 'E8N Icicle Impact',
      regex: Regexes.headMarker({ id: '0060' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'E8N Puddle Chase',
      regex: Regexes.headMarker({ id: '00C5' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: '3x puddles on YOU',
        de: '3x Fläche auf DIR',
        fr: '3x Zones au sol sur vous',
        ko: '따라오는 장판 피하기',
      },
    },
    {
      id: 'E8N Holy',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4DEC', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4DEC', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4DEC', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4DEC', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4DEC', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4DEC', capture: false }),
      response: Responses.getOut('info'),
    },
    {
      id: 'E8N Holy Divided',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4DED', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4DED', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4DED', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4DED', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4DED', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4DED', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'E8N Light Rampant Collect',
      regex: Regexes.headMarker({ id: '0017' }),
      run: function(data, matches) {
        data.rampant = data.rampant || {};
        data.rampant[matches.target] = matches.id;
      },
    },
    {
      id: 'E8N Light Rampant',
      regex: Regexes.headMarker({ id: '0017', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 2,
      alertText: function(data) {
        if (data.rampant[data.me]) {
          return {
            en: 'Cone on YOU -- avoid towers',
            de: 'Kegel AoE auf DIR -- Turm vermeiden',
            fr: 'Cône sur Vous -- évitez les tours',
            ko: '부채꼴 대상자 - 장판 피하기',
          };
        }
        return {
          en: 'Stand in a tower',
          de: 'Im Turm stehen',
          fr: 'Tenez-vous dans une tour',
          ko: '장판 들어가기',
        };
      },
    },
    {
      id: 'E8N Light Rampant Cleanup',
      regex: Regexes.ability({ source: 'Shiva', id: '4E0B', capture: false }),
      regexDe: Regexes.ability({ source: 'Shiva', id: '4E0B', capture: false }),
      regexFr: Regexes.ability({ source: 'Shiva', id: '4E0B', capture: false }),
      regexJa: Regexes.ability({ source: 'シヴァ', id: '4E0B', capture: false }),
      regexCn: Regexes.ability({ source: '希瓦', id: '4E0B', capture: false }),
      regexKo: Regexes.ability({ source: '시바', id: '4E0B', capture: false }),
      run: function(data) {
        delete data.rampant;
      },
    },
    {
      id: 'E8N Heavenly Strike',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4DD8', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4DD8', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4DD8', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4DD8', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4DD8', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4DD8', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'E8N Twin Stillness',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4DDD', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4DDD', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4DDD', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4DDD', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4DDD', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4DDD', capture: false }),
      response: Responses.getBackThenFront('alert'),
    },
    {
      id: 'E8N Twin Silence',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4DDE', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4DDE', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4DDE', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4DDE', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4DDE', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4DDE', capture: false }),
      response: Responses.getFrontThenBack('alert'),
    },
    {
      id: 'E8N Spiteful Dance',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4DE4', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4DE4', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4DE4', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4DE4', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4DE4', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4DE4', capture: false }),
      response: Responses.getOutThenIn(),
    },
    {
      id: 'E8N Embittered Dance',
      regex: Regexes.startsUsing({ source: 'Shiva', id: '4DE5', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Shiva', id: '4DE5', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Shiva', id: '4DE5', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'シヴァ', id: '4DE5', capture: false }),
      regexCn: Regexes.startsUsing({ source: '希瓦', id: '4DE5', capture: false }),
      regexKo: Regexes.startsUsing({ source: '시바', id: '4DE5', capture: false }),
      response: Responses.getInThenOut(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Luminous Aether': 'Lichtäther',
        'Holy Light': 'heiliges Licht',
        'Frozen Mirror': 'Eisspiegel',
        'Electric Aether': 'Blitzäther',
        'Earthen Aether': 'Erdäther',
        'Aqueous Aether': 'Wasseräther',
        'Shiva': 'Shiva',
        'Mothercrystal': 'Urkristall',
      },
      'replaceText': {
        'The Path of Light': 'Pfad des Lichts',
        'Twin Stillness': 'Zwillingsschwerter der Stille',
        'Stoneskin': 'Steinhaut',
        'Spiteful Dance': 'Kalter Tanz',
        'Skyfall': 'Vernichtung der Welt',
        'Shock Spikes': 'Schockstachel',
        'Shining Armor': 'Funkelnde Rüstung',
        'Shattered World': 'Zersplitterte Welt',
        'Scythe Kick': 'Abwehrtritt',
        'Rush': 'Sturm',
        'Reflected Scythe Kick': 'Spiegelung: Abwehrtritt',
        'Reflected Biting Frost': 'Spiegelung: Frosthieb',
        'Redress': 'Beseitigung',
        'Mirror, Mirror': 'Spiegelland',
        'Light Rampant': 'Überflutendes Licht',
        'Icicle Impact': 'Eiszapfen-Schlag',
        'Holy': 'Sanctus',
        'Heavenly Strike': 'Elysischer Schlag',
        'Heart Asunder': 'Herzensbrecher',
        'Frost Armor(?! )': 'Frostrüstung',
        'Frigid Water': 'Eisfrost',
        'Frigid Stone': 'Eisstein',
        'Frigid Eruption': 'Eiseruption',
        'Driving Frost': 'Froststoß',
        'Double Slap': 'Doppelschlag',
        'Diamond Frost': 'Diamantstaub',
        'Bright Hunger': 'Erosionslicht',
        'Biting Frost': 'Frosthieb',
        'Axe Kick': 'Axttritt',
        'Absolute Zero': 'Absoluter Nullpunkt',
        'Twin Silence/Stillness': 'Zwillingsschwerter Der Ruhe/Stille',
        'Spiteful/Embittered Dance': 'Kalter/Strenger Tanz',
        'Reflected Kick/Frost': 'Spiegelung Tritt/Frost',
        'Reflected Frost': 'Spiegelung Frost',
        '(?<! )Kick/Frost': 'Tritt/Frost',
      },
      '~effectNames': {
        'Thin Ice': 'Glatteis',
        'Physical Vulnerability Up': 'Erhöhte physische Verwundbarkeit',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Heavy': 'Gewicht',
        'Freezing': 'Allmähliche Kühlung',
        'Down for the Count': 'Am Boden',
        'Deep Freeze': 'Tiefkühlung',
        'Damage Down': 'Schaden -',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Luminous Aether': 'Éther De Lumière',
        'Holy Light': 'Lumière Sacrée',
        'Frozen Mirror': 'miroir de glace',
        'Electric Aether': 'Éther De Foudre',
        'Earthen Aether': 'Éther De Terre',
        'Aqueous Aether': 'Éther D\'eau',
        'Shiva': 'Shiva',
        'Mothercrystal': 'Cristal-Mère',
      },
      'replaceText': {
        'The Path of Light': 'Voie de lumière',
        'Twin Stillness': 'Entaille de la quiétude',
        'Twin Silence': 'Entaille de la tranquilité',
        'Stoneskin': 'Cuirasse',
        'Spiteful Dance': 'Danse de la froideur',
        'Skyfall': 'Anéantissement',
        'Shock Spikes': 'Pointes de foudre',
        'Shining Armor': 'Armure scintillante',
        'Shattered World': 'Monde fracassé',
        'Scythe Kick': 'Jambe faucheuse',
        'Rush': 'Jaillissement',
        'Reflected Kick/Frost': 'Jambe/Givre Réverbéré',
        'Reflected Frost': 'Givre Réverbéré',
        'Redress': 'Parure',
        'Mirror, Mirror': 'Monde des miroirs',
        '(?<! )Kick/Frost': 'Jambe/Givre',
        'Light Rampant': 'Débordement de Lumière',
        'Icicle Impact': 'Impact de stalactite',
        'Holy': 'Miracle',
        'Heavenly Strike': 'Frappe céleste',
        'Heart Asunder': 'Cœur déchiré',
        'Frost Armor': 'Armure de givre',
        'Frigid Water': 'Cataracte gelée',
        'Frigid Stone': 'Rocher de glace',
        'Frigid Eruption': 'Éruption de glace',
        'Embittered Dance': 'Danse de la sévérité',
        'Driving Frost': 'Percée de givre',
        'Double Slap': 'Gifle redoublée',
        'Diamond Frost': 'Poussière de diamant',
        'Bright Hunger': 'Lumière dévorante',
        'Biting Frost': 'Taillade de givre',
        'Axe Kick': 'Jambe pourfendeuse',
        'Absolute Zero': 'Zéro absolu',
      },
      '~effectNames': {
        'Thin Ice': 'Verglas',
        'Physical Vulnerability Up': 'Vulnérabilité physique augmentée',
        'Magic Vulnerability Up': 'Vulnérabilité magique augmentée',
        'Heavy': 'Pesanteur',
        'Freezing': 'Congélation graduelle',
        'Down for the Count': 'Au tapis',
        'Deep Freeze': 'Congélation',
        'Damage Down': 'Malus de dégâts',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Luminous Aether': 'ライト・エーテル',
        'Holy Light': '聖なる光',
        'Frozen Mirror': '氷面鏡',
        'Electric Aether': 'ライトニング・エーテル',
        'Earthen Aether': 'アース・エーテル',
        'Aqueous Aether': 'ウォーター・エーテル',
        'Shiva': 'シヴァ',
        'Mothercrystal': 'マザークリスタル',
      },
      'replaceText': {
        'The Path of Light': '光の波動',
        'attack': '攻撃',
        'Twin Stillness': '静寂の双剣技',
        'Stoneskin': 'ストンスキン',
        'Spiteful Dance': '冷厳の舞踏技',
        'Skyfall': '世界消滅',
        'Shock Spikes': 'ショックスパイク',
        'Shining Armor': 'ブライトアーマー',
        'Shattered World': 'シャッタード・ワールド',
        'Scythe Kick': 'サイスキック',
        'Rush': 'ラッシュ',
        'Reflected Scythe Kick': 'ミラーリング・サイスキック',
        'Reflected Biting Frost': 'ミラーリング・フロストスラッシュ',
        'Redress': 'ドレスアップ',
        'Mirror, Mirror': '鏡の国',
        'Light Rampant': '光の暴走',
        'Icicle Impact': 'アイシクルインパクト',
        'Holy': 'ホーリー',
        'Heavenly Strike': 'ヘヴンリーストライク',
        'Heart Asunder': 'ハートアサンダー',
        'Frost Armor(?! )': 'フロストアーマー',
        'Frigid Water': 'アイスフロスト',
        'Frigid Stone': 'アイスストーン',
        'Frigid Eruption': 'アイスエラプション',
        'Driving Frost': 'フロストスラスト',
        'Double Slap': 'ダブルスラップ',
        'Diamond Frost': 'ダイヤモンドダスト',
        'Bright Hunger': '浸食光',
        'Biting Frost': 'フロストスラッシュ',
        'Axe Kick': 'アクスキック',
        'Absolute Zero': '絶対零度',
      },
      '~effectNames': {
        'Thin Ice': '氷床',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Heavy': 'ヘヴィ',
        'Freezing': '徐々に氷結',
        'Down for the Count': 'ノックダウン',
        'Deep Freeze': '氷結',
        'Damage Down': 'ダメージ低下',
      },
    },
  ],
}];
